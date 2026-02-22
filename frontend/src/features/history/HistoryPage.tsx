import { motion } from 'framer-motion'
import { historyStore } from './historyStore'
import { HistoryEntry } from '@/types/diagnosis'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Calendar, 
  User, 
  ChevronRight, 
  Trash2, 
  Clock, 
  Stethoscope,
  Search,
  ArrowLeft
} from 'lucide-react'
import { useState, useMemo } from 'react'

interface HistoryPageProps {
  onSelect: (entry: HistoryEntry) => void
  onBack: () => void
}

export function HistoryPage({ onSelect, onBack }: HistoryPageProps) {
  const [entries, setEntries] = useState(() => historyStore.getEntries())
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')

  const stats = useMemo(() => {
    if (entries.length === 0) return null
    const avgConfidence = entries.reduce((acc, e) => {
      const top = [...e.diagnoses].sort((a, b) => b.confidence - a.confidence)[0]
      return acc + (top?.confidence || 0)
    }, 0) / entries.length

    return {
      total: entries.length,
      last: entries[0].timestamp,
      avgConfidence: Math.round(avgConfidence * 100)
    }
  }, [entries])

  const filteredEntries = useMemo(() => {
    return entries.filter(e => {
      const top = [...e.diagnoses].sort((a, b) => b.confidence - a.confidence)[0]
      const matchesSearch = 
        top?.name.toLowerCase().includes(search.toLowerCase()) ||
        e.request.user_prompt.toLowerCase().includes(search.toLowerCase())
      
      const confidence = (top?.confidence || 0) * 100
      let matchesFilter = true
      if (filter === 'high') matchesFilter = confidence >= 80
      if (filter === 'medium') matchesFilter = confidence >= 50 && confidence < 80
      if (filter === 'low') matchesFilter = confidence < 50

      return matchesSearch && matchesFilter
    })
  }, [entries, search, filter])

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    historyStore.deleteEntry(id)
    setEntries(historyStore.getEntries())
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-4xl mx-auto space-y-8 pb-12"
    >
      {/* Header Area */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onBack}
                className="rounded-full hover:bg-white/10 -ml-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">История запросов</h1>
            </div>
            <p className="text-muted-foreground ml-11">Ваши предыдущие клинические оценки</p>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              if (confirm('Очистить всю историю?')) {
                historyStore.clearAll()
                setEntries([])
              }
            }}
            className="text-red-400 border-red-400/20 hover:bg-red-400/10 hover:text-red-300 transition-all font-medium"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Очистить
          </Button>
        </div>

        {/* Stats Summary */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-card border backdrop-blur-sm">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Всего запросов</p>
                  <p className="text-xl font-bold text-foreground">{stats.total}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border backdrop-blur-sm">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                  <Stethoscope className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Средняя уверенность</p>
                  <p className="text-xl font-bold text-foreground">{stats.avgConfidence}%</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border backdrop-blur-sm">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Последний</p>
                  <p className="text-sm font-bold text-foreground">
                    {new Date(stats.last).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Поиск по диагнозу или симптомам..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-background border rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-foreground"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'high', 'medium', 'low'] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setFilter(f)}
                className="capitalize text-xs rounded-lg"
              >
                {f === 'all' ? 'Все' : f === 'high' ? 'Высокая' : f === 'medium' ? 'Умеренная' : 'Низкая'}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filteredEntries.length > 0 ? (
          filteredEntries.map((entry, index) => (
            <HistoryCard 
              key={entry.id} 
              entry={entry} 
              index={index} 
              onSelect={() => onSelect(entry)}
              onDelete={(e) => handleDelete(entry.id, e)}
            />
          ))
        ) : (
          <div className="text-center py-20 px-6 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
            <div className="inline-flex p-4 rounded-full bg-white/5 mb-4">
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">История пуста</h3>
            <p className="text-muted-foreground max-w-xs mx-auto mb-6">
              Сделайте первый запрос — и результаты появятся здесь
            </p>
            <Button onClick={onBack} size="lg" className="rounded-full px-8">
              Начать диагностику
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function HistoryCard({ entry, index, onSelect, onDelete }: { 
  entry: HistoryEntry, 
  index: number, 
  onSelect: () => void,
  onDelete: (e: React.MouseEvent) => void 
}) {
  const topDiagnosis = useMemo(() => {
    return [...entry.diagnoses].sort((a, b) => b.confidence - a.confidence)[0]
  }, [entry])

  const confidence = Math.round((topDiagnosis?.confidence || 0) * 100)
  const dateStr = new Date(entry.timestamp).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })

  // Border color based on confidence
  const statusColor = confidence >= 80 ? 'bg-primary' : confidence >= 50 ? 'bg-blue-400' : 'bg-slate-500'

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      onClick={onSelect}
      className="group relative cursor-pointer"
    >
      <Card className="overflow-hidden bg-card border hover:bg-accent/5 hover:border-primary/30 transition-all duration-300 backdrop-blur-md rounded-2xl shadow-sm">
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${statusColor}`} />
        <CardContent className="p-5 flex items-center justify-between gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{dateStr}</span>
              {topDiagnosis?.icd10_code && topDiagnosis.icd10_code !== 'Unknown' && (
                <Badge variant="secondary" className="h-5 text-[10px] bg-muted text-muted-foreground border">
                  {topDiagnosis.icd10_code}
                </Badge>
              )}
            </div>
            
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                {topDiagnosis?.name || 'Без названия'}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-1 italic">
                "{entry.request.user_prompt}"
              </p>
            </div>

            <div className="flex items-center gap-6 pt-1">
              {(entry.request.sex || entry.request.age) && (
                <div className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {[
                      entry.request.sex === 'male' ? 'Мужчина' : entry.request.sex === 'female' ? 'Женщина' : null,
                      entry.request.age ? `${entry.request.age} лет` : null
                    ].filter(Boolean).join(', ')}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Stethoscope className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Рекомендован: {entry.summarySpecialist}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3 min-w-[120px]">
            <div className="w-full space-y-1.5">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Уверенность</span>
                <span className="text-sm font-bold text-foreground">{confidence}%</span>
              </div>
              <Progress value={confidence} className={`h-1 bg-muted`} />
            </div>
            <div className="flex items-center gap-2">
               <Button 
                variant="ghost" 
                size="icon" 
                onClick={onDelete}
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                className="h-8 group-hover:bg-primary group-hover:text-white transition-all rounded-lg"
              >
                Открыть
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
