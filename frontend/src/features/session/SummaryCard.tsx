import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Diagnosis } from '@/types/diagnosis'

interface SummaryCardProps {
  diagnosis: Diagnosis
}

export function SummaryCard({ diagnosis }: SummaryCardProps) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Выбранный диагноз
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={diagnosis.icd10_code || diagnosis.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-bold">{diagnosis.name}</h3>
              {diagnosis.icd10_code && (
                <Badge variant="secondary" className="font-mono">
                  {diagnosis.icd10_code}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium">Уверенность:</div>
              <div className="text-lg font-bold text-primary">
                {Math.round(diagnosis.confidence * 100)}%
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
