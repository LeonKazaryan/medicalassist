import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'
import { useMapStore } from '../state/mapStore'
import { Search } from 'lucide-react'
import { toast } from 'sonner'

export function MapHeader() {
  const { activeType, setType } = useMapStore((state) => ({
    activeType: state.activeType,
    setType: state.setType,
  }))

  const handleDisabledClick = () => {
    toast.info('Clinics coming soon')
  }

  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-3 md:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Map</p>
            <h1 className="text-lg font-semibold leading-5">Nearby</h1>
          </div>
        </div>

        <ToggleGroup
          type="single"
          value={activeType}
          onValueChange={(val) => {
            if (val === 'clinic') {
              handleDisabledClick()
              return
            }
            if (val) setType(val as 'pharmacy')
          }}
          className="rounded-lg bg-muted/60 p-1"
        >
          <ToggleGroupItem
            value="pharmacy"
            className={cn(
              'px-4 font-medium data-[state=on]:bg-background data-[state=on]:shadow-sm',
              'min-w-[110px]',
            )}
          >
            Pharmacies
          </ToggleGroupItem>
          <ToggleGroupItem
            value="clinic"
            className="relative min-w-[110px] opacity-60"
            onClick={handleDisabledClick}
            aria-disabled
          >
            <span className="flex items-center gap-2">
              Clinics
              <Badge variant="secondary" className="text-[10px]">Soon</Badge>
            </span>
          </ToggleGroupItem>
        </ToggleGroup>

        <div className="ml-auto hidden flex-1 items-center gap-2 rounded-xl border bg-background px-3 py-2 text-sm text-muted-foreground shadow-sm md:flex">
          <Search className="h-4 w-4 opacity-60" />
          <input
            className="w-full bg-transparent outline-none"
            placeholder="Search address (soon)"
            disabled
          />
          <Button variant="secondary" size="sm" disabled>
            Search
          </Button>
        </div>
      </div>
    </header>
  )
}
