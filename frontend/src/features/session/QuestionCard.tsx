import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface QuestionCardProps {
  question: string
  onAnswer: (answer: string) => void
  isSubmitting?: boolean
}

export function QuestionCard({ question, onAnswer, isSubmitting }: QuestionCardProps) {
  const [answer, setAnswer] = useState('')
  const [mode, setMode] = useState<'buttons' | 'text'>('buttons')

  const quickResponses = [
    { label: 'Да', value: 'Да' },
    { label: 'Нет', value: 'Нет' },
    { label: 'Не уверен', value: 'Не уверен' },
  ]

  const handleQuickResponse = (value: string) => {
    onAnswer(value)
  }

  const handleCustomSubmit = () => {
    if (answer.trim().length >= 2) {
      onAnswer(answer.trim())
    }
  }

  const isValidCustomAnswer = answer.trim().length >= 2

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-4">{question}</h3>
      </div>

      {mode === 'buttons' ? (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {quickResponses.map((response) => (
              <Button
                key={response.value}
                variant="outline"
                onClick={() => handleQuickResponse(response.value)}
                disabled={isSubmitting}
                className="h-auto py-3"
              >
                {response.label}
              </Button>
            ))}
          </div>
          <Button
            variant="ghost"
            onClick={() => setMode('text')}
            className="w-full"
            disabled={isSubmitting}
          >
            Дать подробный ответ
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <Label htmlFor="custom-answer">Ваш ответ</Label>
            <Textarea
              id="custom-answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Опишите подробнее..."
              className="min-h-[100px] mt-2"
              disabled={isSubmitting}
              autoFocus
            />
            <p className="text-xs text-muted-foreground mt-1">
              Минимум 2 символа
            </p>
          </div>
          
          <AnimatePresence>
            {isValidCustomAnswer && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Button
                  onClick={handleCustomSubmit}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  Отправить ответ
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            variant="ghost"
            onClick={() => setMode('buttons')}
            className="w-full"
            disabled={isSubmitting}
          >
            Вернуться к быстрым ответам
          </Button>
        </div>
      )}
    </div>
  )
}
