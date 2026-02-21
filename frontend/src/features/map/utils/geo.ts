import type { BBox } from '@/types/place'
import { ZOOM_BUCKETS } from '@/lib/config/map'

export function toRoundedBBox(bbox: BBox, zoom: number): BBox {
  const precision = getPrecisionForZoom(zoom)
  return bbox.map((value) => Number(value.toFixed(precision))) as BBox
}

export function getZoomBucket(zoom: number): number {
  const bucket = ZOOM_BUCKETS.find((entry) => zoom <= entry.max)
  if (!bucket) return Math.floor(zoom)
  return bucket.max
}

function getPrecisionForZoom(zoom: number): number {
  const bucket = ZOOM_BUCKETS.find((entry) => zoom <= entry.max)
  return bucket ? bucket.precision : 4
}
