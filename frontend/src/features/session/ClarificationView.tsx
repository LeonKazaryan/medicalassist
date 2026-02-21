import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { CaseHeader } from '@/components/common/CaseHeader'
import { ChatMessage } from '@/components/common/ChatMessage'
import { QuestionCard } from './QuestionCard'
import type { Sex, ConversationEntry } from '@/types/diagnosis'

interface ClarificationViewProps {
  sex: Sex
  age?: number | null
  question: string
  history: ConversationEntry[]
  onAnswer: (answer: string) => void
  onEdit: () => void
  isSubmitting?: boolean
  updatedPrompt?: string
}

export function ClarificationView({
  sex,
  age,
  question,
  history,
  onAnswer,
  onEdit,
  isSubmitting,
  updatedPrompt,
}: ClarificationViewProps) {
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, question])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <CaseHeader sex={sex} age={age} onEdit={onEdit} />

      <div className="space-y-6 pb-8">
        {/* Conversation history */}
        {history.map((entry, index) => (
          <div key={index} className="space-y-4">
            <ChatMessage variant="assistant" timestamp={entry.timestamp}>
              <p>{entry.question}</p>
            </ChatMessage>
            <ChatMessage variant="user" timestamp={entry.timestamp}>
              <p>{entry.answer}</p>
            </ChatMessage>
          </div>
        ))}

        {/* Current question */}
        <ChatMessage variant="assistant">
          <QuestionCard
            question={question}
            onAnswer={onAnswer}
            isSubmitting={isSubmitting}
          />
        </ChatMessage>

        {/* What we captured section */}
        {updatedPrompt && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="captured">
                <AccordionTrigger className="text-sm">
                  Что мы зафиксировали
                </AccordionTrigger>
                <AccordionContent>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {updatedPrompt}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        )}

        <div ref={chatEndRef} />
      </div>
    </motion.div>
  )
}
