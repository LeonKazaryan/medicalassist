import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Phone, Star, Copy } from 'lucide-react'
import type { Place } from '@/types/place'
import { cn } from '@/lib/utils/cn'
import { toast } from 'sonner'

interface PlaceCardProps {
  place: Place
  compact?: boolean
}

export function PlaceCard({ place, compact }: PlaceCardProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(place.address)
      toast.success('Address copied')
    } catch {
      toast.error('Could not copy')
    }
  }

  return (
    <Card className={cn('shadow-md border-border/80', compact && 'border-none shadow-none')}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base font-semibold">{place.name}</CardTitle>
            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">{place.address}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            {place.rating !== null ? (
              <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                <Star className="h-3.5 w-3.5 fill-current" />
                <span>{place.rating.toFixed(1)}</span>
                {place.reviewsCount !== null && (
                  <span className="text-[10px] text-emerald-800/80">
                    ({place.reviewsCount})
                  </span>
                )}
              </div>
            ) : (
              <Badge variant="secondary" className="text-[11px]">No rating</Badge>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopy}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col gap-2">
          {place.phones.length > 0 ? (
            place.phones.map((phone, idx) => (
              <Button
                key={phone}
                variant="secondary"
                size="sm"
                className="justify-start gap-2"
                asChild
              >
                <a href={`tel:${phone}`}>
                  <Phone className="h-4 w-4" />
                  Call {place.phones.length > 1 ? `${idx + 1}` : ''}
                  <span className="ml-2 text-muted-foreground">{phone}</span>
                </a>
              </Button>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No phone available</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
