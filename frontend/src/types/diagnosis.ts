export type Sex = 'male' | 'female'

export interface IntakeRequest {
  sex?: Sex | null
  age?: number | null
  user_prompt: string
}

export interface ClarificationRequest extends IntakeRequest {
  question: string
  answer: string
}

export interface Diagnosis {
  name: string
  confidence: number
  question?: string
  icd10_code?: string
  explanation?: string
}

export interface ClarificationResponse {
  kind: 'clarify'
  question: string
  updated_prompt?: string
  diagnoses?: Diagnosis[]
}

export interface ResultResponse {
  kind: 'result'
  diagnoses: Diagnosis[]
  updated_prompt?: string
}

export type BackendResponse = ClarificationResponse | ResultResponse

export interface ConversationEntry {
  question: string
  answer: string
  timestamp: number
}

export type SessionState =
  | { status: 'idle' }
  | { status: 'submitting'; data: IntakeRequest }
  | { status: 'clarifying'; data: IntakeRequest; question: string; history: ConversationEntry[] }
  | { status: 'complete'; data: IntakeRequest; diagnoses: Diagnosis[]; history: ConversationEntry[] }
  | { status: 'error'; error: string }
