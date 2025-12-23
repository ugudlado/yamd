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
  QrCode,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'

interface ShareDialogProps {
  title: string
  description?: string
  url?: string
  imageUrl?: string
  trigger?: React.ReactNode
}

export function ShareDialog({
  title,
  description,
  url,
  imageUrl,
  trigger,
}: ShareDialogProps) {
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
  const shareText = description || `Check out ${title} on YAMD - Indian Movie Discovery`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast({ title: 'Link copied to clipboard!' })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast({ title: 'Failed to copy link', variant: 'destructive' })
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url: shareUrl,
        })
        setOpen(false)
      } catch (e) {
        if ((e as Error).name !== 'AbortError') {
          console.error('Share failed', e)
        }
      }
    }
  }

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`,
  }

  const socialButtons = [
    { name: 'Twitter', icon: Twitter, url: shareLinks.twitter, color: 'hover:bg-sky-500' },
    { name: 'Facebook', icon: Facebook, url: shareLinks.facebook, color: 'hover:bg-blue-600' },
    { name: 'WhatsApp', icon: MessageCircle, url: shareLinks.whatsapp, color: 'hover:bg-green-500' },
    { name: 'LinkedIn', icon: Linkedin, url: shareLinks.linkedin, color: 'hover:bg-blue-700' },
    { name: 'Email', icon: Mail, url: shareLinks.email, color: 'hover:bg-gray-600', isLink: true },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share "{title}"</DialogTitle>
          <DialogDescription>
            Share this movie with your friends and family
          </DialogDescription>
        </DialogHeader>

        {/* Preview Card */}
        <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-16 h-24 object-cover rounded"
            />
          ) : (
            <div className="w-16 h-24 bg-primary/20 rounded flex items-center justify-center">
              <span className="text-2xl font-bold text-primary/50">
                {title.charAt(0)}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold truncate">{title}</h4>
            {description && (
              <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
            )}
          </div>
        </div>

        {/* Copy Link */}
        <div className="flex items-center gap-2">
          <Input
            value={shareUrl}
            readOnly
            className="font-mono text-sm"
            onClick={(e) => e.currentTarget.select()}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={handleCopyLink}
            className="shrink-0"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Native Share (if available) */}
        {typeof navigator !== 'undefined' && navigator.share && (
          <Button onClick={handleNativeShare} className="w-full gap-2">
            <Share2 className="h-4 w-4" />
            Share via...
          </Button>
        )}

        {/* Social Buttons */}
        <div className="grid grid-cols-5 gap-2">
          {socialButtons.map((social) => (
            social.isLink ? (
              <a
                key={social.name}
                href={social.url}
                className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition-colors hover:text-white ${social.color}`}
              >
                <social.icon className="h-5 w-5" />
                <span className="text-xs">{social.name}</span>
              </a>
            ) : (
              <button
                key={social.name}
                onClick={() => window.open(social.url, social.name, 'width=600,height=400')}
                className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition-colors hover:text-white ${social.color}`}
              >
                <social.icon className="h-5 w-5" />
                <span className="text-xs">{social.name}</span>
              </button>
            )
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
