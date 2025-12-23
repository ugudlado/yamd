import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { router, publicProcedure, protectedProcedure } from './index.js'
import { loginSchema, registerSchema, updateProfileSchema } from '@yamd/shared'
import { hashPassword, verifyPassword, generateToken } from '../services/auth.js'

export const userRouter = router({
  // Register new user
  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ ctx, input }) => {
      // Check if email exists
      const existing = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      })

      if (existing) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Email already registered',
        })
      }

      // Create user
      const passwordHash = await hashPassword(input.password)
      const user = await ctx.prisma.user.create({
        data: {
          email: input.email,
          name: input.name,
          passwordHash,
        },
      })

      // Generate token
      const token = generateToken({ userId: user.id, email: user.email })

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
          isPatron: user.isPatron,
          patronTier: user.patronTier,
        },
        token,
      }
    }),

  // Login
  login: publicProcedure
    .input(loginSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      })

      if (!user || !user.passwordHash) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid email or password',
        })
      }

      const valid = await verifyPassword(input.password, user.passwordHash)
      if (!valid) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid email or password',
        })
      }

      const token = generateToken({ userId: user.id, email: user.email })

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
          isPatron: user.isPatron,
          patronTier: user.patronTier,
        },
        token,
      }
    }),

  // Get current user
  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.user.id },
      include: {
        _count: {
          select: {
            watchlist: true,
            contributions: true,
          },
        },
      },
    })

    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      isPatron: user.isPatron,
      patronTier: user.patronTier,
      contributionCount: user.contributionCount,
      watchlistCount: user._count.watchlist,
      createdAt: user.createdAt,
    }
  }),

  // Update profile
  updateProfile: protectedProcedure
    .input(updateProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: { id: ctx.user.id },
        data: input,
      })

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        isPatron: user.isPatron,
        patronTier: user.patronTier,
      }
    }),

  // Get public profile
  getProfile: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.id },
        include: {
          _count: {
            select: {
              watchlist: true,
              contributions: { where: { status: 'approved' } },
            },
          },
        },
      })

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
      }

      return {
        id: user.id,
        name: user.name,
        avatarUrl: user.avatarUrl,
        isPatron: user.isPatron,
        patronTier: user.patronTier,
        contributionCount: user.contributionCount,
        watchlistCount: user._count.watchlist,
        createdAt: user.createdAt,
      }
    }),

  // Get leaderboard (top contributors)
  leaderboard: publicProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.user.findMany({
        where: { contributionCount: { gt: 0 } },
        orderBy: { contributionCount: 'desc' },
        take: input.limit,
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          isPatron: true,
          patronTier: true,
          contributionCount: true,
        },
      })
    }),
})
