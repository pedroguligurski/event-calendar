<script setup lang="ts">
import type { EventListItemResponse } from '@events/shared'

const props = defineProps<{
  event: EventListItemResponse
}>()

const FORMAT_MAP: Record<string, { label: string; color: string }> = {
  presential: { label: 'Presencial', color: '#2FBF71' },
  online:     { label: 'Online',     color: '#4276FF' },
  hybrid:     { label: 'Híbrido',    color: '#F4A261' },
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  })
}

function formatPrice(price: number) {
  if (!price || price <= 0) return 'Gratuito'
  return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const fmt = FORMAT_MAP[props.event.eventFormat] ?? FORMAT_MAP.online
</script>

<template>
  <article class="event-card">
    <!-- Left: time + meta -->
    <div class="event-card__body">
      <div class="event-card__meta">
        <span class="event-card__time">{{ formatTime(event.startDateAndTime) }}</span>

        <span
          class="event-card__format-badge"
          :style="{ '--badge-color': fmt.color }"
        >
          {{ fmt.label }}
        </span>

        <span class="event-card__price">{{ formatPrice(event.ticketPrice) }}</span>
      </div>

      <h3 class="event-card__title">{{ event.title }}</h3>

      <p v-if="event.resume" class="event-card__resume">{{ event.resume }}</p>

      <div v-if="event.themes.length" class="event-card__tags">
        <span
          v-for="theme in event.themes"
          :key="theme.id"
          class="event-card__tag"
        >
          {{ theme.name }}
        </span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.event-card {
  display: flex;
  gap: 20px;
  padding: 20px 24px;
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-theme-outline), 0.6);
  border-radius: 12px;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
  cursor: pointer;
}

.event-card:hover {
  border-color: rgba(var(--v-theme-secondary), 0.45);
  box-shadow: 0 4px 24px rgba(var(--v-theme-secondary), 0.08);
  transform: translateY(-1px);
}

/* ── Body ── */
.event-card__body {
  flex: 1;
  min-width: 0;
}

/* ── Meta row ── */
.event-card__meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
}

.event-card__time {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  font-weight: 700;
  color: rgb(var(--v-theme-on-surface));
  letter-spacing: 0.02em;
}

.event-card__format-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 99px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--badge-color);
  background: color-mix(in srgb, var(--badge-color) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--badge-color) 30%, transparent);
}

.event-card__price {
  font-size: 0.8rem;
  color: rgb(var(--v-theme-medium));
}

/* ── Title ── */
.event-card__title {
  font-size: 1.1rem;
  font-weight: 700;
  color: rgb(var(--v-theme-on-surface));
  margin: 0 0 6px;
  line-height: 1.3;
  letter-spacing: -0.01em;
}

/* ── Resume ── */
.event-card__resume {
  font-size: 0.82rem;
  color: rgb(var(--v-theme-medium));
  line-height: 1.6;
  margin: 0 0 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ── Tags ── */
.event-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.event-card__tag {
  font-size: 0.7rem;
  padding: 2px 10px;
  border-radius: 99px;
  border: 1px solid rgba(var(--v-theme-outline), 0.8);
  color: rgb(var(--v-theme-medium));
  background: rgba(var(--v-theme-outline), 0.12);
  letter-spacing: 0.03em;
  transition: border-color 0.15s, color 0.15s;
}

.event-card:hover .event-card__tag {
  border-color: rgba(var(--v-theme-secondary), 0.35);
  color: rgb(var(--v-theme-on-surface));
}
</style>
