import { create } from 'zustand'
import type { Industry, Language, Decade } from '@yamd/shared'

interface SearchFilters {
  search: string
  actors: string[]
  directors: string[]
  musicDirectors: string[]
  yearRange: [number, number] | null
  decade: Decade | null
  industries: Industry[]
  languages: Language[]
  ratingMin: number | null
  sortBy: 'year' | 'rating' | 'title' | 'recent'
  sortOrder: 'asc' | 'desc'
}

interface SearchState extends SearchFilters {
  setSearch: (search: string) => void
  addActor: (actor: string) => void
  removeActor: (actor: string) => void
  addDirector: (director: string) => void
  removeDirector: (director: string) => void
  addMusicDirector: (musicDirector: string) => void
  removeMusicDirector: (musicDirector: string) => void
  setYearRange: (range: [number, number] | null) => void
  setDecade: (decade: Decade | null) => void
  toggleIndustry: (industry: Industry) => void
  toggleLanguage: (language: Language) => void
  setRatingMin: (rating: number | null) => void
  setSortBy: (sortBy: SearchFilters['sortBy']) => void
  setSortOrder: (order: 'asc' | 'desc') => void
  clearFilters: () => void
  hasActiveFilters: () => boolean
}

const initialState: SearchFilters = {
  search: '',
  actors: [],
  directors: [],
  musicDirectors: [],
  yearRange: null,
  decade: null,
  industries: [],
  languages: [],
  ratingMin: null,
  sortBy: 'recent',
  sortOrder: 'desc',
}

export const useSearchStore = create<SearchState>((set, get) => ({
  ...initialState,

  setSearch: (search) => set({ search }),

  addActor: (actor) =>
    set((state) => ({
      actors: state.actors.includes(actor) ? state.actors : [...state.actors, actor],
    })),
  removeActor: (actor) =>
    set((state) => ({ actors: state.actors.filter((a) => a !== actor) })),

  addDirector: (director) =>
    set((state) => ({
      directors: state.directors.includes(director)
        ? state.directors
        : [...state.directors, director],
    })),
  removeDirector: (director) =>
    set((state) => ({ directors: state.directors.filter((d) => d !== director) })),

  addMusicDirector: (musicDirector) =>
    set((state) => ({
      musicDirectors: state.musicDirectors.includes(musicDirector)
        ? state.musicDirectors
        : [...state.musicDirectors, musicDirector],
    })),
  removeMusicDirector: (musicDirector) =>
    set((state) => ({
      musicDirectors: state.musicDirectors.filter((m) => m !== musicDirector),
    })),

  setYearRange: (range) => set({ yearRange: range, decade: null }),
  setDecade: (decade) => set({ decade, yearRange: null }),

  toggleIndustry: (industry) =>
    set((state) => ({
      industries: state.industries.includes(industry)
        ? state.industries.filter((i) => i !== industry)
        : [...state.industries, industry],
    })),

  toggleLanguage: (language) =>
    set((state) => ({
      languages: state.languages.includes(language)
        ? state.languages.filter((l) => l !== language)
        : [...state.languages, language],
    })),

  setRatingMin: (rating) => set({ ratingMin: rating }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (order) => set({ sortOrder: order }),

  clearFilters: () => set(initialState),

  hasActiveFilters: () => {
    const state = get()
    return (
      state.search !== '' ||
      state.actors.length > 0 ||
      state.directors.length > 0 ||
      state.musicDirectors.length > 0 ||
      state.yearRange !== null ||
      state.decade !== null ||
      state.industries.length > 0 ||
      state.languages.length > 0 ||
      state.ratingMin !== null
    )
  },
}))
