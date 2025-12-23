import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookmarkPlus, Eye, Heart, ThumbsUp, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MovieCard } from '@/components/movie/MovieCard'
import { useAuthStore } from '@/store/auth'
import { getStatusLabel, getStatusColor } from '@/lib/utils'

export function WatchlistPage() {
  const { isAuthenticated } = useAuthStore()
  const [activeTab, setActiveTab] = useState('all')

  // Mock data
  const stats = {
    total: 25,
    wantToWatch: 10,
    watching: 2,
    watched: 8,
    liked: 4,
    recommended: 1,
  }

  const watchlistItems = [
    {
      id: '1',
      status: 'want_to_watch',
      rating: null,
      movie: {
        id: '1',
        title: 'Dilwale Dulhania Le Jayenge',
        year: 1995,
        industry: 'Bollywood',
        language: 'Hindi',
        avgRating: 8.1,
        posterUrl: null,
      },
    },
    {
      id: '2',
      status: 'liked',
      rating: 9,
      movie: {
        id: '2',
        title: 'Bahubali: The Beginning',
        year: 2015,
        industry: 'Tollywood',
        language: 'Telugu',
        avgRating: 8.0,
        posterUrl: null,
      },
    },
  ]

  if (!isAuthenticated()) {
    return (
      <div className="container py-16 text-center">
        <BookmarkPlus className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Sign in to view your watchlist</h1>
        <p className="text-muted-foreground mb-6">
          Create an account to save movies and track what you've watched.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/login">
            <Button>Sign in</Button>
          </Link>
          <Link to="/register">
            <Button variant="outline">Create account</Button>
          </Link>
        </div>
      </div>
    )
  }

  const statCards = [
    { key: 'wantToWatch', label: 'Want to Watch', icon: Clock, count: stats.wantToWatch },
    { key: 'watching', label: 'Watching', icon: Eye, count: stats.watching },
    { key: 'watched', label: 'Watched', icon: Eye, count: stats.watched },
    { key: 'liked', label: 'Liked', icon: Heart, count: stats.liked },
    { key: 'recommended', label: 'Recommended', icon: ThumbsUp, count: stats.recommended },
  ]

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Watchlist</h1>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {stats.total} movies
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {statCards.map((stat) => (
          <Card
            key={stat.key}
            className={`cursor-pointer transition-colors ${activeTab === stat.key ? 'border-primary' : ''}`}
            onClick={() => setActiveTab(stat.key)}
          >
            <CardContent className="pt-4 text-center">
              <stat.icon className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-2xl font-bold">{stat.count}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Movie Grid */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="wantToWatch">Want to Watch</TabsTrigger>
          <TabsTrigger value="watching">Watching</TabsTrigger>
          <TabsTrigger value="watched">Watched</TabsTrigger>
          <TabsTrigger value="liked">Liked</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {watchlistItems.length > 0 ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {watchlistItems.map((item) => (
                <div key={item.id} className="relative">
                  <Badge className={`absolute top-2 left-2 z-10 ${getStatusColor(item.status)}`}>
                    {getStatusLabel(item.status)}
                  </Badge>
                  <MovieCard movie={item.movie} inWatchlist />
                </div>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <BookmarkPlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No movies in this list yet.</p>
              <Link to="/search">
                <Button>Discover Movies</Button>
              </Link>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
