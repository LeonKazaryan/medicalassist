import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils/cn'

interface ChatMessageProps {
  variant: 'assistant' | 'user'
  children: React.ReactNode
  timestamp?: number
}

export function ChatMessage({ variant, children, timestamp }: ChatMessageProps) {
  const isAssistant = variant === 'assistant'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex w-full',
        isAssistant ? 'justify-start' : 'justify-end'
      )}
    >
      <div className={cn('max-w-[85%]', isAssistant ? 'mr-auto' : 'ml-auto')}>
        <Card
          className={cn(
            'p-4',
            isAssistant
              ? 'bg-card border-border/50'
              : 'bg-primary/5 border-primary/20'
          )}
        >
          {children}
        </Card>
        {timestamp && (
          <p className="text-xs text-muted-foreground mt-1 px-1">
            {new Date(timestamp).toLocaleTimeString('ru-RU', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        )}
      </div>
    </motion.div>
  )
}
