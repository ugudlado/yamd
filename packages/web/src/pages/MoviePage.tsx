import { useParams, Link } from 'react-router-dom'
import { Star, Calendar, Clock, Play, Plus, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ShareDialog } from '@/components/share/ShareDialog'
import { formatRating, formatRuntime, getRoleLabel, getInitials } from '@/lib/utils'

export function MoviePage() {
  const { id } = useParams()

  // Mock data
  const movie = {
    id: '1',
    title: 'Dilwale Dulhania Le Jayenge',
    titleHindi: 'दिलवाले दुल्हनिया ले जाएंगे',
    year: 1995,
    runtime: 189,
    language: 'Hindi',
    industry: 'Bollywood',
    plot: 'Raj and Simran meet on a Europe trip and fall in love. But Simran\'s father has already fixed her marriage to his friend\'s son. Raj must win over her father to marry Simran.',
    posterUrl: null,
    trailerUrl: 'https://youtube.com/watch?v=example',
    avgRating: 8.1,
    voteCount: 12500,
    cast: [
      { id: '1', role: 'lead_actor', characterName: 'Raj Malhotra', person: { id: 'p1', name: 'Shah Rukh Khan', photoUrl: null } },
      { id: '2', role: 'lead_actor', characterName: 'Simran Singh', person: { id: 'p2', name: 'Kajol', photoUrl: null } },
      { id: '3', role: 'supporting_actor', characterName: 'Chaudhary Baldev Singh', person: { id: 'p3', name: 'Amrish Puri', photoUrl: null } },
      { id: '4', role: 'director', person: { id: 'p4', name: 'Aditya Chopra', photoUrl: null } },
      { id: '5', role: 'music_director', person: { id: 'p5', name: 'Jatin-Lalit', photoUrl: null } },
      { id: '6', role: 'producer', person: { id: 'p6', name: 'Yash Chopra', photoUrl: null } },
    ],
  }

  const groupedCast = {
    directors: movie.cast.filter((c) => c.role === 'director'),
    actors: movie.cast.filter((c) => ['lead_actor', 'supporting_actor'].includes(c.role)),
    crew: movie.cast.filter((c) => !['director', 'lead_actor', 'supporting_actor'].includes(c.role)),
  }

  return (
    <div className="container py-8">
      {/* Hero Section */}
      <div className="grid md:grid-cols-[300px_1fr] gap-8 mb-12">
        {/* Poster */}
        <div className="aspect-[2/3] rounded-lg overflow-hidden bg-muted">
          {movie.posterUrl ? (
            <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
              <span className="text-6xl font-bold text-primary/30">{movie.title.charAt(0)}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge>{movie.industry}</Badge>
            <Badge variant="outline">{movie.language}</Badge>
          </div>

          <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
          {movie.titleHindi && (
            <p className="text-xl text-muted-foreground mb-4">{movie.titleHindi}</p>
          )}

          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              <span className="text-2xl font-bold">{formatRating(movie.avgRating)}</span>
              <span className="text-muted-foreground">/ 10</span>
            </div>
            <span className="text-muted-foreground">
              {movie.voteCount.toLocaleString()} votes
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {movie.year}
            </span>
            {movie.runtime && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatRuntime(movie.runtime)}
              </span>
            )}
          </div>

          <p className="text-lg mb-6">{movie.plot}</p>

          <div className="flex flex-wrap gap-3">
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Add to Watchlist
            </Button>
            {movie.trailerUrl && (
              <Button size="lg" variant="outline" className="gap-2" asChild>
                <a href={movie.trailerUrl} target="_blank" rel="noopener noreferrer">
                  <Play className="h-5 w-5" />
                  Watch Trailer
                </a>
              </Button>
            )}
            <ShareDialog
              title={movie.title}
              description={movie.plot}
              imageUrl={movie.posterUrl || undefined}
              trigger={
                <Button size="lg" variant="ghost" className="gap-2">
                  <Share2 className="h-5 w-5" />
                  Share
                </Button>
              }
            />
          </div>
        </div>
      </div>

      {/* Cast & Crew */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Directors */}
        <Card>
          <CardHeader>
            <CardTitle>Directors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {groupedCast.directors.map((c) => (
                <Link key={c.id} to={`/person/${c.person.id}`} className="flex items-center gap-3 hover:bg-muted p-2 rounded-lg transition-colors">
                  <Avatar>
                    <AvatarImage src={c.person.photoUrl || undefined} />
                    <AvatarFallback>{getInitials(c.person.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{c.person.name}</p>
                    <p className="text-sm text-muted-foreground">{getRoleLabel(c.role)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Crew */}
        <Card>
          <CardHeader>
            <CardTitle>Crew</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {groupedCast.crew.map((c) => (
                <Link key={c.id} to={`/person/${c.person.id}`} className="flex items-center gap-3 hover:bg-muted p-2 rounded-lg transition-colors">
                  <Avatar>
                    <AvatarImage src={c.person.photoUrl || undefined} />
                    <AvatarFallback>{getInitials(c.person.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{c.person.name}</p>
                    <p className="text-sm text-muted-foreground">{getRoleLabel(c.role)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cast */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Cast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {groupedCast.actors.map((c) => (
              <Link key={c.id} to={`/person/${c.person.id}`} className="flex items-center gap-3 hover:bg-muted p-2 rounded-lg transition-colors">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={c.person.photoUrl || undefined} />
                  <AvatarFallback>{getInitials(c.person.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{c.person.name}</p>
                  {c.characterName && (
                    <p className="text-sm text-muted-foreground">as {c.characterName}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
