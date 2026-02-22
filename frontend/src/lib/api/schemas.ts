import { z } from 'zod'

export const intakeRequestSchema = z.object({
  sex: z.enum(['male', 'female']).optional().nullable(),
  age: z.number().int().min(0).max(120).nullable().optional(),
  user_prompt: z.string().min(10).max(2000),
})

export const clarificationRequestSchema = intakeRequestSchema.extend({
  question: z.string().min(1),
  answer: z.string().min(1),
})

const diagnosisSchema = z.object({
  name: z.string(),
  confidence: z.number(),
  icd10_code: z.string().optional(),
  explanation: z.string().optional(),
  question: z.string().optional(),
})

export const backendResponseSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('clarify'),
    question: z.string(),
    updated_prompt: z.string().optional(),
    diagnoses: z.array(diagnosisSchema).optional(),
  }),
  z.object({
    kind: z.literal('result'),
    diagnoses: z.array(diagnosisSchema),
    updated_prompt: z.string().optional(),
  }),
])

export type IntakeRequestInput = z.infer<typeof intakeRequestSchema>
export type ClarificationRequestInput = z.infer<typeof clarificationRequestSchema>
