import type { WatchlistStatus } from '../constants'
import type { Movie } from './movie'

export interface WatchlistItem {
  id: string
  userId: string
  movieId: string
  status: WatchlistStatus
  rating?: number | null
  notes?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface WatchlistItemWithMovie extends WatchlistItem {
  movie: Movie
}

export interface AddToWatchlistInput {
  movieId: string
  status: WatchlistStatus
  notes?: string
}

export interface UpdateWatchlistInput {
  status?: WatchlistStatus
  rating?: number
  notes?: string
}

export interface WatchlistStats {
  total: number
  wantToWatch: number
  watching: number
  watched: number
  liked: number
  recommended: number
  dropped: number
}

export interface Contribution {
  id: string
  userId: string
  movieId?: string | null
  entityType: 'movie' | 'person'
  entityId: string
  fieldChanged: string
  oldValue?: string | null
  newValue: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: Date
  updatedAt: Date
}

export interface ContributionWithDetails extends Contribution {
  user: {
    id: string
    name: string
    avatarUrl?: string | null
  }
  movie?: {
    id: string
    title: string
  } | null
}
