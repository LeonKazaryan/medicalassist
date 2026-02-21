import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Phone, Star, Copy, ExternalLink } from 'lucide-react'
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
      toast.success('Адрес скопирован')
    } catch {
      toast.error('Не удалось скопировать')
    }
  }

  return (
    <Card className={cn(
      'overflow-hidden transition-all duration-300',
      compact ? 'border-none shadow-none bg-transparent' : 'shadow-lg border-border/40 hover:shadow-xl'
    )}>
      {!compact && (
        <div className="h-2 bg-gradient-to-r from-primary/80 via-primary to-primary/80" />
      )}
      
      <CardHeader className={cn("pb-4", compact ? "px-0 pt-0" : "p-6")}>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-[10px] uppercase tracking-wider font-bold">
                Аптека
              </Badge>
              {place.rating && (
                <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-600 border border-amber-100/50">
                  <Star className="h-3 w-3 fill-current" />
                  {place.rating.toFixed(1)}
                  {place.reviewsCount && (
                    <span className="text-[10px] font-medium text-amber-600/70 ml-0.5">
                      ({place.reviewsCount})
                    </span>
                  )}
                </div>
              )}
            </div>
            <CardTitle className="text-xl font-bold tracking-tight text-foreground/90">
              {place.name}
            </CardTitle>
            <div className="flex items-start gap-1.5 text-sm text-muted-foreground leading-relaxed">
              <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-primary/50" />
              <span>{place.address}</span>
            </div>
          </div>
          
          {!compact && (
            <Button 
              variant="outline" 
              size="icon" 
              className="h-10 w-10 shrink-0 rounded-full border-border/50 hover:bg-primary/5 hover:text-primary transition-colors"
              onClick={handleCopy}
              title="Скопировать адрес"
            >
              <Copy className="h-4.5 w-4.5" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className={cn("space-y-6 pt-0", compact ? "px-0" : "p-6")}>
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground/80 flex items-center gap-2">
            <Phone className="h-3 w-3" /> Контакты
          </h4>
          <div className="grid gap-2">
            {place.phones.length > 0 ? (
              place.phones.map((phone) => (
                <Button
                  key={phone}
                  variant="secondary"
                  className="w-full justify-between gap-3 group px-4 h-12 rounded-xl bg-muted/40 hover:bg-primary/10 transition-all border border-transparent hover:border-primary/20"
                  asChild
                >
                  <a href={`tel:${phone}`}>
                    <span className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-background shadow-sm text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <Phone className="h-3.5 w-3.5" />
                      </div>
                      <span className="font-semibold text-foreground/80">{phone}</span>
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </Button>
              ))
            ) : (
              <div className="flex items-center gap-2 px-3 py-4 rounded-xl bg-muted/20 border border-dashed text-muted-foreground text-sm italic">
                Телефон не указан
              </div>
            )}
          </div>
        </div>

        {!compact && (
          <div className="pt-2">
            <Button 
              className="w-full h-12 rounded-xl shadow-md hover:shadow-lg transition-all font-bold gap-2 bg-primary hover:bg-primary/90"
              onClick={() => {
                const url = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lon}`
                window.open(url, '_blank')
              }}
            >
              <ExternalLink className="h-4 w-4" />
              Проложить маршрут
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
