import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import { backendResponseSchema, clarificationRequestSchema, intakeRequestSchema } from './schemas'
import { API_BASE_URL } from '@/lib/config/constants'
import type { IntakeRequest, BackendResponse } from '@/types/diagnosis'

const api = axios.create({
  baseURL: API_BASE_URL,
})

async function submitIntake(payload: IntakeRequest): Promise<BackendResponse> {
  const parsed = intakeRequestSchema.parse(payload)
  const { data } = await api.post('/diagnose', parsed)
  return backendResponseSchema.parse(data)
}

async function submitClarification(payload: {
  sex: string
  age?: number | null
  user_prompt: string
  question: string
  answer: string
}): Promise<BackendResponse> {
  const parsed = clarificationRequestSchema.parse(payload)
  const { data } = await api.post('/diagnose', parsed)
  return backendResponseSchema.parse(data)
}

export function useSubmitIntake() {
  return useMutation({
    mutationFn: submitIntake,
  })
}

export function useSubmitClarification() {
  return useMutation({
    mutationFn: submitClarification,
  })
}
