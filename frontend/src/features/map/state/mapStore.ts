import { create } from 'zustand'
import type { Place, PlaceType, ViewportState } from '@/types/place'

type GeolocationStatus = 'idle' | 'loading' | 'granted' | 'denied' | 'error'

interface MapState {
  activeType: PlaceType
  searchQuery: string
  autoRefresh: boolean
  selectedPlace: Place | null
  hoveredPlaceId: number | null
  userLocation: { lat: number; lng: number } | null
  geolocationStatus: GeolocationStatus
  mapViewport: ViewportState
  setType: (type: PlaceType) => void
  setSearchQuery: (query: string) => void
  setAutoRefresh: (value: boolean) => void
  setSelected: (place: Place | null) => void
  setHoveredId: (id: number | null) => void
  setUserLocation: (coords: { lat: number; lng: number } | null) => void
  setGeolocationStatus: (status: GeolocationStatus) => void
  setViewport: (viewport: Partial<ViewportState>) => void
  clearSelection: () => void
}

const defaultViewport: ViewportState = {
  zoom: 13,
  bbox: null,
}

export const useMapStore = create<MapState>((set) => ({
  activeType: 'pharmacy',
  searchQuery: '',
  autoRefresh: true,
  selectedPlace: null,
  hoveredPlaceId: null,
  userLocation: null,
  geolocationStatus: 'idle',
  mapViewport: defaultViewport,
  setType: (type) => set({ activeType: type, selectedPlace: null, searchQuery: '' }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setAutoRefresh: (value) => set({ autoRefresh: value }),
  setSelected: (place) => set({ selectedPlace: place }),
  setHoveredId: (id) => set({ hoveredPlaceId: id }),
  setUserLocation: (coords) => set({ userLocation: coords }),
  setGeolocationStatus: (status) => set({ geolocationStatus: status }),
  setViewport: (viewport) =>
    set((state) => ({
      mapViewport: {
        ...state.mapViewport,
        ...viewport,
      },
    })),
  clearSelection: () => set({ selectedPlace: null }),
}))
