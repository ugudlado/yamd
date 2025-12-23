import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatYear(year: number): string {
  return year.toString()
}

export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

export function formatRuntime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    lead_actor: 'Lead Actor',
    supporting_actor: 'Supporting Actor',
    director: 'Director',
    music_director: 'Music Director',
    lyricist: 'Lyricist',
    playback_singer: 'Playback Singer',
    producer: 'Producer',
    cinematographer: 'Cinematographer',
    editor: 'Editor',
    writer: 'Writer',
    choreographer: 'Choreographer',
  }
  return labels[role] || role
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    want_to_watch: 'Want to Watch',
    watching: 'Watching',
    watched: 'Watched',
    liked: 'Liked',
    recommended: 'Recommended',
    dropped: 'Dropped',
  }
  return labels[status] || status
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    want_to_watch: 'bg-blue-500',
    watching: 'bg-yellow-500',
    watched: 'bg-green-500',
    liked: 'bg-pink-500',
    recommended: 'bg-purple-500',
    dropped: 'bg-gray-500',
  }
  return colors[status] || 'bg-gray-500'
}
