import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock navigator.share for Web Share API tests
Object.defineProperty(navigator, 'share', {
  value: vi.fn(),
  writable: true,
})

Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
  writable: true,
})

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    origin: 'http://localhost:5173',
    href: 'http://localhost:5173',
  },
  writable: true,
})

// Mock window.open for social share links
Object.defineProperty(window, 'open', {
  value: vi.fn(),
  writable: true,
})
