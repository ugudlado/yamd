import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { router, publicProcedure, protectedProcedure } from './index.js'
import { movieQuerySchema, createMovieSchema } from '@yamd/shared'
import { decadeToYearRange } from '@yamd/shared'
import type { Prisma } from '@prisma/client'

export const movieRouter = router({
  // Complex search with multiple criteria
  search: publicProcedure
    .input(movieQuerySchema)
    .query(async ({ ctx, input }) => {
      const {
        search,
        actors,
        directors,
        musicDirectors,
        yearRange,
        decade,
        industries,
        languages,
        ratingMin,
        ratingMax,
        sortBy,
        sortOrder,
        page,
        limit,
      } = input

      // Build where clause
      const where: Prisma.MovieWhereInput = {}
      const conditions: Prisma.MovieWhereInput[] = []

      // Text search
      if (search) {
        conditions.push({
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { titleHindi: { contains: search, mode: 'insensitive' } },
            { titleRegional: { contains: search, mode: 'insensitive' } },
            { plot: { contains: search, mode: 'insensitive' } },
          ],
        })
      }

      // Year range
      if (yearRange) {
        where.year = { gte: yearRange[0], lte: yearRange[1] }
      } else if (decade) {
        const [start, end] = decadeToYearRange(decade as any)
        where.year = { gte: start, lte: end }
      }

      // Industry filter
      if (industries && industries.length > 0) {
        where.industry = { in: industries }
      }

      // Language filter
      if (languages && languages.length > 0) {
        where.language = { in: languages }
      }

      // Rating filter
      if (ratingMin !== undefined) {
        where.avgRating = { gte: ratingMin }
      }
      if (ratingMax !== undefined) {
        where.avgRating = { ...where.avgRating, lte: ratingMax }
      }

      // Actor filter (AND - must have ALL actors)
      if (actors && actors.length > 0) {
        for (const actorName of actors) {
          conditions.push({
            cast: {
              some: {
                role: { in: ['lead_actor', 'supporting_actor'] },
                person: { name: { contains: actorName, mode: 'insensitive' } },
              },
            },
          })
        }
      }

      // Director filter
      if (directors && directors.length > 0) {
        conditions.push({
          cast: {
            some: {
              role: 'director',
              person: { name: { in: directors } },
            },
          },
        })
      }

      // Music director filter
      if (musicDirectors && musicDirectors.length > 0) {
        conditions.push({
          cast: {
            some: {
              role: 'music_director',
              person: { name: { in: musicDirectors } },
            },
          },
        })
      }

      // Combine conditions
      if (conditions.length > 0) {
        where.AND = conditions
      }

      // Sorting
      const orderBy: Prisma.MovieOrderByWithRelationInput = {}
      switch (sortBy) {
        case 'year':
          orderBy.year = sortOrder
          break
        case 'rating':
          orderBy.avgRating = sortOrder
          break
        case 'title':
          orderBy.title = sortOrder
          break
        case 'recent':
        default:
          orderBy.createdAt = sortOrder
          break
      }

      // Execute query
      const [movies, total] = await Promise.all([
        ctx.prisma.movie.findMany({
          where,
          orderBy,
          skip: (page - 1) * limit,
          take: limit,
          include: {
            cast: {
              include: { person: true },
              orderBy: { role: 'asc' },
            },
          },
        }),
        ctx.prisma.movie.count({ where }),
      ])

      return {
        movies,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      }
    }),

  // Get single movie by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const movie = await ctx.prisma.movie.findUnique({
        where: { id: input.id },
        include: {
          cast: {
            include: { person: true },
            orderBy: { role: 'asc' },
          },
        },
      })

      if (!movie) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Movie not found' })
      }

      return movie
    }),

  // Get movies by person (filmography)
  getByPerson: publicProcedure
    .input(z.object({
      personId: z.string(),
      role: z.string().optional(),
      page: z.number().default(1),
      limit: z.number().default(20),
    }))
    .query(async ({ ctx, input }) => {
      const { personId, role, page, limit } = input

      const where: Prisma.MovieWhereInput = {
        cast: {
          some: {
            personId,
            ...(role ? { role } : {}),
          },
        },
      }

      const [movies, total] = await Promise.all([
        ctx.prisma.movie.findMany({
          where,
          orderBy: { year: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            cast: {
              where: { personId },
              include: { person: true },
            },
          },
        }),
        ctx.prisma.movie.count({ where }),
      ])

      return {
        movies,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      }
    }),

  // Create movie (protected, for contributions)
  create: protectedProcedure
    .input(createMovieSchema)
    .mutation(async ({ ctx, input }) => {
      const movie = await ctx.prisma.movie.create({
        data: input,
      })

      // Create contribution record
      await ctx.prisma.contribution.create({
        data: {
          userId: ctx.user.id,
          movieId: movie.id,
          entityType: 'movie',
          entityId: movie.id,
          fieldChanged: 'created',
          newValue: JSON.stringify(input),
          status: 'approved', // Auto-approve new movies for now
        },
      })

      // Update user contribution count
      await ctx.prisma.user.update({
        where: { id: ctx.user.id },
        data: { contributionCount: { increment: 1 } },
      })

      return movie
    }),

  // Get popular movies
  popular: publicProcedure
    .input(z.object({
      industry: z.string().optional(),
      limit: z.number().default(10),
    }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.movie.findMany({
        where: input.industry ? { industry: input.industry } : undefined,
        orderBy: [
          { avgRating: 'desc' },
          { voteCount: 'desc' },
        ],
        take: input.limit,
        include: {
          cast: {
            where: { role: { in: ['lead_actor', 'director'] } },
            include: { person: true },
            take: 5,
          },
        },
      })
    }),

  // Get recent additions
  recent: publicProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.movie.findMany({
        orderBy: { createdAt: 'desc' },
        take: input.limit,
        include: {
          cast: {
            where: { role: { in: ['lead_actor', 'director'] } },
            include: { person: true },
            take: 5,
          },
        },
      })
    }),

  // Get all unique people for autocomplete
  people: publicProcedure
    .input(z.object({
      search: z.string().optional(),
      role: z.string().optional(),
      limit: z.number().default(20),
    }))
    .query(async ({ ctx, input }) => {
      const where: Prisma.PersonWhereInput = {}

      if (input.search) {
        where.name = { contains: input.search, mode: 'insensitive' }
      }

      if (input.role) {
        where.movies = { some: { role: input.role } }
      }

      return ctx.prisma.person.findMany({
        where,
        take: input.limit,
        orderBy: { name: 'asc' },
        include: {
          _count: { select: { movies: true } },
        },
      })
    }),

  // Get person by ID
  getPerson: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const person = await ctx.prisma.person.findUnique({
        where: { id: input.id },
        include: {
          movies: {
            include: { movie: true },
            orderBy: { movie: { year: 'desc' } },
          },
        },
      })

      if (!person) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Person not found' })
      }

      return person
    }),
})
