import { Link, useNavigate } from 'react-router-dom'
import { User, Award, BookmarkPlus, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuthStore } from '@/store/auth'
import { getInitials } from '@/lib/utils'

export function ProfilePage() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()

  if (!isAuthenticated() || !user) {
    navigate('/login')
    return null
  }

  // Mock stats
  const stats = {
    watchlist: 25,
    contributions: 12,
    memberSince: 'January 2024',
  }

  return (
    <div className="container py-8 max-w-4xl">
      {/* Profile Header */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatarUrl || undefined} />
              <AvatarFallback className="text-2xl">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left flex-1">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                {user.isPatron && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500">
                    {user.patronTier} Patron
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">{user.email}</p>
              <p className="text-sm text-muted-foreground">Member since {stats.memberSince}</p>
            </div>
            <Button variant="outline" className="gap-2">
              <Edit2 className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Watchlist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <BookmarkPlus className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{stats.watchlist}</span>
              <span className="text-muted-foreground">movies</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Contributions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{stats.contributions}</span>
              <span className="text-muted-foreground">edits</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
          </CardHeader>
          <CardContent>
            {user.isPatron ? (
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-lg px-3 py-1">
                {user.patronTier} Patron
              </Badge>
            ) : (
              <Link to="/patron">
                <Button variant="outline" size="sm">
                  Become a Patron
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Link to="/watchlist" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
            <BookmarkPlus className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">My Watchlist</p>
              <p className="text-sm text-muted-foreground">View and manage your saved movies</p>
            </div>
          </Link>
          <Link to="/patron" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
            <Award className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Patron Benefits</p>
              <p className="text-sm text-muted-foreground">Support YAMD and unlock features</p>
            </div>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
