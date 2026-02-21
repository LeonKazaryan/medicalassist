import type { BBox } from '@/types/place'
import { ZOOM_BUCKETS } from '@/lib/config/map'

export function toRoundedBBox(bbox: BBox, zoom: number): BBox {
  const precision = getPrecisionForZoom(zoom)
  return bbox.map((value) => Number(value.toFixed(precision))) as BBox
}

export function getZoomBucket(zoom: number): number {
  const bucket = ZOOM_BUCKETS.find((entry: (typeof ZOOM_BUCKETS)[number]) => zoom <= entry.max)
  if (!bucket) return Math.floor(zoom)
  return bucket.max
}

function getPrecisionForZoom(zoom: number): number {
  const bucket = ZOOM_BUCKETS.find((entry: (typeof ZOOM_BUCKETS)[number]) => zoom <= entry.max)
  return bucket ? bucket.precision : 4
}

// Calculate circle center + approximate radius (meters) from bbox
export function bboxCenterAndRadiusMeters(bbox: BBox) {
  const [minLng, minLat, maxLng, maxLat] = bbox
  const center = {
    lat: (minLat + maxLat) / 2,
    lon: (minLng + maxLng) / 2,
  }

  // rough radius: max distance from center to bbox corner using equirectangular approximation
  const latDiff = (maxLat - minLat) / 2
  const lonDiff = (maxLng - minLng) / 2
  const meanLatRad = (center.lat * Math.PI) / 180
  const earthRadius = 6371000 // meters

  const x = (lonDiff * Math.PI) / 180 * Math.cos(meanLatRad)
  const y = (latDiff * Math.PI) / 180
  const radius = Math.sqrt(x * x + y * y) * earthRadius

  return { center, radius }
}
