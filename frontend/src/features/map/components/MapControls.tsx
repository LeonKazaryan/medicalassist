import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'
import { Crosshair, RefreshCcw, Power } from 'lucide-react'

interface MapControlsProps {
  autoRefresh: boolean
  onToggleAutoRefresh: () => void
  onLocate: () => void
  onRefresh: () => void
  showRefresh: boolean
  isRefreshing: boolean
}

export function MapControls({
  autoRefresh,
  onToggleAutoRefresh,
  onLocate,
  onRefresh,
  showRefresh,
  isRefreshing,
}: MapControlsProps) {
  return (
    <div className="pointer-events-none absolute bottom-5 right-5 z-20 flex flex-col gap-2">
      <div className="pointer-events-auto flex flex-col gap-2 rounded-xl bg-background/90 p-2 shadow-lg ring-1 ring-border/60 backdrop-blur">
        <Button
          variant="secondary"
          size="icon"
          className="h-11 w-11 rounded-lg"
          onClick={onLocate}
        >
          <Crosshair className="h-5 w-5" />
        </Button>

        {showRefresh && (
          <Button
            variant="secondary"
            size="sm"
            className="h-10 rounded-lg px-3"
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            <RefreshCcw className={cn('mr-2 h-4 w-4', isRefreshing && 'animate-spin')} />
            Refresh area
          </Button>
        )}

        <Button
          variant={autoRefresh ? 'default' : 'secondary'}
          size="sm"
          className="h-10 rounded-lg px-3"
          onClick={onToggleAutoRefresh}
        >
          <Power className="mr-2 h-4 w-4" />
          Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
        </Button>
      </div>
    </div>
  )
}
