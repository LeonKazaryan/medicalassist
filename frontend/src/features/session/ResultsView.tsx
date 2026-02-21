import { motion } from 'framer-motion'
import { DiagnosisCard } from './DiagnosisCard'
import { AssessmentPanel } from './AssessmentPanel'
import type { Diagnosis } from '@/types/diagnosis'

interface ResultsViewProps {
  diagnoses: Diagnosis[]
}

export function ResultsView({ diagnoses }: ResultsViewProps) {
  // Sort by confidence descending
  const sortedDiagnoses = [...diagnoses].sort((a, b) => b.confidence - a.confidence)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div>
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-semibold mb-2"
        >
          Результаты диагностики
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground"
        >
          Найдено {sortedDiagnoses.length} возможных диагноза
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Diagnoses list */}
        <div className="lg:col-span-2 space-y-4">
          {sortedDiagnoses.map((diagnosis, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <DiagnosisCard
                diagnosis={diagnosis}
                rank={index + 1}
                isTopRanked={index === 0}
              />
            </motion.div>
          ))}
        </div>

        {/* Assessment panel */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <AssessmentPanel />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
