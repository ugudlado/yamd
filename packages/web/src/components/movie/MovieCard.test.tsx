import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { MovieCard } from './MovieCard'

const mockMovie = {
  id: '1',
  title: 'Dilwale Dulhania Le Jayenge',
  year: 1995,
  runtime: 189,
  language: 'Hindi',
  industry: 'Bollywood',
  posterUrl: null,
  avgRating: 8.1,
  cast: [
    { role: 'director', person: { name: 'Aditya Chopra' } },
    { role: 'lead_actor', person: { name: 'Shah Rukh Khan' } },
    { role: 'lead_actor', person: { name: 'Kajol' } },
  ],
}

const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('MovieCard', () => {
  it('renders movie title', () => {
    renderWithRouter(<MovieCard movie={mockMovie} />)
    expect(screen.getByText('Dilwale Dulhania Le Jayenge')).toBeInTheDocument()
  })

  it('renders movie year', () => {
    renderWithRouter(<MovieCard movie={mockMovie} />)
    expect(screen.getByText('1995')).toBeInTheDocument()
  })

  it('renders movie industry badge', () => {
    renderWithRouter(<MovieCard movie={mockMovie} />)
    expect(screen.getByText('Bollywood')).toBeInTheDocument()
  })

  it('renders movie language badge', () => {
    renderWithRouter(<MovieCard movie={mockMovie} />)
    expect(screen.getByText('Hindi')).toBeInTheDocument()
  })

  it('renders formatted runtime', () => {
    renderWithRouter(<MovieCard movie={mockMovie} />)
    expect(screen.getByText('3h 9m')).toBeInTheDocument()
  })

  it('renders rating', () => {
    renderWithRouter(<MovieCard movie={mockMovie} />)
    expect(screen.getByText('8.1')).toBeInTheDocument()
  })

  it('renders director', () => {
    renderWithRouter(<MovieCard movie={mockMovie} />)
    expect(screen.getByText(/Aditya Chopra/)).toBeInTheDocument()
  })

  it('renders cast members', () => {
    renderWithRouter(<MovieCard movie={mockMovie} />)
    expect(screen.getByText(/Shah Rukh Khan/)).toBeInTheDocument()
    expect(screen.getByText(/Kajol/)).toBeInTheDocument()
  })

  it('renders placeholder when no poster', () => {
    renderWithRouter(<MovieCard movie={mockMovie} />)
    expect(screen.getByText('D')).toBeInTheDocument() // First letter of title
  })

  it('renders poster when available', () => {
    const movieWithPoster = { ...mockMovie, posterUrl: 'https://example.com/poster.jpg' }
    renderWithRouter(<MovieCard movie={movieWithPoster} />)
    const img = screen.getByAltText('Dilwale Dulhania Le Jayenge')
    expect(img).toHaveAttribute('src', 'https://example.com/poster.jpg')
  })

  it('calls onAddToWatchlist when button clicked', () => {
    const onAddToWatchlist = vi.fn()
    renderWithRouter(<MovieCard movie={mockMovie} onAddToWatchlist={onAddToWatchlist} />)

    fireEvent.click(screen.getByText('Add to Watchlist'))
    expect(onAddToWatchlist).toHaveBeenCalled()
  })

  it('shows in watchlist state', () => {
    renderWithRouter(<MovieCard movie={mockMovie} inWatchlist={true} onAddToWatchlist={() => {}} />)
    expect(screen.getByText('In Watchlist')).toBeInTheDocument()
  })

  it('links to movie detail page', () => {
    renderWithRouter(<MovieCard movie={mockMovie} />)
    const links = screen.getAllByRole('link')
    expect(links[0]).toHaveAttribute('href', '/movie/1')
  })
})
