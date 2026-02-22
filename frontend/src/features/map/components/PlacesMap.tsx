import { useEffect, useMemo, useRef } from 'react'
import { Tooltip, MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import L, { type Map } from 'leaflet'
import Supercluster from 'supercluster'
import { Star } from 'lucide-react'
import type { BBox, Place } from '@/types/place'
import { CLUSTER_RADIUS, DEFAULT_CENTER, DEFAULT_ZOOM, MAP_ATTRIBUTION, MAP_TILE_URL, MAX_ZOOM } from '@/lib/config/map'
import { useMapStore } from '../state/mapStore'

interface PlacesMapProps {
  places: Place[]
  selectedPlace: Place | null
  onViewportChange: (bbox: BBox, zoom: number) => void
  userLocation: { lat: number; lng: number } | null
  onMapReady?: (map: Map) => void
}

export function PlacesMap({
  places,
  selectedPlace,
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
          selectedPlace={selectedPlace}
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
  const map = useMap()
  
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

  useMapEvents({
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
  selectedPlace,
}: {
  places: Place[]
  selectedPlace: Place | null
}) {
  const map = useMap()
  const { mapViewport, setSelected, hoveredPlaceId, setHoveredId } = useMapStore((state) => ({
    mapViewport: state.mapViewport,
    setSelected: state.setSelected,
    hoveredPlaceId: state.hoveredPlaceId,
    setHoveredId: state.setHoveredId,
  }))

  const points = useMemo(() => places.map((place) => ({
    type: 'Feature' as const,
    properties: {
      cluster: false,
      placeId: place.id,
      name: place.name,
      rating: place.rating,
      address: place.address,
    },
    geometry: {
      type: 'Point' as const,
      coordinates: [place.lon, place.lat],
    },
  })), [places])

  const index = useMemo(() => {
    const si = new Supercluster({
      radius: CLUSTER_RADIUS,
      maxZoom: MAX_ZOOM,
    })
    si.load(points)
    return si
  }, [points])

  // Use mapViewport from store to keep clusters stable during hover re-renders
  const clusters = useMemo(() => {
    if (!mapViewport.bbox) return []
    return index.getClusters(mapViewport.bbox, Math.floor(mapViewport.zoom)) as Array<
      Supercluster.ClusterFeature<any> | Supercluster.PointFeature<any>
    >
  }, [index, mapViewport.bbox, mapViewport.zoom])

  return (
    <>
      {clusters.map((feature: Supercluster.ClusterFeature<any> | Supercluster.PointFeature<any>) => {
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

        const props = feature.properties
        const placeId = props.placeId as number
        const isSelected = placeId === selectedPlace?.id
        const isHovered = placeId === hoveredPlaceId
        
        // Check if this place matches the current specialist filter
        const currentSearch = useMapStore.getState().searchQuery
        const isFiltered = !!currentSearch && (
          props.name.toLowerCase().includes(currentSearch.toLowerCase()) ||
          props.address.toLowerCase().includes(currentSearch.toLowerCase())
        )

        return (
          <Marker
            key={String(placeId)}
            position={[lat, lng]}
            icon={createPlaceIcon(isSelected, isHovered, isFiltered)}
            eventHandlers={{
              click: (e) => {
                console.log('Marker clicked:', placeId);
                // Leaflet events use originalEvent for DOM event
                L.DomEvent.stopPropagation(e.originalEvent || e)
                const place = places.find(p => p.id === placeId)
                if (place) {
                  console.log('Setting selected place:', place.name);
                  setSelected(place);
                } else {
                  console.warn('Place not found for ID:', placeId);
                }
              },
              mouseover: () => {
                console.log('Marker hover start:', placeId);
                setHoveredId(placeId);
              },
              mouseout: () => {
                console.log('Marker hover end');
                setHoveredId(null);
              },
            }}
          >
            {isHovered && (
              <Tooltip 
                direction="top" 
                offset={[0, -32]} 
                opacity={1} 
                permanent={true}
                interactive={false}
                className="custom-tooltip"
              >
                <div className="flex items-center gap-2 px-1">
                  <span className="font-bold text-sm tracking-tight">{props.name}</span>
                  {props.rating && (
                    <div className="flex items-center gap-0.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
                      <Star className="h-2.5 w-2.5 fill-current" />
                      {props.rating.toFixed(1)}
                    </div>
                  )}
                </div>
              </Tooltip>
            )}
          </Marker>
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

function createPlaceIcon(selected: boolean, hovered: boolean, filtered: boolean = false) {
  const base = `
    <div class="relative flex items-center justify-center" style="width: 40px; height: 40px;">
      <div class="rounded-full bg-white shadow-xl p-[6px] border-2 ${selected ? 'border-primary' : 'border-background'} ${hovered ? 'marker-hover-glow marker-bounce' : ''} ${filtered ? 'marker-filtered-pulse' : ''} transition-all duration-300">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${selected || hovered || filtered ? '#0ea5e9' : '#0f172a'}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 21c-4-4.5-6-7.5-6-10a6 6 0 1 1 12 0c0 2.5-2 5.5-6 10z"/>
          <circle cx="12" cy="11" r="2.5" ${selected || hovered || filtered ? 'fill="#0ea5e9" opacity="0.15"' : ''}/>
        </svg>
      </div>
    </div>
  `

  return L.divIcon({
    html: base,
    className: 'custom-place-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  })
}

function MapReady({ onReady }: { onReady?: (map: Map) => void }) {
  const map = useMap()
  const hasCalledOnReady = useRef(false)

  useEffect(() => {
    if (map && onReady && !hasCalledOnReady.current) {
      onReady(map)
      hasCalledOnReady.current = true
    }
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
