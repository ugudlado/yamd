import type { PatronTier } from '../constants'

export interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string | null
  isPatron: boolean
  patronTier?: PatronTier | null
  contributionCount: number
  createdAt: Date
  updatedAt: Date
}

export interface UserProfile extends User {
  watchlistCount: number
  recentWatchlist: WatchlistItemWithMovie[]
}

export interface AuthUser {
  id: string
  email: string
  name: string
  avatarUrl?: string | null
  isPatron: boolean
  patronTier?: PatronTier | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  name: string
}

export interface AuthResponse {
  user: AuthUser
  token: string
}

// Forward reference - will be defined in watchlist.ts
interface WatchlistItemWithMovie {
  id: string
  movieId: string
  status: string
  rating?: number | null
  notes?: string | null
  movie: {
    id: string
    title: string
    year: number
    posterUrl?: string | null
  }
}
