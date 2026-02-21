import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface ErrorStateProps {
  error: string
  onRetry?: () => void
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-center items-center min-h-[40vh]"
    >
      <Card className="max-w-md border-destructive/50">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 rounded-full bg-destructive/10">
              <AlertCircle className="h-10 w-10 text-destructive" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Не удалось получить диагноз</h3>
              <p className="text-sm text-muted-foreground">
                {error || 'Произошла ошибка при обработке запроса. Попробуйте снова.'}
              </p>
            </div>
            {onRetry && (
              <Button onClick={onRetry} variant="outline" className="mt-4">
                Повторить попытку
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
