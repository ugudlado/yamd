import { Link } from 'react-router-dom'
import { Star, Calendar, Clock, Plus, Check, Share2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShareButton } from '@/components/share/ShareButton'
import { cn, formatRating, formatRuntime } from '@/lib/utils'

interface MovieCardProps {
  movie: {
    id: string
    title: string
    year: number
    runtime?: number | null
    language: string
    industry: string
    posterUrl?: string | null
    avgRating: number
    cast?: Array<{
      role: string
      person: { name: string }
    }>
  }
  inWatchlist?: boolean
  onAddToWatchlist?: () => void
  className?: string
}

export function MovieCard({ movie, inWatchlist, onAddToWatchlist, className }: MovieCardProps) {
  const directors = movie.cast?.filter((c) => c.role === 'director') || []
  const actors = movie.cast?.filter((c) => ['lead_actor', 'supporting_actor'].includes(c.role)) || []

  return (
    <Card className={cn('group overflow-hidden transition-all hover:shadow-lg', className)}>
      <Link to={`/movie/${movie.id}`}>
        <div className="aspect-[2/3] relative bg-muted overflow-hidden">
          {movie.posterUrl ? (
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="object-cover w-full h-full transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
              <span className="text-4xl font-bold text-primary/30">
                {movie.title.charAt(0)}
              </span>
            </div>
          )}

          <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <ShareButton
              title={movie.title}
              text={`Check out ${movie.title} (${movie.year}) on YAMD`}
              url={`${window.location.origin}/movie/${movie.id}`}
              variant="secondary"
              size="icon"
              className="h-8 w-8 bg-black/60 hover:bg-black/80 text-white border-0"
            />
          </div>
          <div className="absolute top-2 right-2 flex gap-1">
            <Badge variant="secondary" className="bg-black/60 text-white border-0">
              <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
              {formatRating(movie.avgRating)}
            </Badge>
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
            <Badge variant="outline" className="bg-primary/80 text-white border-0 text-xs">
              {movie.industry}
            </Badge>
          </div>
        </div>
      </Link>

      <CardContent className="p-3">
        <Link to={`/movie/${movie.id}`}>
          <h3 className="font-semibold line-clamp-1 hover:text-primary transition-colors">
            {movie.title}
          </h3>
        </Link>

        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {movie.year}
          </span>
          {movie.runtime && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatRuntime(movie.runtime)}
            </span>
          )}
          <Badge variant="outline" className="text-xs">
            {movie.language}
          </Badge>
        </div>

        {directors.length > 0 && (
          <p className="text-xs text-muted-foreground mt-2 line-clamp-1">
            <span className="font-medium">Dir:</span> {directors.map((d) => d.person.name).join(', ')}
          </p>
        )}

        {actors.length > 0 && (
          <p className="text-xs text-muted-foreground line-clamp-1">
            <span className="font-medium">Cast:</span> {actors.slice(0, 2).map((a) => a.person.name).join(', ')}
          </p>
        )}

        {onAddToWatchlist && (
          <Button
            size="sm"
            variant={inWatchlist ? 'secondary' : 'default'}
            className="w-full mt-3"
            onClick={(e) => {
              e.preventDefault()
              onAddToWatchlist()
            }}
          >
            {inWatchlist ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                In Watchlist
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-1" />
                Add to Watchlist
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
