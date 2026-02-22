import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import type { IntakeRequest, BackendResponse } from '@/types/diagnosis'

async function submitIntake(payload: IntakeRequest): Promise<BackendResponse> {
  // We only send the user_prompt as "text" to the new AI endpoint
  const response = await axios.post('/diagnose', {
    text: payload.user_prompt,
  })

  // The new AI endpoint returns { "diagnoses": [...] }
  // We map it to our ResultResponse format
  const data = response.data
  return {
    kind: 'result',
    diagnoses: data.diagnoses.map((d: any) => ({
      name: d.name || d.icd10_code, // fallback if name is missing
      confidence: d.confidence ?? (1 / (d.rank || 1)), // synthetic confidence if missing
      icd10_code: d.icd10_code,
      explanation: d.explanation,
      question: d.question,
    })),
  } as BackendResponse
}

async function submitClarification(payload: {
  sex: string
  age?: number | null
  user_prompt: string
  question: string
  answer: string
}): Promise<BackendResponse> {
  // If the new AI endpoint supports clarification, we'd send it here.
  // For now, we just resend the prompt or treated as a new diagnosis request.
  // Given the user request, it seems they want the basic diagnosis working first.
  const response = await axios.post('/diagnose', {
    text: `${payload.user_prompt}. Дополнительная информация: ${payload.answer}`,
  })

  const data = response.data
  return {
    kind: 'result',
    diagnoses: data.diagnoses.map((d: any) => ({
      name: d.name || d.icd10_code,
      confidence: d.confidence ?? (1 / (d.rank || 1)),
      icd10_code: d.icd10_code,
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
