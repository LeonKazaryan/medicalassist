import { create } from 'zustand'
import type { PlaceType, ViewportState } from '@/types/place'

type GeolocationStatus = 'idle' | 'loading' | 'granted' | 'denied' | 'error'

interface MapState {
  activeType: PlaceType
  autoRefresh: boolean
  selectedPlaceId: number | null
  userLocation: { lat: number; lng: number } | null
  geolocationStatus: GeolocationStatus
  mapViewport: ViewportState
  setType: (type: PlaceType) => void
  setAutoRefresh: (value: boolean) => void
  setSelected: (id: number | null) => void
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
  autoRefresh: true,
  selectedPlaceId: null,
  userLocation: null,
  geolocationStatus: 'idle',
  mapViewport: defaultViewport,
  setType: (type) => set({ activeType: type, selectedPlaceId: null }),
  setAutoRefresh: (value) => set({ autoRefresh: value }),
  setSelected: (id) => set({ selectedPlaceId: id }),
  setUserLocation: (coords) => set({ userLocation: coords }),
  setGeolocationStatus: (status) => set({ geolocationStatus: status }),
  setViewport: (viewport) =>
    set((state) => ({
      mapViewport: {
        ...state.mapViewport,
        ...viewport,
      },
    })),
  clearSelection: () => set({ selectedPlaceId: null }),
}))
