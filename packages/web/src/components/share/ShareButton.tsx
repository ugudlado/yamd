import { useState } from 'react'
import {
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  Copy,
  Check,
  MessageCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from '@/hooks/use-toast'

interface ShareButtonProps {
  title: string
  text?: string
  url?: string
  className?: string
  variant?: 'default' | 'outline' | 'ghost' | 'secondary'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function ShareButton({
  title,
  text,
  url,
  className,
  variant = 'ghost',
  size = 'default',
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  // Get the share URL (defaults to current page)
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
  const shareText = text || `Check out ${title} on YAMD`

  // Check if Web Share API is available
  const canNativeShare = typeof navigator !== 'undefined' && navigator.share

  // Native share using Web Share API
  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title,
        text: shareText,
        url: shareUrl,
      })
    } catch (error) {
      // User cancelled or share failed
      if ((error as Error).name !== 'AbortError') {
        console.error('Share failed:', error)
      }
    }
  }

  // Copy link to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast({
        title: 'Link copied!',
        description: 'The link has been copied to your clipboard.',
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Copy failed:', error)
      toast({
        title: 'Failed to copy',
        description: 'Please try again or copy the URL manually.',
        variant: 'destructive',
      })
    }
  }

  // Social share URLs
  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`,
  }

  // Open share link in new window
  const openShareWindow = (url: string, name: string) => {
    window.open(url, name, 'width=600,height=400,menubar=no,toolbar=no')
  }

  // On mobile or if Web Share API is available, use native share as primary
  if (canNativeShare) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={variant} size={size} className={className}>
            <Share2 className="h-4 w-4" />
            {size !== 'icon' && <span className="ml-2">Share</span>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleNativeShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share...
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleCopyLink}>
            {copied ? (
              <Check className="mr-2 h-4 w-4 text-green-500" />
            ) : (
              <Copy className="mr-2 h-4 w-4" />
            )}
            Copy link
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => openShareWindow(shareLinks.twitter, 'twitter')}>
            <Twitter className="mr-2 h-4 w-4" />
            Twitter / X
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openShareWindow(shareLinks.whatsapp, 'whatsapp')}>
            <MessageCircle className="mr-2 h-4 w-4" />
            WhatsApp
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Desktop fallback with full social options
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Share2 className="h-4 w-4" />
          {size !== 'icon' && <span className="ml-2">Share</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleCopyLink}>
          {copied ? (
            <Check className="mr-2 h-4 w-4 text-green-500" />
          ) : (
            <Copy className="mr-2 h-4 w-4" />
          )}
          Copy link
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => openShareWindow(shareLinks.twitter, 'twitter')}>
          <Twitter className="mr-2 h-4 w-4" />
          Twitter / X
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openShareWindow(shareLinks.facebook, 'facebook')}>
          <Facebook className="mr-2 h-4 w-4" />
          Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openShareWindow(shareLinks.whatsapp, 'whatsapp')}>
          <MessageCircle className="mr-2 h-4 w-4" />
          WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openShareWindow(shareLinks.linkedin, 'linkedin')}>
          <Linkedin className="mr-2 h-4 w-4" />
          LinkedIn
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href={shareLinks.email}>
            <Mail className="mr-2 h-4 w-4" />
            Email
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
