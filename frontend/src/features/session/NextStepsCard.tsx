import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, AlertTriangle, ShieldCheck, Stethoscope, ClipboardList } from 'lucide-react'

export function NextStepsCard() {
  const steps = [
    { icon: Stethoscope, text: "Проконсультируйтесь с квалифицированным врачом для подтверждения" },
    { icon: ClipboardList, text: "Подготовьте полный список симптомов и их длительность" },
    { icon: ShieldCheck, text: "Пройдите рекомендованные диагностические исследования" },
  ]

  const warnings = [
    { text: "Данная система не заменяет профессиональную консультацию" },
    { text: "При острых симптомах немедленно обратитесь за помощью" },
    { text: "Не начинайте самолечение без одобрения врача" },
  ]

  return (
    <div className="space-y-4">
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            Дальнейшие шаги
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {steps.map((step, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="flex gap-3 text-sm text-muted-foreground"
              >
                <step.icon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>{step.text}</span>
              </motion.li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-amber-500/5 border-amber-500/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-4 w-4" />
            Важное предупреждение
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {warnings.map((w, i) => (
              <li key={i} className="flex gap-2 text-xs text-amber-700/80 dark:text-amber-400/80">
                <span className="mt-1 w-1 h-1 rounded-full bg-amber-500 shrink-0" />
                <span>{w.text}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
