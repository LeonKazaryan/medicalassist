import { MapPin, Star, ChevronRight } from 'lucide-react'
import type { Place } from '@/types/place'
import { cn } from '@/lib/utils/cn'
import { useMapStore } from '../state/mapStore'

interface PlaceListItemProps {
  place: Place
  isSelected?: boolean
  onClick: () => void
}

export function PlaceListItem({ place, isSelected, onClick }: PlaceListItemProps) {
  const setHoveredId = useMapStore(state => state.setHoveredId)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHoveredId(place.id)}
      onMouseLeave={() => setHoveredId(null)}
      className={cn(
        "group relative w-full rounded-2xl border bg-card p-4 text-left transition-all duration-200 hover:shadow-md",
        isSelected 
          ? "border-primary bg-primary/5 ring-1 ring-primary" 
          : "border-border hover:border-primary/50"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h3 className={cn(
              "font-semibold leading-none tracking-tight transition-colors",
              isSelected ? "text-primary" : "text-foreground group-hover:text-primary"
            )}>
              {place.name}
            </h3>
            {place.rating && (
              <div className="flex items-center gap-1 rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
                <Star className="h-2.5 w-2.5 fill-current" />
                {place.rating.toFixed(1)}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="line-clamp-1">{place.address}</span>
          </div>
        </div>
        
        <div className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full transition-all",
          isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
        )}>
          <ChevronRight className={cn("h-4 w-4 transition-transform", isSelected && "rotate-90")} />
        </div>
      </div>

    </button>
  )
}
