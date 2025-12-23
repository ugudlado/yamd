import { z } from 'zod'
import { INDUSTRIES, LANGUAGES, PERSON_ROLES, DECADES } from '../constants'

export const movieSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  titleHindi: z.string().nullable().optional(),
  titleRegional: z.string().nullable().optional(),
  year: z.number().int().min(1900).max(2100),
  runtime: z.number().int().positive().nullable().optional(),
  language: z.enum(LANGUAGES),
  industry: z.enum(INDUSTRIES),
  plot: z.string().nullable().optional(),
  posterUrl: z.string().url().nullable().optional(),
  trailerUrl: z.string().url().nullable().optional(),
  avgRating: z.number().min(0).max(10).default(0),
  voteCount: z.number().int().min(0).default(0),
})

export const createMovieSchema = movieSchema.omit({
  id: true,
  avgRating: true,
  voteCount: true,
})

export const updateMovieSchema = createMovieSchema.partial()

export const personSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  nameHindi: z.string().nullable().optional(),
  photoUrl: z.string().url().nullable().optional(),
  birthDate: z.coerce.date().nullable().optional(),
  bio: z.string().nullable().optional(),
})

export const createPersonSchema = personSchema.omit({ id: true })

export const moviePersonSchema = z.object({
  id: z.string(),
  movieId: z.string(),
  personId: z.string(),
  role: z.enum(PERSON_ROLES),
  characterName: z.string().nullable().optional(),
})

export const movieQuerySchema = z.object({
  // Text search
  search: z.string().optional(),

  // People filters
  actors: z.array(z.string()).optional(),
  directors: z.array(z.string()).optional(),
  musicDirectors: z.array(z.string()).optional(),

  // Time filters
  yearRange: z.tuple([z.number(), z.number()]).optional(),
  decade: z.enum(DECADES).optional(),

  // Classification
  industries: z.array(z.enum(INDUSTRIES)).optional(),
  languages: z.array(z.enum(LANGUAGES)).optional(),

  // Rating
  ratingMin: z.number().min(0).max(10).optional(),
  ratingMax: z.number().min(0).max(10).optional(),

  // Sorting & Pagination
  sortBy: z.enum(['year', 'rating', 'title', 'recent']).default('recent'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
})

export type MovieInput = z.infer<typeof createMovieSchema>
export type MovieUpdate = z.infer<typeof updateMovieSchema>
export type PersonInput = z.infer<typeof createPersonSchema>
export type MovieQueryInput = z.infer<typeof movieQuerySchema>
