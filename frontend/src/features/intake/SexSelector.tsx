import { Label } from '@/components/ui/label'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { Sex } from '@/types/diagnosis'
import { SEX_LABELS } from '@/lib/config/constants'
import { User } from 'lucide-react'

interface SexSelectorProps {
  value?: Sex
  onChange: (value: Sex) => void
  error?: string
}

export function SexSelector({ value, onChange, error }: SexSelectorProps) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium flex items-center gap-2">
        <User className="h-4 w-4" />
        Пол
        <span className="text-destructive">*</span>
      </Label>
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(val) => val && onChange(val as Sex)}
        className="justify-start gap-2"
      >
        <ToggleGroupItem
          value="male"
          className="flex-1 border data-[state=on]:border-primary data-[state=on]:bg-primary/5"
          aria-label="Мужской пол"
        >
          {SEX_LABELS.male}
        </ToggleGroupItem>
        <ToggleGroupItem
          value="female"
          className="flex-1 border data-[state=on]:border-primary data-[state=on]:bg-primary/5"
          aria-label="Женский пол"
        >
          {SEX_LABELS.female}
        </ToggleGroupItem>
      </ToggleGroup>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}
