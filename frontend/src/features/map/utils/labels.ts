import type { PlaceType } from '@/types/place'

export const PLACE_LABELS: Record<PlaceType, {
    singular: string
    plural: string
    genitivePlural: string
    prepositional: string
}> = {
    pharmacy: {
        singular: 'Аптека',
        plural: 'Аптеки',
        genitivePlural: 'аптек',
        prepositional: 'аптеки',
    },
    clinic: {
        singular: 'Клиника',
        plural: 'Клиники',
        genitivePlural: 'клиник',
        prepositional: 'клиники',
    },
}
