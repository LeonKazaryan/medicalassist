import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'

export function AssessmentPanel() {
  return (
    <div className="space-y-4 lg:sticky lg:top-24">
      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Сводка оценки</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            На основе предоставленных симптомов система проанализировала возможные диагнозы
            с использованием клинических протоколов Казахстана. Результаты отсортированы по
            уровню вероятности.
          </p>
          
          <Separator />
          
          {/* Recommended next steps */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <h4 className="font-medium">Рекомендуемые следующие шаги</h4>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Проконсультируйтесь с квалифицированным врачом для подтверждения диагноза</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Предоставьте врачу полный список симптомов и их длительность</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Пройдите рекомендованные диагностические исследования</span>
              </li>
            </ul>
          </div>
          
          <Separator />
          
          {/* Red flags */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <h4 className="font-medium">Важно учесть</h4>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-amber-500 mt-0.5">•</span>
                <span>Данная система не заменяет профессиональную медицинскую консультацию</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-500 mt-0.5">•</span>
                <span>При острых или тяжелых симптомах немедленно обратитесь к врачу</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-500 mt-0.5">•</span>
                <span>Не начинайте лечение без консультации специалиста</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
