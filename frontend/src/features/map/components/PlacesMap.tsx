import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import L, { type Map } from 'leaflet'
import Supercluster from 'supercluster'
import type { BBox, Place } from '@/types/place'
import { CLUSTER_RADIUS, DEFAULT_CENTER, DEFAULT_ZOOM, MAP_ATTRIBUTION, MAP_TILE_URL, MAX_ZOOM } from '@/lib/config/map'

interface PlacesMapProps {
  places: Place[]
  selectedPlaceId: number | null
  onSelect: (id: number) => void
  onViewportChange: (bbox: BBox, zoom: number) => void
  userLocation: { lat: number; lng: number } | null
  onMapReady?: (map: Map) => void
}

export function PlacesMap({
  places,
  selectedPlaceId,
  onSelect,
  onViewportChange,
  userLocation,
  onMapReady,
}: PlacesMapProps) {
  const handleReady = (map: Map) => {
    onMapReady?.(map)
  }

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[
          (userLocation?.lat ?? DEFAULT_CENTER.lat),
          (userLocation?.lng ?? DEFAULT_CENTER.lng),
        ]}
        zoom={DEFAULT_ZOOM}
        minZoom={3}
        zoomControl={false}
        className="h-full w-full"
      >
        <MapReady onReady={handleReady} />
        <TileLayer attribution={MAP_ATTRIBUTION} url={MAP_TILE_URL} />
        <ViewportTracker onViewportChange={onViewportChange} />
        {userLocation && <UserMarker position={userLocation} />}
        <ClusterLayer
          places={places}
          selectedPlaceId={selectedPlaceId}
          onSelect={onSelect}
        />
      </MapContainer>
    </div>
  )
}

function ViewportTracker({
  onViewportChange,
}: {
  onViewportChange: (bbox: BBox, zoom: number) => void
}) {
  const notify = () => {
    const bounds = map.getBounds()
    const bbox: BBox = [
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth(),
    ]
    const zoom = map.getZoom()
    onViewportChange(bbox, zoom)
  }

  const debounceNotify = debounce(notify, 350)

  const map = useMapEvents({
    moveend: debounceNotify,
    zoomend: debounceNotify,
  })

  useEffect(() => {
    notify()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

function ClusterLayer({
  places,
  selectedPlaceId,
  onSelect,
}: {
  places: Place[]
  selectedPlaceId: number | null
  onSelect: (id: number) => void
}) {
  const map = useMap()
  const bounds = map.getBounds()
  const zoom = map.getZoom()
  const bbox: BBox = [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()]

  const points = places.map((place) => ({
    type: 'Feature' as const,
    properties: {
      cluster: false,
      placeId: place.id,
      name: place.name,
      address: place.address,
    },
    geometry: {
      type: 'Point' as const,
      coordinates: [place.lon, place.lat],
    },
  }))

  const index = new Supercluster({
    radius: CLUSTER_RADIUS,
    maxZoom: MAX_ZOOM,
  })

  index.load(points)

  const clusters = index.getClusters(bbox, Math.floor(zoom)) as Array<
    Supercluster.ClusterFeature<any> | Supercluster.PointFeature<any>
  >

  return (
    <>
      {clusters.map((feature) => {
        const [lng, lat] = feature.geometry.coordinates
        const { cluster: isCluster, point_count: pointCount } = feature.properties as any

        if (isCluster) {
          return (
            <Marker
              key={`cluster-${feature.id}`}
              position={[lat, lng]}
              icon={createClusterIcon(pointCount)}
              eventHandlers={{
                click: () => {
                  const expansionZoom = Math.min(
                    index.getClusterExpansionZoom(feature.id as number),
                    MAX_ZOOM,
                  )
                  map.flyTo([lat, lng], expansionZoom, { duration: 0.4 })
                },
              }}
            />
          )
        }

        const placeId = (feature.properties as any).placeId as number
        const isSelected = placeId === selectedPlaceId
        return (
          <Marker
            key={String(placeId)}
            position={[lat, lng]}
            icon={createPlaceIcon(isSelected)}
            eventHandlers={{
              click: () => {
                onSelect(placeId)
              },
            }}
          />
        )
      })}
    </>
  )
}

function UserMarker({ position }: { position: { lat: number; lng: number } }) {
  const icon = L.divIcon({
    className: '',
    html: '<div class="user-marker"></div>',
    iconSize: [16, 16],
  })
  return <Marker position={[position.lat, position.lng]} icon={icon} />
}

function createClusterIcon(count: number) {
  const size = count < 10 ? 36 : count < 50 ? 44 : 52
  return L.divIcon({
    html: `<div class="cluster-marker" style="width:${size}px;height:${size}px;">${count}</div>`,
    className: 'text-white text-sm',
    iconSize: [size, size],
  })
}

function createPlaceIcon(selected: boolean) {
  const base = `
    <div class="relative flex items-center justify-center">
      <div class="rounded-full bg-white shadow-md p-[6px] ${selected ? 'selected-marker' : ''}">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${selected ? '#0ea5e9' : '#0f172a'}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 21c-4-4.5-6-7.5-6-10a6 6 0 1 1 12 0c0 2.5-2 5.5-6 10z"/>
          <circle cx="12" cy="11" r="2.5" ${selected ? 'fill="#0ea5e9" opacity="0.15"' : ''}/>
        </svg>
      </div>
    </div>
  `

  return L.divIcon({
    html: base,
    className: selected ? 'scale-110 transition-transform' : '',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -28],
  })
}

function MapReady({ onReady }: { onReady?: (map: Map) => void }) {
  const map = useMap()
  useEffect(() => {
    if (map && onReady) onReady(map)
  }, [map, onReady])
  return null
}

function debounce<F extends (...args: any[]) => void>(fn: F, delay: number) {
  let timer: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<F>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}
