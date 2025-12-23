import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'
import type { Context } from '../context.js'
import { movieRouter } from './movie.js'
import { userRouter } from './user.js'
import { watchlistRouter } from './watchlist.js'
import { contributionRouter } from './contribution.js'

const t = initTRPC.context<Context>().create({
  transformer: superjson,
})

export const router = t.router
export const publicProcedure = t.procedure

// Middleware that requires authentication
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You must be logged in' })
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  })
})

// Middleware for patron-only features
export const patronProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (!ctx.user.isPatron) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'This feature requires a patron subscription'
    })
  }
  return next({ ctx })
})

export const appRouter = router({
  movie: movieRouter,
  user: userRouter,
  watchlist: watchlistRouter,
  contribution: contributionRouter,
})

export type AppRouter = typeof appRouter
