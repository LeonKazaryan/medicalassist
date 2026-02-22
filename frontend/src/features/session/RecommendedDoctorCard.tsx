import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, ArrowRight, Loader2, Check } from 'lucide-react'
import { getSpecialistFromICD } from '@/lib/config/constants'

interface RecommendedDoctorCardProps {
  icdCode?: string
  diagnosisTitle: string
  onFindDoctor: (specialist: string) => void
}

export function RecommendedDoctorCard({ icdCode, diagnosisTitle, onFindDoctor }: RecommendedDoctorCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const specialist = getSpecialistFromICD(icdCode)

  const handleAction = async () => {
    setIsLoading(true)
    // Fake delay for effect as requested
    await new Promise(resolve => setTimeout(resolve, 800))
    setIsLoading(false)
    setShowConfirmation(true)
    
    // Wait for confirmation to show
    await new Promise(resolve => setTimeout(resolve, 1000))
    onFindDoctor(specialist)
  }

  return (
    <Card className="border-primary/20 bg-primary/[0.03] shadow-lg relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          Рекомендуемый врач
        </CardTitle>
        <CardDescription>
          Подобрано для диагноза "{diagnosisTitle}"
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-background/50 rounded-lg p-4 border border-border/50">
          <div className="text-sm text-muted-foreground mb-1">Специалист:</div>
          <div className="text-2xl font-bold text-primary">{specialist}</div>
        </div>

        <div className="space-y-3">
          <Button 
            size="lg" 
            className="w-full h-14 text-lg font-semibold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
            onClick={handleAction}
            disabled={isLoading || showConfirmation}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Ищем специалистов…
              </>
            ) : showConfirmation ? (
              <>
                <Check className="mr-2 h-5 w-5" />
                Фильтр применён: {specialist}
              </>
            ) : (
              <>
                <MapPin className="mr-2 h-5 w-5" />
                Найти врача на карте
              </>
            )}
          </Button>
          
          <Button variant="ghost" size="sm" className="w-full text-muted-foreground hover:text-primary transition-colors">
            Показать всех специалистов <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>

        <AnimatePresence>
          {showConfirmation && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs text-center text-primary font-medium"
            >
              Перенаправляем в раздел Карта...
            </motion.p>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
