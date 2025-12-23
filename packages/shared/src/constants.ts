// Indian Film Industries
export const INDUSTRIES = [
  'Bollywood',
  'Tollywood', // Telugu
  'Kollywood', // Tamil
  'Sandalwood', // Kannada
  'Mollywood', // Malayalam
  'Pollywood', // Punjabi
  'Dhollywood', // Gujarati
  'Ollywood', // Odia
  'Bengali',
  'Marathi',
] as const

export type Industry = (typeof INDUSTRIES)[number]

// Languages
export const LANGUAGES = [
  'Hindi',
  'Telugu',
  'Tamil',
  'Kannada',
  'Malayalam',
  'Punjabi',
  'Bengali',
  'Marathi',
  'Gujarati',
  'Odia',
  'Bhojpuri',
  'English',
] as const

export type Language = (typeof LANGUAGES)[number]

// Person Roles
export const PERSON_ROLES = [
  'lead_actor',
  'supporting_actor',
  'director',
  'music_director',
  'lyricist',
  'playback_singer',
  'producer',
  'cinematographer',
  'editor',
  'writer',
  'choreographer',
] as const

export type PersonRole = (typeof PERSON_ROLES)[number]

// Watchlist Status
export const WATCHLIST_STATUS = [
  'want_to_watch',
  'watching',
  'watched',
  'liked',
  'recommended',
  'dropped',
] as const

export type WatchlistStatus = (typeof WATCHLIST_STATUS)[number]

// Patron Tiers
export const PATRON_TIERS = {
  free: {
    name: 'Free',
    price: 0,
    watchlistLimit: 100,
    features: ['Unlimited search', 'Basic watchlist', 'Contribute to database'],
  },
  supporter: {
    name: 'Supporter',
    price: 3,
    watchlistLimit: -1,
    features: ['Unlimited watchlist', 'No ads', 'Supporter badge', 'Priority support'],
  },
  champion: {
    name: 'Champion',
    price: 10,
    watchlistLimit: -1,
    features: ['All Supporter benefits', 'API access', 'Early features', 'Export data'],
  },
  legend: {
    name: 'Legend',
    price: 25,
    watchlistLimit: -1,
    features: ['All Champion benefits', 'MCP server access', 'Custom lists', 'Credits in app'],
  },
} as const

export type PatronTier = keyof typeof PATRON_TIERS

// Contribution Status
export const CONTRIBUTION_STATUS = ['pending', 'approved', 'rejected'] as const

export type ContributionStatus = (typeof CONTRIBUTION_STATUS)[number]

// Decades for filtering
export const DECADES = ['50s', '60s', '70s', '80s', '90s', '2000s', '2010s', '2020s'] as const

export type Decade = (typeof DECADES)[number]

export function decadeToYearRange(decade: Decade): [number, number] {
  const map: Record<Decade, [number, number]> = {
    '50s': [1950, 1959],
    '60s': [1960, 1969],
    '70s': [1970, 1979],
    '80s': [1980, 1989],
    '90s': [1990, 1999],
    '2000s': [2000, 2009],
    '2010s': [2010, 2019],
    '2020s': [2020, 2029],
  }
  return map[decade]
}
