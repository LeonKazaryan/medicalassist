export const CONFIDENCE_THRESHOLD = 0.7

// Prefer same-origin /api in local dev to dodge CORS; allow explicit override for prod
const envApi = import.meta.env.VITE_API_URL
const isLocalhost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')

const rawApiBase = isLocalhost ? '/api' : envApi || '/api'

export const API_BASE_URL = rawApiBase
export const PLACES_BASE_URL = rawApiBase.endsWith('/api') ? rawApiBase : `${rawApiBase}/api`

export const CONFIDENCE_LABELS = {
  HIGH: 'Высокая уверенность',
  MODERATE: 'Умеренная уверенность',
  LOW: 'Низкая уверенность',
} as const

export const SEX_OPTIONS = {
  MALE: 'male',
  FEMALE: 'female',
} as const

export const SEX_LABELS = {
  male: 'Мужской',
  female: 'Женский',
} as const
