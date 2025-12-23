import { Link } from 'react-router-dom'
import { Search, Film, Users, Heart, Sparkles, BookmarkPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { INDUSTRIES, LANGUAGES } from '@yamd/shared'

export function HomePage() {
  const features = [
    {
      icon: Search,
      title: 'Complex Queries',
      description: 'Search movies by actor combinations, directors, music directors, and more',
    },
    {
      icon: BookmarkPlus,
      title: 'Personal Watchlist',
      description: 'Save movies, track what you watched, and rate your favorites',
    },
    {
      icon: Users,
      title: 'Crowdsourced',
      description: 'Community-driven database with contributions from movie lovers',
    },
    {
      icon: Sparkles,
      title: 'AI-Powered',
      description: 'Use AI agents to search and manage your movie collection via MCP',
    },
  ]

  const exampleQueries = [
    'Movies with Shah Rukh Khan and Kajol',
    'Rajkumar Hirani films starring Aamir Khan',
    'A.R. Rahman composed 90s Tamil movies',
    'Prabhas and Anushka movies rated 7+',
    'Yash Raj Films from 2000s',
    'Telugu action movies from 2020s',
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-primary/10 to-background">
        <div className="container text-center">
          <Badge className="mb-4" variant="secondary">
            <Film className="h-3 w-3 mr-1" />
            Indian Movie Discovery Engine
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Discover Indian Movies
            <br />
            <span className="text-primary">Like Never Before</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Search movies with complex queries. Find films by actor combinations,
            directors, music directors, decades, and more. Free, open-source, and crowdsourced.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/search">
              <Button size="lg" className="gap-2">
                <Search className="h-5 w-5" />
                Start Discovering
              </Button>
            </Link>
            <Link to="/patron">
              <Button size="lg" variant="outline" className="gap-2">
                <Heart className="h-5 w-5" />
                Support Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Example Queries */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-2xl font-bold text-center mb-8">Try These Searches</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {exampleQueries.map((query) => (
              <Link key={query} to={`/search?q=${encodeURIComponent(query)}`}>
                <Badge
                  variant="outline"
                  className="py-2 px-4 text-sm cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {query}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-2xl font-bold text-center mb-12">Why YAMD?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-2xl font-bold text-center mb-8">Explore by Industry</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {INDUSTRIES.slice(0, 8).map((industry) => (
              <Link key={industry} to={`/search?industry=${industry}`}>
                <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer hover:border-primary">
                  <p className="font-semibold">{industry}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Languages */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-2xl font-bold text-center mb-8">Browse by Language</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {LANGUAGES.slice(0, 10).map((language) => (
              <Link key={language} to={`/search?language=${language}`}>
                <Badge variant="secondary" className="py-2 px-4 text-sm cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                  {language}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
            Join thousands of Indian cinema lovers. Create your watchlist,
            discover hidden gems, and contribute to the community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary">
                Create Free Account
              </Button>
            </Link>
            <Link to="/search">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Browse Movies
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
