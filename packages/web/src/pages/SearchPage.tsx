import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MovieCard } from '@/components/movie/MovieCard'
import { useSearchStore } from '@/store/search'
import { INDUSTRIES, LANGUAGES, DECADES } from '@yamd/shared'

export function SearchPage() {
  const [searchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)

  const {
    search, setSearch,
    actors, addActor, removeActor,
    directors, addDirector, removeDirector,
    musicDirectors, addMusicDirector, removeMusicDirector,
    decade, setDecade,
    industries, toggleIndustry,
    languages, toggleLanguage,
    ratingMin, setRatingMin,
    clearFilters, hasActiveFilters,
  } = useSearchStore()

  const [actorInput, setActorInput] = useState('')
  const [directorInput, setDirectorInput] = useState('')
  const [musicDirectorInput, setMusicDirectorInput] = useState('')

  // Mock data for now
  const mockMovies = [
    {
      id: '1',
      title: 'Dilwale Dulhania Le Jayenge',
      year: 1995,
      runtime: 189,
      language: 'Hindi',
      industry: 'Bollywood',
      avgRating: 8.1,
      posterUrl: null,
      cast: [
        { role: 'lead_actor', person: { name: 'Shah Rukh Khan' } },
        { role: 'lead_actor', person: { name: 'Kajol' } },
        { role: 'director', person: { name: 'Aditya Chopra' } },
      ],
    },
    {
      id: '2',
      title: 'Bahubali: The Beginning',
      year: 2015,
      runtime: 159,
      language: 'Telugu',
      industry: 'Tollywood',
      avgRating: 8.0,
      posterUrl: null,
      cast: [
        { role: 'lead_actor', person: { name: 'Prabhas' } },
        { role: 'director', person: { name: 'S.S. Rajamouli' } },
      ],
    },
  ]

  const handleAddActor = () => {
    if (actorInput.trim()) {
      addActor(actorInput.trim())
      setActorInput('')
    }
  }

  const handleAddDirector = () => {
    if (directorInput.trim()) {
      addDirector(directorInput.trim())
      setDirectorInput('')
    }
  }

  const handleAddMusicDirector = () => {
    if (musicDirectorInput.trim()) {
      addMusicDirector(musicDirectorInput.trim())
      setMusicDirectorInput('')
    }
  }

  return (
    <div className="container py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Discover Movies</h1>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search movies by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant={showFilters ? 'secondary' : 'outline'}
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {hasActiveFilters() && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                !
              </Badge>
            )}
          </Button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        {showFilters && (
          <aside className="w-80 shrink-0">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Filters</CardTitle>
                  {hasActiveFilters() && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear all
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Actors */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Actors (AND)</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Actor name"
                      value={actorInput}
                      onChange={(e) => setActorInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddActor()}
                    />
                    <Button size="sm" onClick={handleAddActor}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {actors.map((actor) => (
                      <Badge key={actor} variant="secondary" className="gap-1">
                        {actor}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeActor(actor)} />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Directors */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Directors</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Director name"
                      value={directorInput}
                      onChange={(e) => setDirectorInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddDirector()}
                    />
                    <Button size="sm" onClick={handleAddDirector}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {directors.map((director) => (
                      <Badge key={director} variant="secondary" className="gap-1">
                        {director}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeDirector(director)} />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Music Directors */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Music Directors</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Music director name"
                      value={musicDirectorInput}
                      onChange={(e) => setMusicDirectorInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddMusicDirector()}
                    />
                    <Button size="sm" onClick={handleAddMusicDirector}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {musicDirectors.map((md) => (
                      <Badge key={md} variant="secondary" className="gap-1">
                        {md}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeMusicDirector(md)} />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Decade */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Decade</label>
                  <div className="flex flex-wrap gap-2">
                    {DECADES.map((d) => (
                      <Badge
                        key={d}
                        variant={decade === d ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => setDecade(decade === d ? null : d)}
                      >
                        {d}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Industries */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Industry</label>
                  <div className="flex flex-wrap gap-2">
                    {INDUSTRIES.slice(0, 6).map((ind) => (
                      <Badge
                        key={ind}
                        variant={industries.includes(ind) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleIndustry(ind)}
                      >
                        {ind}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Language</label>
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGES.slice(0, 8).map((lang) => (
                      <Badge
                        key={lang}
                        variant={languages.includes(lang) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleLanguage(lang)}
                      >
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Minimum Rating</label>
                  <div className="flex gap-2">
                    {[5, 6, 7, 8, 9].map((r) => (
                      <Badge
                        key={r}
                        variant={ratingMin === r ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => setRatingMin(ratingMin === r ? null : r)}
                      >
                        {r}+
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        )}

        {/* Results */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              Showing {mockMovies.length} movies
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onAddToWatchlist={() => console.log('Add to watchlist', movie.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
