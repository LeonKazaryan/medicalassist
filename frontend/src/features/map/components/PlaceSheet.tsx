import { AnimatePresence, motion } from 'framer-motion'
import type { Place } from '@/types/place'
import { PlaceCard } from './PlaceCard'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface PlaceSheetProps {
  places: Place[]
  selectedPlaceId: string | null
  onSelect: (id: string) => void
  onClose: () => void
  isLoading: boolean
  isError: boolean
}

const sheetTransition = { duration: 0.22, ease: [0.16, 1, 0.3, 1] as const }

export function PlaceSheet({
  places,
  selectedPlaceId,
  onSelect,
  onClose,
  isLoading,
  isError,
}: PlaceSheetProps) {
  const selectedPlace = places.find((p) => p.id === selectedPlaceId) || null

  return (
    <>
      {/* Mobile bottom sheet */}
      <AnimatePresence>
        {selectedPlace && (
          <motion.div
            key="mobile-sheet"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: sheetTransition }}
            exit={{ y: '100%', opacity: 0, transition: sheetTransition }}
            className="sheet-backdrop fixed inset-x-0 bottom-0 z-30 rounded-t-3xl border-t bg-background/95 shadow-2xl backdrop-blur lg:hidden"
          >
            <div className="sheet-handle" />
            <div className="flex items-center justify-between px-4 pb-2">
              <p className="text-sm font-medium text-muted-foreground">Selected place</p>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto px-4 pb-6">
              <PlaceCard place={selectedPlace} />
              <div className="mt-4">
                <h4 className="mb-2 text-sm font-medium text-muted-foreground">Visible pharmacies</h4>
                <div className="space-y-2">
                  {places.map((place) => (
                    <button
                      key={place.id}
                      onClick={() => onSelect(place.id)}
                      className={cn(
                        'w-full rounded-xl border px-3 py-2 text-left transition hover:border-primary hover:bg-primary/5',
                        place.id === selectedPlaceId && 'border-primary bg-primary/5',
                      )}
                    >
                      <p className="font-semibold">{place.name}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{place.address}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop side panel */}
      <AnimatePresence>
        {selectedPlace && (
          <motion.aside
            key="desktop-sheet"
            initial={{ x: 360, opacity: 0 }}
            animate={{ x: 0, opacity: 1, transition: sheetTransition }}
            exit={{ x: 360, opacity: 0, transition: sheetTransition }}
            className="fixed right-0 top-[76px] z-20 hidden h-[calc(100vh-76px)] w-[360px] border-l bg-background/95 shadow-2xl backdrop-blur lg:block"
          >
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div>
                <p className="text-xs uppercase tracking-[0.08em] text-primary">Pharmacy</p>
                <p className="text-sm text-muted-foreground">Details</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="h-[calc(100%-56px)] overflow-y-auto p-4">
              <PlaceCard place={selectedPlace} />
              <div className="mt-4">
                <h4 className="mb-2 text-sm font-medium text-muted-foreground">Visible pharmacies</h4>
                <div className="space-y-2">
                  {places.map((place) => (
                    <button
                      key={place.id}
                      onClick={() => onSelect(place.id)}
                      className={cn(
                        'w-full rounded-xl border px-3 py-2 text-left transition hover:border-primary hover:bg-primary/5',
                        place.id === selectedPlaceId && 'border-primary bg-primary/5',
                      )}
                    >
                      <p className="font-semibold">{place.name}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{place.address}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Empty / loading state anchor on desktop if no selection */}
      <div className="fixed right-0 top-[76px] hidden h-[calc(100vh-76px)] w-[360px] border-l bg-background/70 backdrop-blur lg:block">
        {!selectedPlace && (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted-foreground">
            {isLoading
              ? 'Searching nearby pharmacies...'
              : isError
                ? 'Could not load places. Try refreshing.'
                : 'Select a marker to view details.'}
          </div>
        )}
      </div>
    </>
  )
}
