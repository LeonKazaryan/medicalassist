import { toast } from 'sonner'
import { AnimatePresence } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Layout } from '@/app/layout'
import { SymptomForm } from '@/features/intake/SymptomForm'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
import { ClarificationView } from '@/features/session/ClarificationView'
import { ResultsView } from '@/features/session/ResultsView'
import { useSessionState } from '@/features/session/useSessionState'
import { useSubmitIntake, useSubmitClarification } from '@/lib/api/hooks'
import type { IntakeRequest } from '@/types/diagnosis'
import { useState } from 'react'

function App() {
  const { state, dispatch } = useSessionState()
  const [showResetDialog, setShowResetDialog] = useState(false)

  const intakeMutation = useSubmitIntake()
  const clarificationMutation = useSubmitClarification()

  // Handle intake submission
  const handleIntakeSubmit = (data: IntakeRequest) => {
    dispatch({ type: 'SUBMIT_INTAKE', payload: data })
    
    intakeMutation.mutate(data, {
      onSuccess: (response) => {
        dispatch({
          type: 'RECEIVE_CLARIFICATION',
          payload: { response, request: data },
        })
      },
      onError: (error) => {
        dispatch({ type: 'SET_ERROR', payload: error.message })
        toast.error('Ошибка', {
          description: error.message || 'Не удалось получить диагноз',
        })
      },
    })
  }

  // Handle clarification answer
  const handleClarificationAnswer = (answer: string) => {
    if (state.status !== 'clarifying') return

    dispatch({ type: 'SUBMIT_ANSWER', payload: { answer } })

    const clarificationRequest = {
      ...state.data,
      question: state.question,
      answer,
    }

    clarificationMutation.mutate(clarificationRequest, {
      onSuccess: (response) => {
        dispatch({ type: 'RECEIVE_RESULTS', payload: { response } })
        
        if (response.kind === 'result') {
          toast.success('Диагностика завершена', {
            description: `Найдено ${response.diagnoses.length} возможных диагноза`,
          })
        }
      },
      onError: (error) => {
        dispatch({ type: 'SET_ERROR', payload: error.message })
        toast.error('Ошибка', {
          description: error.message || 'Не удалось обработать ответ',
        })
      },
    })
  }

  // Handle reset/edit
  const handleReset = () => {
    dispatch({ type: 'RESET' })
    setShowResetDialog(false)
    toast.info('Сессия сброшена', {
      description: 'Начните новую оценку',
    })
  }

  // Handle retry on error
  const handleRetry = () => {
    if (state.status === 'error') {
      dispatch({ type: 'RESET' })
    }
  }

  return (
    <Layout>
      <AnimatePresence mode="wait">
        {state.status === 'idle' && (
          <SymptomForm
            onSubmit={handleIntakeSubmit}
            isLoading={intakeMutation.isPending}
          />
        )}

        {state.status === 'submitting' && <LoadingState />}

        {state.status === 'clarifying' && (
          <ClarificationView
            sex={state.data.sex || undefined}
            age={state.data.age}
            question={state.question}
            history={state.history}
            onAnswer={handleClarificationAnswer}
            onEdit={() => setShowResetDialog(true)}
            isSubmitting={clarificationMutation.isPending}
          />
        )}

        {state.status === 'complete' && (
          <ResultsView 
            diagnoses={state.diagnoses} 
            onReset={() => setShowResetDialog(true)} 
          />
        )}

        {state.status === 'error' && (
          <ErrorState error={state.error} onRetry={handleRetry} />
        )}
      </AnimatePresence>

      {/* Reset confirmation dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Начать новую оценку?</DialogTitle>
            <DialogDescription>
              Текущая сессия будет потеряна. Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowResetDialog(false)}
            >
              Отмена
            </Button>
            <Button variant="destructive" onClick={handleReset}>
              Сбросить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  )
}

export default App
