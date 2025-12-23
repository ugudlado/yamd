import { useParams } from 'react-router-dom'
import { Calendar, Film } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MovieCard } from '@/components/movie/MovieCard'
import { getInitials, getRoleLabel } from '@/lib/utils'

export function PersonPage() {
  const { id } = useParams()

  // Mock data
  const person = {
    id: 'p1',
    name: 'Shah Rukh Khan',
    nameHindi: 'शाहरुख खान',
    photoUrl: null,
    birthDate: new Date('1965-11-02'),
    bio: 'Shah Rukh Khan, often referred to as SRK, is an Indian actor and film producer who works in Hindi films. Referred to in the media as the "Baadshah of Bollywood" and "King Khan", he has appeared in more than 80 films, and earned numerous accolades.',
    movies: [
      {
        movie: {
          id: '1',
          title: 'Dilwale Dulhania Le Jayenge',
          year: 1995,
          industry: 'Bollywood',
          language: 'Hindi',
          avgRating: 8.1,
          posterUrl: null,
        },
        role: 'lead_actor',
        characterName: 'Raj Malhotra',
      },
      {
        movie: {
          id: '2',
          title: 'Pathaan',
          year: 2023,
          industry: 'Bollywood',
          language: 'Hindi',
          avgRating: 7.2,
          posterUrl: null,
        },
        role: 'lead_actor',
        characterName: 'Pathaan',
      },
    ],
  }

  const roleStats = person.movies.reduce((acc, m) => {
    acc[m.role] = (acc[m.role] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <Avatar className="h-48 w-48 shrink-0">
          <AvatarImage src={person.photoUrl || undefined} />
          <AvatarFallback className="text-4xl">{getInitials(person.name)}</AvatarFallback>
        </Avatar>

        <div>
          <h1 className="text-4xl font-bold mb-2">{person.name}</h1>
          {person.nameHindi && (
            <p className="text-xl text-muted-foreground mb-4">{person.nameHindi}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 mb-4 text-muted-foreground">
            {person.birthDate && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Born: {person.birthDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Film className="h-4 w-4" />
              {person.movies.length} movies
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(roleStats).map(([role, count]) => (
              <Badge key={role} variant="secondary">
                {getRoleLabel(role)}: {count}
              </Badge>
            ))}
          </div>

          {person.bio && <p className="text-muted-foreground max-w-2xl">{person.bio}</p>}
        </div>
      </div>

      {/* Filmography */}
      <Card>
        <CardHeader>
          <CardTitle>Filmography</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {person.movies.map((m) => (
              <MovieCard
                key={m.movie.id}
                movie={m.movie}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
