import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { router, protectedProcedure } from './index.js'
import { contributionSchema } from '@yamd/shared'

export const contributionRouter = router({
  // Submit a contribution
  submit: protectedProcedure
    .input(contributionSchema)
    .mutation(async ({ ctx, input }) => {
      const contribution = await ctx.prisma.contribution.create({
        data: {
          userId: ctx.user.id,
          ...input,
        },
      })

      return contribution
    }),

  // Get user's contributions
  myContributions: protectedProcedure
    .input(z.object({
      status: z.enum(['pending', 'approved', 'rejected']).optional(),
      page: z.number().default(1),
      limit: z.number().default(20),
    }))
    .query(async ({ ctx, input }) => {
      const { status, page, limit } = input

      const where = {
        userId: ctx.user.id,
        ...(status ? { status } : {}),
      }

      const [contributions, total] = await Promise.all([
        ctx.prisma.contribution.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            movie: { select: { id: true, title: true } },
          },
        }),
        ctx.prisma.contribution.count({ where }),
      ])

      return {
        contributions,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      }
    }),

  // Get pending contributions (for moderators - simplified version)
  pending: protectedProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(20),
    }))
    .query(async ({ ctx, input }) => {
      // In a real app, you'd check for moderator role
      if (!ctx.user.isPatron) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only patrons can moderate contributions',
        })
      }

      const { page, limit } = input

      const [contributions, total] = await Promise.all([
        ctx.prisma.contribution.findMany({
          where: { status: 'pending' },
          orderBy: { createdAt: 'asc' },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            user: { select: { id: true, name: true, avatarUrl: true } },
            movie: { select: { id: true, title: true } },
          },
        }),
        ctx.prisma.contribution.count({ where: { status: 'pending' } }),
      ])

      return {
        contributions,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      }
    }),

  // Approve/reject contribution
  moderate: protectedProcedure
    .input(z.object({
      id: z.string(),
      status: z.enum(['approved', 'rejected']),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user.isPatron) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only patrons can moderate contributions',
        })
      }

      const contribution = await ctx.prisma.contribution.findUnique({
        where: { id: input.id },
      })

      if (!contribution) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Contribution not found' })
      }

      if (contribution.status !== 'pending') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Contribution already moderated',
        })
      }

      // Update contribution status
      const updated = await ctx.prisma.contribution.update({
        where: { id: input.id },
        data: { status: input.status },
      })

      // If approved, update user's contribution count
      if (input.status === 'approved') {
        await ctx.prisma.user.update({
          where: { id: contribution.userId },
          data: { contributionCount: { increment: 1 } },
        })

        // Apply the contribution to the entity
        // This is simplified - in production you'd handle different entity types
        if (contribution.entityType === 'movie' && contribution.movieId) {
          try {
            const updateData = { [contribution.fieldChanged]: contribution.newValue }
            await ctx.prisma.movie.update({
              where: { id: contribution.movieId },
              data: updateData,
            })
          } catch {
            // Field might not exist or be invalid, ignore
          }
        }
      }

      return updated
    }),
})
