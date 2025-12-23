import type { CreateExpressContextOptions } from '@trpc/server/adapters/express'
import { prisma } from './db.js'
import { verifyToken } from './services/auth.js'

export async function createContext({ req }: CreateExpressContextOptions) {
  // Get token from header
  const authHeader = req.headers.authorization
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

  // Verify token and get user
  let user = null
  if (token) {
    try {
      const payload = verifyToken(token)
      if (payload) {
        user = await prisma.user.findUnique({
          where: { id: payload.userId },
          select: {
            id: true,
            email: true,
            name: true,
            avatarUrl: true,
            isPatron: true,
            patronTier: true,
          },
        })
      }
    } catch {
      // Invalid token, user stays null
    }
  }

  return {
    prisma,
    user,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
