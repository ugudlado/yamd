import { describe, it, expect } from 'vitest'
import { INDUSTRIES, LANGUAGES, PERSON_ROLES, WATCHLIST_STATUS, PATRON_TIERS } from './constants'

describe('Industries', () => {
  it('should include Bollywood', () => {
    expect(INDUSTRIES).toContain('Bollywood')
  })

  it('should include Tollywood', () => {
    expect(INDUSTRIES).toContain('Tollywood')
  })

  it('should include Kollywood', () => {
    expect(INDUSTRIES).toContain('Kollywood')
  })

  it('should include all major Indian film industries', () => {
    expect(INDUSTRIES.length).toBeGreaterThanOrEqual(5)
  })
})

describe('Languages', () => {
  it('should include Hindi', () => {
    expect(LANGUAGES).toContain('Hindi')
  })

  it('should include Tamil', () => {
    expect(LANGUAGES).toContain('Tamil')
  })

  it('should include Telugu', () => {
    expect(LANGUAGES).toContain('Telugu')
  })

  it('should include Malayalam', () => {
    expect(LANGUAGES).toContain('Malayalam')
  })

  it('should include Kannada', () => {
    expect(LANGUAGES).toContain('Kannada')
  })
})

describe('Person Roles', () => {
  it('should include lead_actor', () => {
    expect(PERSON_ROLES).toContain('lead_actor')
  })

  it('should include supporting_actor', () => {
    expect(PERSON_ROLES).toContain('supporting_actor')
  })

  it('should include director', () => {
    expect(PERSON_ROLES).toContain('director')
  })

  it('should include music_director', () => {
    expect(PERSON_ROLES).toContain('music_director')
  })

  it('should include lyricist', () => {
    expect(PERSON_ROLES).toContain('lyricist')
  })

  it('should include playback_singer', () => {
    expect(PERSON_ROLES).toContain('playback_singer')
  })
})

describe('Watchlist Status', () => {
  it('should include want_to_watch', () => {
    expect(WATCHLIST_STATUS).toContain('want_to_watch')
  })

  it('should include watching', () => {
    expect(WATCHLIST_STATUS).toContain('watching')
  })

  it('should include watched', () => {
    expect(WATCHLIST_STATUS).toContain('watched')
  })

  it('should include liked', () => {
    expect(WATCHLIST_STATUS).toContain('liked')
  })

  it('should include recommended', () => {
    expect(WATCHLIST_STATUS).toContain('recommended')
  })

  it('should include dropped', () => {
    expect(WATCHLIST_STATUS).toContain('dropped')
  })
})

describe('Patron Tiers', () => {
  it('should have Supporter tier at $3', () => {
    const supporter = PATRON_TIERS.find(t => t.name === 'Supporter')
    expect(supporter).toBeDefined()
    expect(supporter?.price).toBe(3)
  })

  it('should have Champion tier at $10', () => {
    const champion = PATRON_TIERS.find(t => t.name === 'Champion')
    expect(champion).toBeDefined()
    expect(champion?.price).toBe(10)
  })

  it('should have Legend tier at $25', () => {
    const legend = PATRON_TIERS.find(t => t.name === 'Legend')
    expect(legend).toBeDefined()
    expect(legend?.price).toBe(25)
  })

  it('should have benefits for each tier', () => {
    for (const tier of PATRON_TIERS) {
      expect(tier.benefits).toBeDefined()
      expect(tier.benefits.length).toBeGreaterThan(0)
    }
  })
})
