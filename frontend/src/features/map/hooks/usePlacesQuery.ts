import { useQuery } from '@tanstack/react-query'
import { fetchPlaces } from '@/api/places'
import { getZoomBucket, toRoundedBBox } from '../utils/geo'
import type { BBox, PlaceType } from '@/types/place'

interface Params {
  type: PlaceType
  bbox: BBox | null
  zoom: number
  autoRefresh: boolean
}

export function usePlacesQuery({ type, bbox, zoom, autoRefresh }: Params) {
  const roundedBBox = bbox ? toRoundedBBox(bbox, zoom) : null
  const zoomBucket = getZoomBucket(zoom)

  const query = useQuery({
    queryKey: ['places', type, roundedBBox, zoomBucket],
    queryFn: () => {
      if (!roundedBBox) {
        return Promise.resolve([])
      }
      return fetchPlaces({
        type,
        bbox: roundedBBox,
        zoom: zoomBucket,
      })
    },
    enabled: Boolean(roundedBBox) && autoRefresh,
    gcTime: 1000 * 60 * 5,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
  })

  return {
    ...query,
    zoomBucket,
    roundedBBox,
  }
}
