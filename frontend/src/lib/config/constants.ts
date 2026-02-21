export const CONFIDENCE_THRESHOLD = 0.7
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
export const PLACES_BASE_URL = API_BASE_URL

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
