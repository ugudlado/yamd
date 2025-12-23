import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { router, protectedProcedure } from './index.js'
import { addToWatchlistSchema, updateWatchlistSchema, watchlistQuerySchema } from '@yamd/shared'
import { PATRON_TIERS } from '@yamd/shared'

export const watchlistRouter = router({
  // Get user's watchlist
  list: protectedProcedure
    .input(watchlistQuerySchema)
    .query(async ({ ctx, input }) => {
      const { status, page, limit } = input

      const where = {
        userId: ctx.user.id,
        ...(status ? { status } : {}),
      }

      const [items, total] = await Promise.all([
        ctx.prisma.watchlistItem.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            movie: {
              include: {
                cast: {
                  where: { role: { in: ['lead_actor', 'director'] } },
                  include: { person: true },
                  take: 3,
                },
              },
            },
          },
        }),
        ctx.prisma.watchlistItem.count({ where }),
      ])

      return {
        items,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      }
    }),

  // Get watchlist stats
  stats: protectedProcedure.query(async ({ ctx }) => {
    const stats = await ctx.prisma.watchlistItem.groupBy({
      by: ['status'],
      where: { userId: ctx.user.id },
      _count: true,
    })

    const result = {
      total: 0,
      wantToWatch: 0,
      watching: 0,
      watched: 0,
      liked: 0,
      recommended: 0,
      dropped: 0,
    }

    for (const stat of stats) {
      result.total += stat._count
      switch (stat.status) {
        case 'want_to_watch':
          result.wantToWatch = stat._count
          break
        case 'watching':
          result.watching = stat._count
          break
        case 'watched':
          result.watched = stat._count
          break
        case 'liked':
          result.liked = stat._count
          break
        case 'recommended':
          result.recommended = stat._count
          break
        case 'dropped':
          result.dropped = stat._count
          break
      }
    }

    return result
  }),

  // Add movie to watchlist
  add: protectedProcedure
    .input(addToWatchlistSchema)
    .mutation(async ({ ctx, input }) => {
      // Check watchlist limit for free users
      if (!ctx.user.isPatron) {
        const count = await ctx.prisma.watchlistItem.count({
          where: { userId: ctx.user.id },
        })
        const limit = PATRON_TIERS.free.watchlistLimit
        if (count >= limit) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: `Free users are limited to ${limit} movies. Upgrade to add more!`,
          })
        }
      }

      // Check if movie exists
      const movie = await ctx.prisma.movie.findUnique({
        where: { id: input.movieId },
      })
      if (!movie) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Movie not found' })
      }

      // Check if already in watchlist
      const existing = await ctx.prisma.watchlistItem.findUnique({
        where: {
          userId_movieId: {
            userId: ctx.user.id,
            movieId: input.movieId,
          },
        },
      })

      if (existing) {
        // Update existing
        return ctx.prisma.watchlistItem.update({
          where: { id: existing.id },
          data: { status: input.status, notes: input.notes },
          include: { movie: true },
        })
      }

      // Create new
      return ctx.prisma.watchlistItem.create({
        data: {
          userId: ctx.user.id,
          movieId: input.movieId,
          status: input.status,
          notes: input.notes,
        },
        include: { movie: true },
      })
    }),

  // Update watchlist item
  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: updateWatchlistSchema,
    }))
    .mutation(async ({ ctx, input }) => {
      const item = await ctx.prisma.watchlistItem.findUnique({
        where: { id: input.id },
      })

      if (!item) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Watchlist item not found' })
      }

      if (item.userId !== ctx.user.id) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Not your watchlist item' })
      }

      return ctx.prisma.watchlistItem.update({
        where: { id: input.id },
        data: input.data,
        include: { movie: true },
      })
    }),

  // Remove from watchlist
  remove: protectedProcedure
    .input(z.object({ movieId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const item = await ctx.prisma.watchlistItem.findUnique({
        where: {
          userId_movieId: {
            userId: ctx.user.id,
            movieId: input.movieId,
          },
        },
      })

      if (!item) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Movie not in watchlist' })
      }

      await ctx.prisma.watchlistItem.delete({
        where: { id: item.id },
      })

      return { success: true }
    }),

  // Check if movie is in watchlist
  check: protectedProcedure
    .input(z.object({ movieId: z.string() }))
    .query(async ({ ctx, input }) => {
      const item = await ctx.prisma.watchlistItem.findUnique({
        where: {
          userId_movieId: {
            userId: ctx.user.id,
            movieId: input.movieId,
          },
        },
      })

      return item
    }),

  // Get recommendations based on watchlist
  recommendations: protectedProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ ctx, input }) => {
      // Get user's liked/recommended movies
      const likedItems = await ctx.prisma.watchlistItem.findMany({
        where: {
          userId: ctx.user.id,
          status: { in: ['liked', 'recommended'] },
        },
        include: {
          movie: {
            include: {
              cast: {
                where: { role: { in: ['lead_actor', 'director', 'music_director'] } },
              },
            },
          },
        },
        take: 10,
      })

      if (likedItems.length === 0) {
        // No liked movies, return popular ones
        return ctx.prisma.movie.findMany({
          orderBy: { avgRating: 'desc' },
          take: input.limit,
          include: {
            cast: {
              where: { role: { in: ['lead_actor', 'director'] } },
              include: { person: true },
              take: 3,
            },
          },
        })
      }

      // Collect actor/director IDs from liked movies
      const personIds = new Set<string>()
      const industries = new Set<string>()
      const languages = new Set<string>()
      const watchedMovieIds = new Set<string>()

      for (const item of likedItems) {
        watchedMovieIds.add(item.movieId)
        industries.add(item.movie.industry)
        languages.add(item.movie.language)
        for (const cast of item.movie.cast) {
          personIds.add(cast.personId)
        }
      }

      // Get all watched movie IDs to exclude
      const allWatched = await ctx.prisma.watchlistItem.findMany({
        where: { userId: ctx.user.id },
        select: { movieId: true },
      })
      for (const w of allWatched) {
        watchedMovieIds.add(w.movieId)
      }

      // Find similar movies
      return ctx.prisma.movie.findMany({
        where: {
          id: { notIn: Array.from(watchedMovieIds) },
          OR: [
            { cast: { some: { personId: { in: Array.from(personIds) } } } },
            { industry: { in: Array.from(industries) } },
            { language: { in: Array.from(languages) } },
          ],
        },
        orderBy: { avgRating: 'desc' },
        take: input.limit,
        include: {
          cast: {
            where: { role: { in: ['lead_actor', 'director'] } },
            include: { person: true },
            take: 3,
          },
        },
      })
    }),
})
