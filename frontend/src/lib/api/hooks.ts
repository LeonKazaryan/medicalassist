import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import { SEX_LABELS } from '@/lib/config/constants'
import type { IntakeRequest, BackendResponse } from '@/types/diagnosis'

async function submitIntake(payload: IntakeRequest): Promise<BackendResponse> {
  // We append sex and age to the prompt
  let text = payload.user_prompt
  if (payload.sex !== null && payload.sex !== undefined) {
    text += `, пол: ${SEX_LABELS[payload.sex as keyof typeof SEX_LABELS]}`
  }
  if (payload.age !== null && payload.age !== undefined) {
    text += `, возраст: ${payload.age}`
  }

  const response = await axios.post('/diagnose', {
    text: text,
  })

  // The new AI endpoint returns { "diagnoses": [...] }
  // We map it to our ResultResponse format
  const data = response.data
  console.log('DEBUG: AI Raw Response:', data)

  return {
    kind: 'result',
    diagnoses: data.diagnoses.map((d: any) => ({
      name: d.name || d.icd_code || 'Неизвестно',
      confidence: d.confidence ?? (1 / (d.rank || 1)),
      icd10_code: d.icd_code || d.icd10_code,
      explanation: d.explanation,
      question: d.question,
    })),
  } as BackendResponse

}

async function submitClarification(payload: {
  sex?: string | null
  age?: number | null
  user_prompt: string
  question: string
  answer: string
}): Promise<BackendResponse> {
  let text = `${payload.user_prompt}. Дополнительная информация: ${payload.answer}`
  if (payload.sex !== null && payload.sex !== undefined) {
    text += `, пол: ${SEX_LABELS[payload.sex as keyof typeof SEX_LABELS]}`
  }
  if (payload.age !== null && payload.age !== undefined) {
    text += `, возраст: ${payload.age}`
  }

  const response = await axios.post('/diagnose', {
    text: text,
  })

  const data = response.data
  console.log('DEBUG: AI Raw Response (Clarification):', data)

  return {
    kind: 'result',
    diagnoses: data.diagnoses.map((d: any) => ({
      name: d.name || d.icd_code || 'Неизвестно',
      confidence: d.confidence ?? (1 / (d.rank || 1)),
      icd10_code: d.icd_code || d.icd10_code,
      explanation: d.explanation,
      question: d.question,
    })),
  } as BackendResponse

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
