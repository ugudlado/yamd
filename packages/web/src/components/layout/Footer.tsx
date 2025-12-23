import { Link } from 'react-router-dom'
import { Film, Github, Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Film className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">YAMD</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Yet Another Movie Discovery - Your gateway to Indian cinema.
              Discover movies with complex queries.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Discover</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/search" className="hover:text-foreground">Search Movies</Link></li>
              <li><Link to="/search?industry=Bollywood" className="hover:text-foreground">Bollywood</Link></li>
              <li><Link to="/search?industry=Tollywood" className="hover:text-foreground">Tollywood</Link></li>
              <li><Link to="/search?industry=Kollywood" className="hover:text-foreground">Kollywood</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Account</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/watchlist" className="hover:text-foreground">Watchlist</Link></li>
              <li><Link to="/profile" className="hover:text-foreground">Profile</Link></li>
              <li><Link to="/patron" className="hover:text-foreground">Become a Patron</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Community</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              </li>
              <li><Link to="/patron" className="hover:text-foreground">Contribute</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Made with <Heart className="h-4 w-4 inline text-red-500" /> for Indian cinema lovers
          </p>
          <p className="text-sm text-muted-foreground">
            Free & Open Source. Crowdsourced data.
          </p>
        </div>
      </div>
    </footer>
  )
}
