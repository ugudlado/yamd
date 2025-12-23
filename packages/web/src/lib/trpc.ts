import { createTRPCReact, httpBatchLink } from '@trpc/react-query'
import superjson from 'superjson'
import type { AppRouter } from '@yamd/api'

export const trpc = createTRPCReact<AppRouter>()

function getAuthToken() {
  return localStorage.getItem('token')
}

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: '/trpc',
      headers() {
        const token = getAuthToken()
        return token ? { authorization: `Bearer ${token}` } : {}
      },
      transformer: superjson,
    }),
  ],
})
