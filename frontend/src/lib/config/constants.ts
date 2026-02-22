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

export const ICD_TO_SPECIALIST: Record<string, string> = {
  'A': 'Инфекционист',
  'B': 'Инфекционист',
  'C': 'Онколог',
  'D': 'Гематолог', // Default for D, refined below
  'E': 'Эндокринолог',
  'F': 'Психиатр',
  'G': 'Невролог',
  'H0': 'Офтальмолог',
  'H1': 'Офтальмолог',
  'H2': 'Офтальмолог',
  'H3': 'Офтальмолог',
  'H4': 'Офтальмолог',
  'H5': 'Офтальмолог',
  'H6': 'Отоларинголог (ЛОР)',
  'H7': 'Отоларинголог (ЛОР)',
  'H8': 'Отоларинголог (ЛОР)',
  'H9': 'Отоларинголог (ЛОР)',
  'I': 'Кардиолог',
  'J': 'Пульмонолог',
  'K': 'Гастроэнтеролог',
  'L': 'Дерматолог',
  'M': 'Ортопед',
  'N': 'Уролог',
  'O': 'Акушер-гинеколог',
  'P': 'Неонатолог',
  'Q': 'Генетик',
  'R': 'Терапевт',
  'S': 'Травматолог',
  'T': 'Травматолог',
  'Z': 'Терапевт',
}

export function getSpecialistFromICD(icd?: string): string {
  if (!icd) return 'Терапевт'

  const code = icd.toUpperCase()
  const firstChar = code[0]
  const numericPart = parseInt(code.substring(1, 3))

  // Special handling for D ranges
  if (firstChar === 'D') {
    if (numericPart <= 48) return 'Онколог'
    return 'Гематолог'
  }

  // Check two-char prefixes (like H00-H59)
  if (code.startsWith('H')) {
    if (numericPart <= 59) return 'Офтальмолог'
    return 'Отоларинголог (ЛОР)'
  }

  return ICD_TO_SPECIALIST[firstChar] || 'Терапевт'
}
