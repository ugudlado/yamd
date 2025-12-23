import { describe, it, expect } from 'vitest'
import { cn, formatRating, formatRuntime, getInitials, getRoleLabel, getStatusLabel, getStatusColor } from './utils'

describe('cn utility', () => {
  it('merges class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz')
  })

  it('merges tailwind classes properly', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
  })
})

describe('formatRating', () => {
  it('formats rating to one decimal place', () => {
    expect(formatRating(8.123)).toBe('8.1')
  })

  it('handles zero rating', () => {
    expect(formatRating(0)).toBe('0.0')
  })

  it('handles perfect rating', () => {
    expect(formatRating(10)).toBe('10.0')
  })
})

describe('formatRuntime', () => {
  it('formats runtime in hours and minutes', () => {
    expect(formatRuntime(150)).toBe('2h 30m')
  })

  it('handles runtime less than an hour', () => {
    expect(formatRuntime(45)).toBe('45m')
  })

  it('handles exact hours', () => {
    expect(formatRuntime(120)).toBe('2h 0m')
  })
})

describe('getInitials', () => {
  it('returns initials from full name', () => {
    expect(getInitials('Shah Rukh Khan')).toBe('SR')
  })

  it('returns single initial for single name', () => {
    expect(getInitials('Kajol')).toBe('K')
  })

  it('limits to two characters', () => {
    expect(getInitials('Amitabh Harivansh Bachchan')).toBe('AH')
  })
})

describe('getRoleLabel', () => {
  it('returns label for lead_actor', () => {
    expect(getRoleLabel('lead_actor')).toBe('Lead Actor')
  })

  it('returns label for director', () => {
    expect(getRoleLabel('director')).toBe('Director')
  })

  it('returns label for music_director', () => {
    expect(getRoleLabel('music_director')).toBe('Music Director')
  })

  it('returns original value for unknown role', () => {
    expect(getRoleLabel('unknown_role')).toBe('unknown_role')
  })
})

describe('getStatusLabel', () => {
  it('returns label for want_to_watch', () => {
    expect(getStatusLabel('want_to_watch')).toBe('Want to Watch')
  })

  it('returns label for watched', () => {
    expect(getStatusLabel('watched')).toBe('Watched')
  })

  it('returns label for dropped', () => {
    expect(getStatusLabel('dropped')).toBe('Dropped')
  })

  it('returns original value for unknown status', () => {
    expect(getStatusLabel('unknown')).toBe('unknown')
  })
})

describe('getStatusColor', () => {
  it('returns color for want_to_watch', () => {
    expect(getStatusColor('want_to_watch')).toBe('bg-blue-500')
  })

  it('returns color for watched', () => {
    expect(getStatusColor('watched')).toBe('bg-green-500')
  })

  it('returns gray for unknown status', () => {
    expect(getStatusColor('unknown')).toBe('bg-gray-500')
  })
})
