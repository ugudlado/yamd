import { Link, useNavigate } from 'react-router-dom'
import { Film, Search, BookmarkPlus, User, LogOut, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuthStore } from '@/store/auth'
import { getInitials } from '@/lib/utils'

export function Navbar() {
  const navigate = useNavigate()
  const { user, logout, isAuthenticated } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link to="/" className="flex items-center space-x-2 mr-6">
          <Film className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">YAMD</span>
        </Link>

        <nav className="flex items-center space-x-4 flex-1">
          <Link to="/search">
            <Button variant="ghost" size="sm" className="gap-2">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Discover</span>
            </Button>
          </Link>
          {isAuthenticated() && (
            <Link to="/watchlist">
              <Button variant="ghost" size="sm" className="gap-2">
                <BookmarkPlus className="h-4 w-4" />
                <span className="hidden sm:inline">Watchlist</span>
              </Button>
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-2">
          <Link to="/patron">
            <Button variant="outline" size="sm" className="gap-2 text-pink-600 border-pink-200 hover:bg-pink-50">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Support</span>
            </Button>
          </Link>

          {isAuthenticated() ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatarUrl || undefined} alt={user?.name} />
                    <AvatarFallback>{user ? getInitials(user.name) : 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/watchlist" className="cursor-pointer">
                    <BookmarkPlus className="mr-2 h-4 w-4" />
                    Watchlist
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
