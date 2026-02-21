import axios from 'axios'
import { z } from 'zod'
import { PLACES_BASE_URL } from '@/lib/config/constants'
import type { BBox, Place, PlaceType } from '@/types/place'
import { bboxCenterAndRadiusMeters } from '@/features/map/utils/geo'

const placeSchema = z.object({
  id: z.coerce.number(),
  name: z.string(),
  lat: z.coerce.number(),
  lon: z.coerce.number(),
  address: z.string().default(''),
  rating: z.coerce.number().nullable().default(null),
  reviewsNumber: z.coerce.number().optional(),
  reviewsCount: z.coerce.number().optional(),
})

const api = axios.create({
  baseURL: PLACES_BASE_URL,
})

export interface FetchPlacesParams {
  type: PlaceType
  bbox: BBox
  zoom: number
}

// Note: backend expects Russian request param, so we map types here
const REQUEST_BY_TYPE: Record<PlaceType, string> = {
  pharmacy: 'аптека',
  clinic: 'клиника',
}

export async function fetchPlaces({ type, bbox, zoom: _zoom }: FetchPlacesParams): Promise<Place[]> {
  const { center, radius } = bboxCenterAndRadiusMeters(bbox)

  const params = new URLSearchParams({
    request: REQUEST_BY_TYPE[type] ?? 'аптека',
    lat: center.lat.toString(),
    lon: center.lon.toString(),
    radius: Math.round(radius).toString(),
  })

  const { data } = await api.get(`/locations?${params.toString()}`)
  const parsed = z.array(placeSchema).parse(data)

  return parsed.map((item) => ({
    id: item.id,
    name: item.name,
    lat: item.lat,
    lon: item.lon,
    address: item.address,
    rating: item.rating ?? null,
    reviewsCount: item.reviewsCount ?? item.reviewsNumber ?? null,
    phones: [],
  }))
}
