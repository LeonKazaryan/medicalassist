import { useReducer, useEffect } from 'react'
import type { SessionState, IntakeRequest, BackendResponse, ConversationEntry } from '@/types/diagnosis'

type SessionAction =
  | { type: 'SUBMIT_INTAKE'; payload: IntakeRequest }
  | { type: 'RECEIVE_CLARIFICATION'; payload: { response: BackendResponse; request: IntakeRequest } }
  | { type: 'SUBMIT_ANSWER'; payload: { answer: string } }
  | { type: 'RECEIVE_RESULTS'; payload: { response: BackendResponse } }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'RESET' }

function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'SUBMIT_INTAKE':
      return {
        status: 'submitting',
        data: action.payload,
      }

    case 'RECEIVE_CLARIFICATION':
      if (action.payload.response.kind === 'clarify') {
        return {
          status: 'clarifying',
          data: action.payload.request,
          question: action.payload.response.question,
          history: [],
        }
      } else {
        return {
          status: 'complete',
          data: action.payload.request,
          diagnoses: action.payload.response.diagnoses,
          history: [],
        }
      }

    case 'SUBMIT_ANSWER':
      if (state.status === 'clarifying') {
        const newEntry: ConversationEntry = {
          question: state.question,
          answer: action.payload.answer,
          timestamp: Date.now(),
        }
        return {
          status: 'submitting',
          data: state.data,
          history: [...state.history, newEntry],
        } as SessionState
      }
      return state

    case 'RECEIVE_RESULTS':
      if (state.status === 'submitting' || state.status === 'clarifying') {
        if (action.payload.response.kind === 'clarify') {
          return {
            status: 'clarifying',
            data: state.data,
            question: action.payload.response.question,
            history: state.status === 'clarifying' ? state.history : [],
          }
        } else {
          return {
            status: 'complete',
            data: state.data,
            diagnoses: action.payload.response.diagnoses,
            history: state.status === 'clarifying' ? state.history : [],
          }
        }
      }
      return state

    case 'SET_ERROR':
      return {
        status: 'error',
        error: action.payload,
      }

    case 'RESET':
      return { status: 'idle' }

    default:
      return state
  }
}

const STORAGE_KEY = 'medical_diagnosis_session'

export function useSessionState() {
  const [state, dispatch] = useReducer(sessionReducer, { status: 'idle' })

  // Persist to localStorage
  useEffect(() => {
    if (state.status !== 'idle') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [state])

  return { state, dispatch }
}
