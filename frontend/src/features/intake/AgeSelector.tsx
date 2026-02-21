import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Calendar, ChevronDown } from 'lucide-react'

interface AgeSelectorProps {
  value?: number | null
  onChange: (value: number | null) => void
}

export function AgeSelector({ value, onChange }: AgeSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(!!value)
  const currentValue = value || 35

  const handleSliderChange = (values: number[]) => {
    onChange(values[0])
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10)
    if (!isNaN(val) && val >= 0 && val <= 120) {
      onChange(val)
    } else if (e.target.value === '') {
      onChange(null)
    }
  }

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="ghost"
        className="w-full justify-between p-0 h-auto font-medium hover:bg-transparent"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Label className="text-sm font-medium flex items-center gap-2 cursor-pointer">
          <Calendar className="h-4 w-4" />
          Возраст (опционально)
        </Label>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </Button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  min="0"
                  max="120"
                  value={value || ''}
                  onChange={handleInputChange}
                  placeholder="35"
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">лет</span>
              </div>
              
              <Slider
                value={[currentValue]}
                onValueChange={handleSliderChange}
                min={0}
                max={120}
                step={1}
                className="w-full"
                aria-label="Возраст"
              />
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>120</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
