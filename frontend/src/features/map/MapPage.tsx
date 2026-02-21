import { useEffect, useMemo, useState } from 'react'
import type { Map } from 'leaflet'
import { toast } from 'sonner'
import { AlertTriangle } from 'lucide-react'
import { GlobalHeader } from '@/components/common/GlobalHeader'
import { MapControls } from './components/MapControls'
import { PlaceSheet } from './components/PlaceSheet'
import { PlacesMap } from './components/PlacesMap'
import { MapOverlays } from './components/MapOverlays'
import { useMapStore } from './state/mapStore'
import { useUserGeolocation } from './hooks/useUserGeolocation'
import { useDebouncedValue } from './hooks/useDebouncedValue'
import { usePlacesQuery } from './hooks/usePlacesQuery'
import { DEFAULT_ZOOM } from '@/lib/config/map'
import type { BBox } from '@/types/place'

function MapPage() {
  const [mapInstance, setMapInstance] = useState<Map | null>(null)
  const {
    activeType,
    autoRefresh,
    selectedPlaceId,
    mapViewport,
    setSelected,
    setAutoRefresh,
    setViewport,
  } = useMapStore((state) => ({
    activeType: state.activeType,
    autoRefresh: state.autoRefresh,
    selectedPlaceId: state.selectedPlaceId,
    mapViewport: state.mapViewport,
    setSelected: state.setSelected,
    setAutoRefresh: state.setAutoRefresh,
    setViewport: state.setViewport,
  }))

  const { userLocation, geolocationStatus, requestLocation, error: geoError } =
    useUserGeolocation()

  const debouncedViewport = useDebouncedValue(mapViewport, 400)

  const { data: places = [], isFetching, isError, refetch } = usePlacesQuery({
    type: activeType,
    bbox: debouncedViewport.bbox,
    zoom: debouncedViewport.zoom || DEFAULT_ZOOM,
    autoRefresh,
  })

  const handleViewportChange = (bbox: BBox, zoom: number) => {
    setViewport({ bbox, zoom })
  }

  const handleLocate = () => {
    requestLocation()
    if (mapInstance && userLocation) {
      const targetZoom = Math.max(mapInstance.getZoom(), 15)
      mapInstance.flyTo([userLocation.lat, userLocation.lng], targetZoom, { duration: 0.5 })
    }
  }

  useEffect(() => {
    if (mapInstance && userLocation && geolocationStatus === 'granted') {
      const targetZoom = Math.max(mapInstance.getZoom(), 15)
      mapInstance.flyTo([userLocation.lat, userLocation.lng], targetZoom, { duration: 0.5 })
    }
  }, [geolocationStatus, userLocation, mapInstance])

  const selectedPlace = useMemo(
    () => places.find((p) => p.id === selectedPlaceId) || null,
    [places, selectedPlaceId],
  )

  useEffect(() => {
    if (!mapInstance || !selectedPlace) return
    const isMobile = window.innerWidth < 1024
    const targetZoom = Math.max(mapInstance.getZoom(), 15)
    mapInstance.flyTo([selectedPlace.lat, selectedPlace.lon], targetZoom, { duration: 0.4 })
    if (isMobile) {
      mapInstance.panBy([0, -120], { animate: true, duration: 0.25 })
    }
  }, [selectedPlace, mapInstance])

  useEffect(() => {
    if (geoError) {
      toast.error(geoError)
    }
  }, [geoError])

  const isEmpty = !isFetching && !isError && places.length === 0 && !!debouncedViewport.bbox

  return (
    <div className="relative min-h-screen bg-background">
      <GlobalHeader />
      <div className="relative flex h-[calc(100vh-64px)] w-full">
        <div className="relative z-10 h-full w-full lg:pr-[360px]">
          <PlacesMap
            places={places}
            selectedPlaceId={selectedPlaceId}
            onSelect={setSelected}
            onViewportChange={handleViewportChange}
            userLocation={userLocation}
            onMapReady={setMapInstance}
          />
          {/* Mobile controls (overlay) */}
          <div className="lg:hidden">
            <MapControls
              autoRefresh={autoRefresh}
              onToggleAutoRefresh={() => setAutoRefresh(!autoRefresh)}
              onLocate={handleLocate}
              onRefresh={() => refetch()}
              showRefresh={!autoRefresh}
              isRefreshing={isFetching}
              variant="overlay"
            />
          </div>
          <MapOverlays isLoading={isFetching} isError={isError} isEmpty={isEmpty} />

          {geolocationStatus === 'denied' && (
            <div className="pointer-events-auto absolute left-4 right-4 top-20 z-30 max-w-xl rounded-xl border bg-background/95 p-4 shadow-lg backdrop-blur">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-amber-100 p-2 text-amber-700">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">Геолокация отключена</p>
                  <p className="text-sm text-muted-foreground">
                    Показана область по умолчанию. Включите геолокацию для точных результатов.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <PlaceSheet
          places={places}
          selectedPlaceId={selectedPlaceId}
          onSelect={setSelected}
          onClose={() => setSelected(null)}
          isLoading={isFetching}
          isError={isError}
          sidebarControls={
            <MapControls
              autoRefresh={autoRefresh}
              onToggleAutoRefresh={() => setAutoRefresh(!autoRefresh)}
              onLocate={handleLocate}
              onRefresh={() => refetch()}
              showRefresh={!autoRefresh}
              isRefreshing={isFetching}
              variant="sidebar"
            />
          }
        />
      </div>
    </div>
  )
}

export default MapPage
