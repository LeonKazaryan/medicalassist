import { motion } from 'framer-motion'
import { FileQuestion } from 'lucide-react'

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[40vh] text-center space-y-4"
    >
      <div className="p-4 rounded-full bg-muted/50">
        <FileQuestion className="h-12 w-12 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Опишите симптомы</h3>
        <p className="text-muted-foreground max-w-sm">
          Опишите симптомы для начала диагностики
        </p>
      </div>
    </motion.div>
  )
}
