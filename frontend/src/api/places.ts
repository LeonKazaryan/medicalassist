import axios from 'axios'
import { z } from 'zod'
import { PLACES_BASE_URL } from '@/lib/config/constants'
import type { BBox, Place, PlaceType } from '@/types/place'

const placeSchema = z.object({
  id: z.number(),
  name: z.string(),
  lat: z.number(),
  lon: z.number(),
  address: z.string(),
  rating: z.number().nullable(),
  reviewsCount: z.number().nullable(),
  phones: z.array(z.string()),
})

const responseSchema = z.object({
  items: z.array(placeSchema),
})

const api = axios.create({
  baseURL: PLACES_BASE_URL,
})

export interface FetchPlacesParams {
  type: PlaceType
  bbox: BBox
  zoom: number
}

export async function fetchPlaces({ type, bbox, zoom }: FetchPlacesParams): Promise<Place[]> {
  const [minLng, minLat, maxLng, maxLat] = bbox
  const params = new URLSearchParams({
    type,
    bbox: `${minLng},${minLat},${maxLng},${maxLat}`,
    zoom: zoom.toString(),
  })

  const { data } = await api.get(`/places?${params.toString()}`)
  const parsed = responseSchema.parse(data)
  return parsed.items
}
