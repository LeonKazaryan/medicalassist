import { useReducer, useEffect } from 'react'
import type { SessionState, IntakeRequest, BackendResponse, ConversationEntry, HistoryEntry } from '@/types/diagnosis'
import { historyStore } from '../history/historyStore'

type SessionAction =
  | { type: 'SUBMIT_INTAKE'; payload: IntakeRequest }
  | { type: 'RECEIVE_CLARIFICATION'; payload: { response: BackendResponse; request: IntakeRequest } }
  | { type: 'SUBMIT_ANSWER'; payload: { answer: string } }
  | { type: 'RECEIVE_RESULTS'; payload: { response: BackendResponse } }
  | { type: 'LOAD_HISTORICAL'; payload: HistoryEntry }
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
          timestamp: Date.now(),
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
            timestamp: Date.now(),
          }
        }
      }
      return state

    case 'LOAD_HISTORICAL':
      return {
        status: 'complete',
        data: action.payload.request,
        diagnoses: action.payload.diagnoses,
        history: action.payload.history,
        isHistorical: true,
        timestamp: action.payload.timestamp,
      }

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
  const [state, dispatch] = useReducer(sessionReducer, { status: 'idle' }, (initial) => {
    if (typeof window === 'undefined') return initial

    // Check for reset flag in URL
    const params = new URLSearchParams(window.location.search)
    if (params.get('reset') === 'true') {
      localStorage.removeItem(STORAGE_KEY)
      return initial
    }

    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return initial
      }
    }
    return initial
  })

  // Persist to localStorage
  useEffect(() => {
    if (state.status !== 'idle') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [state])

  // Save to history when completing a NEW session
  useEffect(() => {
    if (state.status === 'complete' && !state.isHistorical) {
      const entries = historyStore.getEntries()
      const timestamp = state.timestamp

      const alreadySaved = entries.some(e => e.timestamp === timestamp)

      if (!alreadySaved && timestamp) {
        historyStore.saveEntry(state.data, state.diagnoses, state.history, timestamp)
      }
    }
  }, [state])

  return { state, dispatch }
}
