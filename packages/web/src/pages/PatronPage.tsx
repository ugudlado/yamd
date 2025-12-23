import { Check, Heart, Star, Crown, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PATRON_TIERS } from '@yamd/shared'

export function PatronPage() {
  const tiers = [
    {
      key: 'free',
      ...PATRON_TIERS.free,
      icon: Sparkles,
      popular: false,
    },
    {
      key: 'supporter',
      ...PATRON_TIERS.supporter,
      icon: Heart,
      popular: true,
    },
    {
      key: 'champion',
      ...PATRON_TIERS.champion,
      icon: Star,
      popular: false,
    },
    {
      key: 'legend',
      ...PATRON_TIERS.legend,
      icon: Crown,
      popular: false,
    },
  ]

  return (
    <div className="container py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <Badge className="mb-4 bg-gradient-to-r from-pink-500 to-orange-500 border-0">
          <Heart className="h-3 w-3 mr-1" />
          Support YAMD
        </Badge>
        <h1 className="text-4xl font-bold mb-4">Become a Patron</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          YAMD is free and open-source. Your support helps us keep the servers running,
          add new features, and maintain the community database.
        </p>
      </div>

      {/* Pricing Tiers */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {tiers.map((tier) => (
          <Card
            key={tier.key}
            className={tier.popular ? 'border-primary shadow-lg scale-105' : ''}
          >
            <CardHeader>
              {tier.popular && (
                <Badge className="w-fit mb-2">Most Popular</Badge>
              )}
              <div className="flex items-center gap-2">
                <tier.icon className={`h-5 w-5 ${tier.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                <CardTitle>{tier.name}</CardTitle>
              </div>
              <CardDescription>
                {tier.price === 0 ? (
                  <span className="text-2xl font-bold">Free</span>
                ) : (
                  <>
                    <span className="text-2xl font-bold">${tier.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={tier.popular ? 'default' : 'outline'}
                disabled={tier.price === 0}
              >
                {tier.price === 0 ? 'Current Plan' : 'Subscribe'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* FAQ */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">How is my contribution used?</h3>
            <p className="text-sm text-muted-foreground">
              Your support directly funds server costs, development time, and community moderation.
              We're committed to keeping YAMD free and ad-free for everyone.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Can I cancel anytime?</h3>
            <p className="text-sm text-muted-foreground">
              Yes! You can cancel your subscription at any time. You'll continue to have access
              to patron benefits until the end of your billing period.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">What is MCP access?</h3>
            <p className="text-sm text-muted-foreground">
              Legend patrons get access to our MCP (Model Context Protocol) server, allowing
              AI assistants like Claude to search and manage your movie collection.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Is YAMD open source?</h3>
            <p className="text-sm text-muted-foreground">
              Yes! YAMD is fully open source. You can contribute code, report bugs, or suggest
              features on our GitHub repository.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
