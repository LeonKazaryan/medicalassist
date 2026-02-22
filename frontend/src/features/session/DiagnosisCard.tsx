import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import type { Diagnosis } from '@/types/diagnosis'
import { CONFIDENCE_LABELS } from '@/lib/config/constants'

interface DiagnosisCardProps {
  diagnosis: Diagnosis
  rank: number
  isSelected?: boolean
  onSelect?: () => void
  index: number
}

function getConfidenceLevel(confidence: number): keyof typeof CONFIDENCE_LABELS {
  if (confidence >= 0.7) return 'HIGH'
  if (confidence >= 0.4) return 'MODERATE'
  return 'LOW'
}

function getConfidenceColor(confidence: number): string {
  if (confidence >= 0.7) return 'text-primary'
  if (confidence >= 0.4) return 'text-muted-foreground'
  return 'text-muted-foreground/60'
}

export function DiagnosisCard({ diagnosis, rank, isSelected, onSelect, index }: DiagnosisCardProps) {
  const confidenceLevel = getConfidenceLevel(diagnosis.confidence)
  const confidenceColor = getConfidenceColor(diagnosis.confidence)
  const confidencePercent = Math.round(diagnosis.confidence * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.12 }}
      whileHover={{ y: -2 }}
      className="cursor-pointer group"
      onClick={onSelect}
    >
      <Card
        className={`transition-all duration-300 relative overflow-hidden ring-offset-background ${
          isSelected 
            ? 'border-primary ring-2 ring-primary/20 shadow-lg bg-primary/[0.04]' 
            : 'border-border/50 bg-card/40 hover:border-primary/40 hover:shadow-md'
        }`}
      >
        {isSelected && (
          <motion.div 
            layoutId="active-diagnosis-glow"
            className="absolute left-0 top-0 w-1 h-full bg-primary"
          />
        )}
        
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={isSelected ? "default" : "outline"} className="text-[10px] h-5 px-1.5 uppercase font-bold tracking-wider">
                    Вариант #{rank}
                  </Badge>
                  {diagnosis.icd10_code && diagnosis.icd10_code !== 'Unknown' && (
                    <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-mono bg-secondary/50">
                      ICD-10: {diagnosis.icd10_code}
                    </Badge>
                  )}
                </div>
                <h3 className={`text-xl font-bold transition-colors ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                  {diagnosis.name}
                </h3>
              </div>
            </div>

            {/* Confidence bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs uppercase tracking-widest font-bold">
                <span className={confidenceColor}>
                  {CONFIDENCE_LABELS[confidenceLevel]}
                </span>
                <span className="text-muted-foreground">{confidencePercent}%</span>
              </div>
              <div className="relative h-1.5 w-full bg-secondary/30 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${confidencePercent}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: (index * 0.12) + 0.3 }}
                  className={`absolute top-0 left-0 h-full rounded-full transition-shadow duration-300 ${
                    isSelected ? 'bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]' : 'bg-primary/70'
                  }`}
                />
              </div>
            </div>

            {/* Explanation accordion */}
            {diagnosis.explanation && (
              <Accordion 
                type="single" 
                collapsible 
                className="w-full"
                onClick={(e) => e.stopPropagation()} // Prevent card selection when interacting with accordion
              >
                <AccordionItem value="explanation" className="border-0">
                  <AccordionTrigger className="text-xs font-bold uppercase tracking-widest py-2 hover:no-underline text-muted-foreground hover:text-foreground transition-colors group">
                    Почему этот диагноз?
                  </AccordionTrigger>
                  <AccordionContent>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="pt-2"
                    >
                      <p className="text-sm text-muted-foreground leading-relaxed border-l-2 border-border pl-4">
                        {diagnosis.explanation}
                      </p>
                    </motion.div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
