import type { Industry, Language, PersonRole } from '../constants'

export interface Movie {
  id: string
  title: string
  titleHindi?: string | null
  titleRegional?: string | null
  year: number
  runtime?: number | null
  language: Language
  industry: Industry
  plot?: string | null
  posterUrl?: string | null
  trailerUrl?: string | null
  avgRating: number
  voteCount: number
  createdAt: Date
  updatedAt: Date
}

export interface MovieWithCast extends Movie {
  cast: MoviePerson[]
}

export interface Person {
  id: string
  name: string
  nameHindi?: string | null
  photoUrl?: string | null
  birthDate?: Date | null
  bio?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface PersonWithMovies extends Person {
  movies: MoviePerson[]
}

export interface MoviePerson {
  id: string
  movieId: string
  personId: string
  role: PersonRole
  characterName?: string | null
  person?: Person
  movie?: Movie
}

export interface MovieQuery {
  // Text search
  search?: string

  // People filters (AND condition - all must match)
  actors?: string[]
  directors?: string[]
  musicDirectors?: string[]

  // Time filters
  yearRange?: [number, number]
  decade?: string

  // Classification
  industries?: Industry[]
  languages?: Language[]

  // Rating
  ratingMin?: number
  ratingMax?: number

  // Sorting & Pagination
  sortBy?: 'year' | 'rating' | 'title' | 'recent'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface MovieSearchResult {
  movies: MovieWithCast[]
  total: number
  page: number
  totalPages: number
}

export interface PersonSearchResult {
  people: PersonWithMovies[]
  total: number
  page: number
  totalPages: number
}
