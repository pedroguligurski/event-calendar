<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  /** The currently displayed month/year (any Date in that month) */
  modelValue: Date
  /** Set of date strings (YYYY-MM-DD) that have events */
  eventDates?: string[]
  /** The selected date, if any */
  selected?: Date | null
}

const props = withDefaults(defineProps<Props>(), {
  eventDates: () => [],
  selected: null,
})

const emit = defineEmits<{
  (e: 'update:modelValue', val: Date): void
  (e: 'selectDate', val: Date | null): void
}>()

// ── Calendar grid ────────────────────────────────────────────
const WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const MONTHS_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

const year  = computed(() => props.modelValue.getFullYear())
const month = computed(() => props.modelValue.getMonth())
const title = computed(() => `${MONTHS_PT[month.value]} ${year.value}`)

const cells = computed(() => {
  const firstDay = new Date(year.value, month.value, 1).getDay()
  const daysInMonth = new Date(year.value, month.value + 1, 0).getDate()
  const result: Array<{ day: number | null; date: Date | null }> = []

  for (let i = 0; i < firstDay; i++) result.push({ day: null, date: null })
  for (let d = 1; d <= daysInMonth; d++) {
    result.push({ day: d, date: new Date(year.value, month.value, d) })
  }
  // Pad to complete the last row
  while (result.length % 7 !== 0) result.push({ day: null, date: null })
  return result
})

function toKey(d: Date) {
  return d.toISOString().slice(0, 10)
}

function hasEvent(date: Date | null) {
  if (!date) return false
  return props.eventDates.includes(toKey(date))
}

function isSelected(date: Date | null) {
  if (!date || !props.selected) return false
  return toKey(date) === toKey(props.selected)
}

function isToday(date: Date | null) {
  if (!date) return false
  return toKey(date) === toKey(new Date())
}

function prevMonth() {
  const d = new Date(year.value, month.value - 1, 1)
  emit('update:modelValue', d)
}

function nextMonth() {
  const d = new Date(year.value, month.value + 1, 1)
  emit('update:modelValue', d)
}

function clickDay(date: Date | null) {
  if (!date) return
  if (props.selected && toKey(date) === toKey(props.selected)) {
    emit('selectDate', null)
  } else {
    emit('selectDate', date)
  }
}
</script>

<template>
  <div class="mini-cal">
    <!-- Header -->
    <div class="cal-header">
      <button class="cal-nav" aria-label="Mês anterior" @click="prevMonth">&lt;</button>
      <span class="cal-title">{{ title }}</span>
      <button class="cal-nav" aria-label="Próximo mês" @click="nextMonth">&gt;</button>
    </div>

    <!-- Weekday labels -->
    <div class="cal-grid">
      <div v-for="wd in WEEKDAYS" :key="wd" class="cal-wd">{{ wd }}</div>

      <!-- Day cells -->
      <button
        v-for="(cell, idx) in cells"
        :key="idx"
        class="cal-day"
        :class="{
          'cal-day--empty':    !cell.date,
          'cal-day--today':    isToday(cell.date),
          'cal-day--selected': isSelected(cell.date),
          'cal-day--has-event': hasEvent(cell.date) && !isSelected(cell.date),
        }"
        :disabled="!cell.date"
        :aria-label="cell.date ? cell.date.toLocaleDateString('pt-BR') : undefined"
        @click="clickDay(cell.date)"
      >
        <span v-if="cell.day">{{ cell.day }}</span>
        <span v-if="hasEvent(cell.date)" class="cal-dot" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.mini-cal {
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-theme-outline), 0.6);
  border-radius: 12px;
  padding: 16px;
  width: 100%;
  max-width: 280px;
  user-select: none;
}

/* Header */
.cal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.cal-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
}

.cal-nav {
  background: none;
  border: none;
  cursor: pointer;
  color: rgb(var(--v-theme-medium));
  font-size: 0.85rem;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.15s, color 0.15s;
  line-height: 1;
}

.cal-nav:hover {
  background: rgba(var(--v-theme-primary), 0.08);
  color: rgb(var(--v-theme-primary));
}

/* Grid */
.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.cal-wd {
  text-align: center;
  font-size: 0.68rem;
  font-weight: 600;
  color: rgb(var(--v-theme-medium));
  padding: 4px 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.cal-day {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  border: none;
  background: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.78rem;
  color: rgb(var(--v-theme-on-surface));
  transition: background 0.15s, color 0.15s;
  gap: 2px;
  padding: 0;
}

.cal-day:disabled {
  cursor: default;
  pointer-events: none;
}

.cal-day--empty {
  visibility: hidden;
}

.cal-day:not(:disabled):not(.cal-day--selected):hover {
  background: rgba(var(--v-theme-primary), 0.08);
  color: rgb(var(--v-theme-primary));
}

.cal-day--today {
  font-weight: 700;
  color: rgb(var(--v-theme-secondary));
}

.cal-day--selected {
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
  font-weight: 700;
}

.cal-dot {
  display: block;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgb(var(--v-theme-secondary));
  flex-shrink: 0;
}

.cal-day--selected .cal-dot {
  background: rgba(var(--v-theme-on-primary), 0.7);
}
</style>
