import { HistoryEntry, Diagnosis, IntakeRequest, ConversationEntry } from '@/types/diagnosis'
import { getSpecialistFromICD } from '@/lib/config/constants'

const HISTORY_STORAGE_KEY = 'medical_diagnostic_history'

export const historyStore = {
    getEntries(): HistoryEntry[] {
        try {
            const stored = localStorage.getItem(HISTORY_STORAGE_KEY)
            return stored ? JSON.parse(stored) : []
        } catch (e) {
            console.error('Failed to parse history:', e)
            return []
        }
    },

    saveEntry(
        request: IntakeRequest,
        diagnoses: Diagnosis[],
        history: ConversationEntry[],
        timestamp?: number
    ): HistoryEntry {
        const entries = this.getEntries()

        // Create new entry
        const topDiagnosis = [...diagnoses].sort((a, b) => b.confidence - a.confidence)[0]
        const entry: HistoryEntry = {
            id: Math.random().toString(36).substring(2, 11),
            timestamp: timestamp || Date.now(),
            request,
            diagnoses,
            history,
            summarySpecialist: getSpecialistFromICD(topDiagnosis?.icd10_code),
        }

        // Prepend to list and keep last 50
        const updatedEntries = [entry, ...entries].slice(0, 50)
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedEntries))

        return entry
    },

    deleteEntry(id: string) {
        const entries = this.getEntries()
        const updatedEntries = entries.filter((e) => e.id !== id)
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedEntries))
    },

    clearAll() {
        localStorage.removeItem(HISTORY_STORAGE_KEY)
    }
}
