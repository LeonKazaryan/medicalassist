export const DEFAULT_CENTER = { lat: 51.1694, lng: 71.4491 } // Astana
export const DEFAULT_ZOOM = 13
export const GEOLOCATION_TIMEOUT = 8000
export const CLUSTER_RADIUS = 60
export const MAX_ZOOM = 18

export const ZOOM_BUCKETS = [
  { max: 6, precision: 2 },
  { max: 10, precision: 3 },
  { max: 13, precision: 3 },
  { max: 22, precision: 4 },
] as const

export const MAP_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
export const MAP_ATTRIBUTION = '&copy; OpenStreetMap contributors'
