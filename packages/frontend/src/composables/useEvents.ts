import { ref, computed } from 'vue'
import type { EventListItemResponse, EventFormat } from '@events/shared'

export type FormatFilter = EventFormat | 'all'

const formatLabel: Record<EventFormat, string> = {
  presential: 'Presencial',
  online: 'Online',
  hybrid: 'Híbrido',
}

export function useEvents() {
  const events = ref<EventListItemResponse[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const formatFilter = ref<FormatFilter>('all')
  const selectedDate = ref<Date | null>(null)

  async function fetchEvents() {
    loading.value = true
    error.value = null
    try {
      const res = await fetch('/api/events')
      if (!res.ok) throw new Error('Falha ao carregar eventos')
      const data = await res.json()
      events.value = data.events ?? []
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Erro desconhecido'
    } finally {
      loading.value = false
    }
  }

  const filtered = computed(() => {
    let list = events.value
    if (formatFilter.value !== 'all') {
      list = list.filter(e => e.eventFormat === formatFilter.value)
    }
    if (selectedDate.value) {
      const target = toDateKey(selectedDate.value)
      list = list.filter(e => toDateKey(new Date(e.startDateAndTime)) === target)
    }
    return list
  })

  // Group events by day (YYYY-MM-DD)
  const groupedByDay = computed<Array<{ dateKey: string; date: Date; events: EventListItemResponse[] }>>(() => {
    const map = new Map<string, EventListItemResponse[]>()
    for (const ev of filtered.value) {
      const key = toDateKey(new Date(ev.startDateAndTime))
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(ev)
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, evs]) => ({
        dateKey: key,
        date: new Date(key + 'T00:00:00'),
        events: evs,
      }))
  })

  // All dates with events (for calendar dots)
  const eventDates = computed(() =>
    events.value.map(e => toDateKey(new Date(e.startDateAndTime)))
  )

  function getFormatLabel(format: EventFormat): string {
    return formatLabel[format] ?? format
  }

  return {
    events,
    loading,
    error,
    formatFilter,
    selectedDate,
    filtered,
    groupedByDay,
    eventDates,
    fetchEvents,
    getFormatLabel,
  }
}

function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10)
}
