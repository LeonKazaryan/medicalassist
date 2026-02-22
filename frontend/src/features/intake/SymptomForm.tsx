import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Stethoscope, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { SexSelector } from './SexSelector'
import { AgeSelector } from './AgeSelector'
import { intakeRequestSchema } from '@/lib/api/schemas'
import type { IntakeRequest } from '@/types/diagnosis'

interface SymptomFormProps {
  onSubmit: (data: IntakeRequest) => void
  isLoading?: boolean
}

export function SymptomForm({ onSubmit, isLoading }: SymptomFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<IntakeRequest>({
    resolver: zodResolver(intakeRequestSchema),
    defaultValues: {
      user_prompt: '',
      age: null,
    },
  })

  const sex = watch('sex')
  const age = watch('age')
  const userPrompt = watch('user_prompt')
  
  const charCount = userPrompt?.length || 0
  const isValid = !errors.user_prompt && charCount >= 10

  return (
    <div className="flex justify-center items-start min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl"
      >
        <Card className="glass border-border/50 shadow-xl">
          <CardHeader className="space-y-1 text-center pb-6">
            <CardTitle className="text-3xl font-semibold tracking-tight">
              Клиническая оценка
            </CardTitle>
            <CardDescription className="text-base">
              Опишите ваши симптомы для начала диагностики
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Symptom textarea */}
              <div className="space-y-3">
                <Label htmlFor="symptoms" className="text-sm font-medium">
                  Симптомы
                  <span className="text-destructive ml-1">*</span>
                </Label>
                <div className="relative">
                  <Stethoscope className="absolute left-3 top-3 h-5 w-5 text-muted-foreground pointer-events-none" />
                  <Textarea
                    id="symptoms"
                    {...register('user_prompt')}
                    placeholder="Где болит? Как долго? Есть температура? Что усиливает симптомы?"
                    className="min-h-[160px] pl-11 resize-none"
                    disabled={isLoading}
                  />
                </div>
                <div className="flex justify-between items-center">
                  {errors.user_prompt && (
                    <p className="text-sm text-destructive">
                      {errors.user_prompt.message}
                    </p>
                  )}
                  <p className={`text-xs ml-auto ${
                    charCount < 10 
                      ? 'text-muted-foreground' 
                      : charCount > 2000 
                      ? 'text-destructive' 
                      : 'text-muted-foreground'
                  }`}>
                    {charCount} / 2000
                  </p>
                </div>
              </div>

              {/* Sex selector */}
              <SexSelector
                value={sex}
                onChange={(value) => setValue('sex', value, { shouldValidate: true })}
                error={errors.sex?.message}
              />

              {/* Age selector */}
              <AgeSelector
                value={age}
                onChange={(value) => setValue('age', value)}
              />

              {/* Submit button */}
              <motion.div
                layout
                transition={{ duration: 0.3 }}
              >
                <Button
                  type="submit"
                  size="lg"
                  className="w-full relative overflow-hidden"
                  disabled={!isValid || isLoading}
                >
                  {isLoading ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2"
                    >
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Анализируем...</span>
                    </motion.div>
                  ) : (
                    <span>Анализировать</span>
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
