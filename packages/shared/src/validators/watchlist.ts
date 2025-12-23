import { z } from 'zod'
import { WATCHLIST_STATUS, CONTRIBUTION_STATUS } from '../constants'

export const addToWatchlistSchema = z.object({
  movieId: z.string(),
  status: z.enum(WATCHLIST_STATUS),
  notes: z.string().max(500).optional(),
})

export const updateWatchlistSchema = z.object({
  status: z.enum(WATCHLIST_STATUS).optional(),
  rating: z.number().int().min(1).max(10).optional(),
  notes: z.string().max(500).optional(),
})

export const watchlistQuerySchema = z.object({
  status: z.enum(WATCHLIST_STATUS).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
})

export const contributionSchema = z.object({
  entityType: z.enum(['movie', 'person']),
  entityId: z.string(),
  movieId: z.string().optional(),
  fieldChanged: z.string(),
  oldValue: z.string().nullable().optional(),
  newValue: z.string(),
})

export const moderateContributionSchema = z.object({
  status: z.enum(CONTRIBUTION_STATUS),
})

export type AddToWatchlistInput = z.infer<typeof addToWatchlistSchema>
export type UpdateWatchlistInput = z.infer<typeof updateWatchlistSchema>
export type WatchlistQueryInput = z.infer<typeof watchlistQuerySchema>
export type ContributionInput = z.infer<typeof contributionSchema>
