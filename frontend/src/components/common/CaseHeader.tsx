import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { User, Calendar, Edit3 } from 'lucide-react'
import type { Sex } from '@/types/diagnosis'
import { SEX_LABELS } from '@/lib/config/constants'

interface CaseHeaderProps {
  sex: Sex
  age?: number | null
  onEdit: () => void
}

export function CaseHeader({ sex, age, onEdit }: CaseHeaderProps) {
  return (
    <div className="sticky top-16 z-30 bg-background/80 backdrop-blur-sm border-b py-4 -mx-4 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="gap-1.5">
            <User className="h-3 w-3" />
            {SEX_LABELS[sex]}
          </Badge>
          {age && (
            <Badge variant="outline" className="gap-1.5">
              <Calendar className="h-3 w-3" />
              {age} лет
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="gap-2"
        >
          <Edit3 className="h-4 w-4" />
          Изменить
        </Button>
      </div>
    </div>
  )
}
