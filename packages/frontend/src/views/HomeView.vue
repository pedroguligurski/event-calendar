<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Evento, ListarEventosResponse } from '@eventos/shared'

const eventos = ref<Evento[]>([])

onMounted(async () => {
  const res = await fetch('/api/eventos')
  const json: ListarEventosResponse = await res.json()
  eventos.value = json.data
})
</script>

<template>
  <main>
    <h1>Eventos</h1>
    <ul>
      <li v-for="evento in eventos" :key="evento.id">
        <strong>{{ evento.nome }}</strong> — {{ evento.data }} ({{ evento.local }})
        <span>{{ evento.categoria }}</span>
      </li>
    </ul>
  </main>
</template>