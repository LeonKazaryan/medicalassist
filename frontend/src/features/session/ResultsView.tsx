import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DiagnosisCard } from './DiagnosisCard'
import { RecommendedDoctorCard } from './RecommendedDoctorCard'
import { SummaryCard } from './SummaryCard'
import { NextStepsCard } from './NextStepsCard'
import type { Diagnosis } from '@/types/diagnosis'

interface ResultsViewProps {
  diagnoses: Diagnosis[]
  onReset: () => void
}

export function ResultsView({ diagnoses, onReset }: ResultsViewProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  
  // Sort by confidence descending
  const sortedDiagnoses = [...diagnoses].sort((a, b) => b.confidence - a.confidence)
  const selectedDiagnosis = sortedDiagnoses[selectedIndex] || sortedDiagnoses[0]

  const handleFindDoctor = (specialist: string) => {
    // Navigate to the /map route which is handled in main.tsx
    window.location.href = `/map?specialist=${encodeURIComponent(specialist)}`
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto space-y-6"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onReset}
          className="group text-muted-foreground hover:text-foreground pl-0"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Новый запрос
        </Button>
      </div>

      <div className="px-2 mb-8">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold tracking-tight mb-2"
        >
          Результаты диагностики
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground text-lg"
        >
          На основе ваших симптомов мы подготовили следующие выводы
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: List of Diagnoses */}
        <div className="lg:col-span-7 space-y-4">
          {sortedDiagnoses.slice(0, 3).map((diagnosis, index) => (
            <DiagnosisCard
              key={index}
              index={index}
              diagnosis={diagnosis}
              rank={index + 1}
              isSelected={selectedIndex === index}
              onSelect={() => setSelectedIndex(index)}
            />
          ))}
        </div>

        {/* Right Column: CTA and Details */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8">
          <RecommendedDoctorCard 
            icdCode={selectedDiagnosis.icd10_code}
            diagnosisTitle={selectedDiagnosis.name}
            onFindDoctor={handleFindDoctor}
          />

          <SummaryCard diagnosis={selectedDiagnosis} />

          <NextStepsCard />
        </div>
      </div>
    </motion.div>
  )
}
