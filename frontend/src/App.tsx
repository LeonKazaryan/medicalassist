import { motion, AnimatePresence } from 'framer-motion'
import { SymptomForm } from '@/features/intake/SymptomForm'
import { ClarificationView } from '@/features/session/ClarificationView'
import { ResultsView } from '@/features/session/ResultsView'
import { useSessionState } from '@/features/session/useSessionState'
import { useSubmitIntake, useSubmitClarification } from '@/lib/api/hooks'
import { GlobalHeader } from '@/components/common/GlobalHeader'
import { Button } from '@/components/ui/button'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
} from '@/components/ui/dialog'
import { useState, useEffect } from 'react'
import { HistoryPage } from '@/features/history/HistoryPage'
import { HistoryEntry } from '@/types/diagnosis'

interface AppProps {
  isHistory?: boolean
}

function App({ isHistory: isInitialHistory = false }: AppProps) {
  const { state, dispatch } = useSessionState()
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [view, setView] = useState<'diagnostic' | 'history'>(isInitialHistory ? 'history' : 'diagnostic')

  const submitIntakeMutation = useSubmitIntake()
  const submitClarificationMutation = useSubmitClarification()

  // Sync view state with prop changes (for browser back/forward)
  useEffect(() => {
    setView(isInitialHistory ? 'history' : 'diagnostic')
  }, [isInitialHistory])

  const handleIntakeSubmit = async (data: any) => {
    dispatch({ type: 'SUBMIT_INTAKE', payload: data })
    try {
      const result = await submitIntakeMutation.mutateAsync(data)
      dispatch({ type: 'RECEIVE_RESULTS', payload: { response: result } })
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Ошибка сервера' })
    }
  }

  const handleClarificationSubmit = async (answer: string) => {
    if (state.status !== 'clarifying') return
    const currentData = state.data
    const currentQuestion = state.question
    
    dispatch({ type: 'SUBMIT_ANSWER', payload: { answer } })
    
    try {
      const result = await submitClarificationMutation.mutateAsync({
        ...currentData,
        user_prompt: currentData.user_prompt,
        question: currentQuestion,
        answer,
      })
      dispatch({ type: 'RECEIVE_RESULTS', payload: { response: result } })
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Ошибка сервера' })
    }
  }

  const handleHistorySelect = (entry: HistoryEntry) => {
    dispatch({ type: 'LOAD_HISTORICAL', payload: entry })
    setView('diagnostic')
    window.history.replaceState({}, '', '/')
  }

  const handleBackToHistory = () => {
    const url = new URL(window.location.origin + '/history')
    window.history.pushState({}, '', url)
    setView('history')
  }

  const onReset = () => {
    setShowResetDialog(true)
  }

  const confirmReset = () => {
    dispatch({ type: 'RESET' })
    setShowResetDialog(false)
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-grid z-0" />
      <div className="absolute inset-0 bg-radial-gradient z-0 opacity-60" />
      
      <div className="relative z-10">
        <GlobalHeader />
      
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {view === 'history' ? (
            <HistoryPage 
              key="history"
              onSelect={handleHistorySelect} 
              onBack={() => {
                window.location.href = '/?reset=true'
              }}
            />
          ) : (
            <motion.div
              key="diagnostic"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-5xl mx-auto"
            >
              {state.status === 'idle' && (
                <div className="max-w-2xl mx-auto pt-10">
                  <SymptomForm 
                    onSubmit={handleIntakeSubmit} 
                    isLoading={submitIntakeMutation.isPending} 
                  />
                </div>
              )}

              {state.status === 'submitting' && (
                <div className="flex flex-col items-center justify-center py-20 space-y-6">
                  <div className="relative h-16 w-16">
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                    <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-xl font-medium">Анализируем симптомы...</p>
                    <p className="text-muted-foreground">Это может занять несколько секунд</p>
                  </div>
                </div>
              )}

              {state.status === 'clarifying' && (
                <ClarificationView
                  sex={state.data.sex}
                  age={state.data.age}
                  question={state.question}
                  history={state.history}
                  onAnswer={handleClarificationSubmit}
                  onEdit={onReset}
                  isSubmitting={submitClarificationMutation.isPending}
                />
              )}

              {state.status === 'complete' && (
                <ResultsView 
                  diagnoses={state.diagnoses} 
                  onReset={onReset}
                  isHistorical={state.isHistorical}
                  timestamp={state.timestamp}
                  onBackToHistory={handleBackToHistory}
                  onRetry={() => handleIntakeSubmit(state.data)}
                />
              )}

              {state.status === 'error' && (
                <div className="text-center py-12 space-y-6">
                  <div className="bg-destructive/10 text-destructive p-4 rounded-xl inline-block max-w-md">
                    {state.error}
                  </div>
                  <br />
                  <Button onClick={onReset} variant="outline" className="rounded-full">
                    Попробовать снова
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-20 py-8 border-t bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground/60 transition-colors hover:text-muted-foreground">
            Медицинский AI-ассистент для диагностики на основе протоколов Казахстана
          </p>
        </div>
      </footer>

      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent className="rounded-2xl border-white/10 bg-background/95 backdrop-blur-xl shadow-2xl">
          <DialogHeader>
            <DialogTitle>Начать заново?</DialogTitle>
            <DialogDescription>
              Текущая сессия будет сброшена. Все оформленные запросы доступны в разделе «История».
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResetDialog(false)} className="rounded-xl">
              Отмена
            </Button>
            <Button 
              onClick={confirmReset}
              className="rounded-xl bg-primary hover:bg-primary/90"
            >
              Подтвердить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  )
}

export default App
