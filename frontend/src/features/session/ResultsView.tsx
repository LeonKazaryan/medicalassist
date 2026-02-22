import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, RotateCcw, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DiagnosisCard } from './DiagnosisCard'
import { RecommendedDoctorCard } from './RecommendedDoctorCard'
import { NextStepsCard } from './NextStepsCard'
import type { Diagnosis } from '@/types/diagnosis'

interface ResultsViewProps {
  diagnoses: Diagnosis[]
  onReset: () => void
  isHistorical?: boolean
  timestamp?: number
  onBackToHistory?: () => void
  onRetry?: () => void
}

export function ResultsView({ 
  diagnoses, 
  onReset, 
  isHistorical, 
  timestamp,
  onBackToHistory,
  onRetry 
}: ResultsViewProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  
  const sortedDiagnoses = [...diagnoses].sort((a, b) => b.confidence - a.confidence)
  const selectedDiagnosis = sortedDiagnoses[selectedIndex] || sortedDiagnoses[0]

  const handleFindDoctor = (specialist: string) => {
    window.location.href = `/map?specialist=${encodeURIComponent(specialist)}`
  }

  const dateStr = timestamp ? new Date(timestamp).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }) : ''

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto space-y-6"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          {isHistorical && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBackToHistory}
              className="group text-muted-foreground hover:text-foreground pl-0"
            >
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              К истории
            </Button>
          )}
          <Button 
            variant={isHistorical ? "outline" : "ghost"} 
            size="sm" 
            onClick={onReset}
            className={`group ${isHistorical ? "rounded-full py-0 h-8 text-xs" : "text-muted-foreground hover:text-foreground pl-0"}`}
          >
            {!isHistorical && <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />}
            Новый запрос
          </Button>
        </div>

        {isHistorical && (
          <div className="flex items-center gap-3">
             <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="rounded-full bg-primary/5 border-primary/20 text-primary hover:bg-primary/10"
            >
              <RotateCcw className="mr-2 h-3.5 w-3.5" />
              Повторить анализ
            </Button>
            <Badge variant="outline" className="bg-muted/30 text-muted-foreground border-border py-1 px-3">
              <Clock className="mr-2 h-3 w-3" />
              Запись от {dateStr}
            </Badge>
          </div>
        )}
      </div>

      <div className="px-2 mb-8">
        <div className="flex items-center gap-4">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold tracking-tight mb-2"
          >
            Результаты диагностики
          </motion.h2>
          {isHistorical && (
            <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/10 mt-1">Архив</Badge>
          )}
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground text-lg"
        >
          {isHistorical 
            ? 'Просмотр сохраненного результата из вашей истории'
            : 'На основе ваших симптомов мы подготовили следующие выводы'}
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

          <NextStepsCard />
        </div>
      </div>
    </motion.div>
  )
}
