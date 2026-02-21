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
  variant?: 'overlay' | 'sidebar'
}

export function MapControls({
  autoRefresh,
  onToggleAutoRefresh,
  onLocate,
  onRefresh,
  showRefresh,
  isRefreshing,
  variant = 'overlay',
}: MapControlsProps) {
  const isSidebar = variant === 'sidebar'

  return (
    <div
      className={cn(
        isSidebar
          ? 'w-full'
          : 'pointer-events-none absolute bottom-5 right-5 z-20 flex flex-col gap-2',
      )}
    >
      <div
        className={cn(
          'flex flex-col gap-2 rounded-xl bg-background/90',
          isSidebar
            ? 'p-3 shadow-sm ring-1 ring-border/60'
            : 'pointer-events-auto p-2 shadow-lg ring-1 ring-border/60 backdrop-blur',
        )}
      >
        <Button
          variant="secondary"
          size={isSidebar ? 'sm' : 'icon'}
          className={cn(
            'rounded-lg',
            isSidebar ? 'h-10 w-full justify-center gap-2' : 'h-11 w-11',
          )}
          onClick={onLocate}
        >
          <Crosshair className="h-5 w-5" />
          {isSidebar && <span className="text-sm font-medium">Моя локация</span>}
        </Button>

        {showRefresh && (
          <Button
            variant="secondary"
            size="sm"
            className={cn('h-10 rounded-lg px-3', isSidebar && 'w-full justify-center')}
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            <RefreshCcw className={cn('mr-2 h-4 w-4', isRefreshing && 'animate-spin')} />
            Обновить область
          </Button>
        )}

        <Button
          variant={autoRefresh ? 'default' : 'secondary'}
          size="sm"
          className={cn(
            'h-10 rounded-lg px-3',
            isSidebar && 'w-full justify-center',
          )}
          onClick={onToggleAutoRefresh}
        >
          <Power className="mr-2 h-4 w-4" />
          Автообновление {autoRefresh ? 'Вкл' : 'Выкл'}
        </Button>
      </div>
    </div>
  )
}
