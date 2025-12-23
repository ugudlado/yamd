import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ShareButton } from './ShareButton'

describe('ShareButton', () => {
  const defaultProps = {
    title: 'Test Movie',
    text: 'Check out this movie!',
    url: 'https://example.com/movie/1',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders share button', () => {
    render(<ShareButton {...defaultProps} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('uses native share when available', async () => {
    const shareMock = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'share', {
      value: shareMock,
      writable: true,
    })

    render(<ShareButton {...defaultProps} />)

    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(shareMock).toHaveBeenCalledWith({
        title: 'Test Movie',
        text: 'Check out this movie!',
        url: 'https://example.com/movie/1',
      })
    })
  })

  it('opens share dialog when native share is not available', async () => {
    Object.defineProperty(navigator, 'share', {
      value: undefined,
      writable: true,
    })

    render(<ShareButton {...defaultProps} />)

    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(screen.getByText('Share')).toBeInTheDocument()
    })
  })

  it('applies custom className', () => {
    render(<ShareButton {...defaultProps} className="custom-class" />)
    expect(screen.getByRole('button')).toHaveClass('custom-class')
  })
})
