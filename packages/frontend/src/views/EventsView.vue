<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MiniCalendar from '../components/MiniCalendar.vue'
import EventCard from '../components/EventCard.vue'
import { useEvents, type FormatFilter } from '../composables/useEvents'

const {
  loading,
  error,
  formatFilter,
  selectedDate,
  groupedByDay,
  eventDates,
  fetchEvents,
} = useEvents()

// Calendar: which month is being shown
const calendarMonth = ref(new Date())

onMounted(fetchEvents)

const FILTERS: Array<{ value: FormatFilter; label: string }> = [
  { value: 'all',        label: 'Todos'      },
  { value: 'presential', label: 'Presencial' },
  { value: 'online',     label: 'Online'     },
  { value: 'hybrid',     label: 'Híbrido'    },
]

const WEEKDAYS_PT = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado']
const MONTHS_PT = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']

function formatGroupDate(date: Date) {
  const wd   = WEEKDAYS_PT[date.getDay()]
  const day  = date.getDate().toString().padStart(2, '0')
  const mo   = MONTHS_PT[date.getMonth()]
  return `${wd}, ${day} de ${mo}`
}
</script>

<template>
  <div class="events-page">
    <v-container class="events-page__container" fluid>
      <div class="events-layout">

        <!-- ── Sidebar: Calendar ──────────────────────── -->
        <aside class="events-sidebar">
          <MiniCalendar
            v-model="calendarMonth"
            :event-dates="eventDates"
            :selected="selectedDate"
            @select-date="selectedDate = $event"
          />
        </aside>

        <!-- ── Main: Filters + Timeline ──────────────── -->
        <main class="events-main">

          <!-- Filter chips -->
          <div class="events-filters" role="group" aria-label="Filtrar por formato">
            <button
              v-for="f in FILTERS"
              :key="f.value"
              class="filter-btn"
              :class="{ 'filter-btn--active': formatFilter === f.value }"
              @click="formatFilter = f.value"
            >
              {{ f.label }}
            </button>
          </div>

          <!-- Loading -->
          <div v-if="loading" class="events-state">
            <v-progress-circular indeterminate color="primary" size="36" />
            <span class="events-state__label">Carregando eventos…</span>
          </div>

          <!-- Error -->
          <div v-else-if="error" class="events-state events-state--error">
            <v-icon icon="mdi-alert-circle-outline" size="32" />
            <span>{{ error }}</span>
            <button class="retry-btn" @click="fetchEvents">Tentar novamente</button>
          </div>

          <!-- Empty -->
          <div v-else-if="groupedByDay.length === 0" class="events-state events-state--empty">
            <v-icon icon="mdi-calendar-blank-outline" size="48" />
            <p class="events-state__label">Nenhum evento encontrado.</p>
            <p v-if="selectedDate" class="events-state__sub">
              <button class="link-btn" @click="selectedDate = null">Limpar filtro de data</button>
            </p>
          </div>

          <!-- Timeline grouped by day -->
          <div v-else class="events-timeline">
            <section
              v-for="group in groupedByDay"
              :key="group.dateKey"
              class="timeline-group"
            >
              <!-- Day heading -->
              <div class="timeline-day-row">
                <span class="timeline-dot" aria-hidden="true" />
                <h2 class="timeline-day-label">
                  {{ formatGroupDate(group.date) }}
                </h2>
              </div>

              <!-- Event cards -->
              <div class="timeline-cards">
                <EventCard
                  v-for="event in group.events"
                  :key="event.id"
                  :event="event"
                />
              </div>
            </section>
          </div>

        </main>
      </div>
    </v-container>
  </div>
</template>

<style scoped>
/* ── Page shell ──────────────────────────────────────── */
.events-page {
  min-height: calc(100vh - 64px);
  background: rgb(var(--v-theme-background));
  padding-bottom: 60px;
}

.events-page__container {
  max-width: 1200px !important;
  padding: 36px 24px;
}

/* ── Two-column layout ──────────────────────────────── */
.events-layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 40px;
  align-items: start;
}

@media (max-width: 768px) {
  .events-layout {
    grid-template-columns: 1fr;
  }

  .events-sidebar {
    display: flex;
    justify-content: center;
  }
}

/* ── Sidebar ────────────────────────────────────────── */
.events-sidebar {
  position: sticky;
  top: 84px;
}

/* ── Filter buttons ─────────────────────────────────── */
.events-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 32px;
  padding: 12px 16px;
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-theme-outline), 0.6);
  border-radius: 12px;
}

.filter-btn {
  padding: 6px 18px;
  border-radius: 8px;
  border: 1px solid rgba(var(--v-theme-outline), 0.8);
  background: transparent;
  color: rgb(var(--v-theme-medium));
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
  letter-spacing: 0.01em;
}

.filter-btn:hover {
  background: rgba(var(--v-theme-primary), 0.06);
  color: rgb(var(--v-theme-on-surface));
  border-color: rgba(var(--v-theme-primary), 0.25);
}

.filter-btn--active {
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
  border-color: rgb(var(--v-theme-primary));
  font-weight: 600;
}

/* ── States (loading / error / empty) ─────────────────── */
.events-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 64px 0;
  color: rgb(var(--v-theme-medium));
  text-align: center;
}

.events-state--error {
  color: rgb(var(--v-theme-error));
}

.events-state__label {
  font-size: 1rem;
  color: rgb(var(--v-theme-medium));
}

.events-state__sub {
  font-size: 0.85rem;
}

.retry-btn,
.link-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: rgb(var(--v-theme-secondary));
  font-size: 0.85rem;
  text-decoration: underline;
  padding: 0;
}

/* ── Timeline ─────────────────────────────────────── */
.events-timeline {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

/* ── Day group ──────────────────────────────────────── */
.timeline-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.timeline-day-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.timeline-dot {
  flex-shrink: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgb(var(--v-theme-primary));
  border: 2px solid rgb(var(--v-theme-background));
  box-shadow: 0 0 0 2px rgb(var(--v-theme-primary));
}

.timeline-day-label {
  font-size: 1.05rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-background));
  letter-spacing: -0.01em;
  margin: 0;
}

/* ── Cards container ──────────────────────────────── */
.timeline-cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-left: 22px;
  border-left: 2px solid rgba(var(--v-theme-outline), 0.5);
}
</style>
