export type PlaceType = 'pharmacy' | 'clinic'

export type BBox = [number, number, number, number] // [minLng, minLat, maxLng, maxLat]

export interface Place {
  id: number
  name: string
  lat: number
  lon: number
  address: string
  rating: number | null
  reviewsCount: number | null
  phones: string[]
}

export interface ViewportState {
  zoom: number
  bbox: BBox | null
}
