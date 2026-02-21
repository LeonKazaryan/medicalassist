import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import type { Diagnosis } from '@/types/diagnosis'
import { CONFIDENCE_LABELS } from '@/lib/config/constants'

interface DiagnosisCardProps {
  diagnosis: Diagnosis
  rank: number
  isTopRanked?: boolean
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

export function DiagnosisCard({ diagnosis, rank, isTopRanked }: DiagnosisCardProps) {
  const confidenceLevel = getConfidenceLevel(diagnosis.confidence)
  const confidenceColor = getConfidenceColor(diagnosis.confidence)
  const confidencePercent = Math.round(diagnosis.confidence * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02, y: -2 }}
    >
      <Card
        className={`transition-all duration-200 hover:shadow-md ${
          isTopRanked ? 'border-primary/50 bg-primary/[0.02]' : ''
        }`}
      >
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">
                    #{rank}
                  </Badge>
                  {diagnosis.icd10_code && (
                    <Badge variant="secondary" className="text-xs font-mono">
                      {diagnosis.icd10_code}
                    </Badge>
                  )}
                </div>
                <h3 className="text-xl font-semibold">{diagnosis.name}</h3>
              </div>
            </div>

            {/* Confidence bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className={confidenceColor}>
                  {CONFIDENCE_LABELS[confidenceLevel]}
                </span>
                <span className="font-medium">{confidencePercent}%</span>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Progress
                  value={confidencePercent}
                  className="h-2"
                />
              </motion.div>
            </div>

            {/* Explanation accordion */}
            {diagnosis.explanation && (
              <Accordion type="single" collapsible>
                <AccordionItem value="explanation" className="border-0">
                  <AccordionTrigger className="text-sm font-medium hover:no-underline py-2">
                    Почему этот диагноз?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {diagnosis.explanation}
                    </p>
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
