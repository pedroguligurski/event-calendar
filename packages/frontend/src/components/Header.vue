<script setup lang="ts">
import { useTheme } from 'vuetify'
import { computed } from 'vue'

const theme = useTheme()

const isDark = computed(() => theme.global.current.value.dark)

function toggleTheme() {
  theme.global.name.value = isDark.value ? 'light' : 'dark'
}
</script>

<template>
  <v-app-bar
    :color="isDark ? 'background' : 'surface'"
    density="comfortable"
    elevation="0"
    class="cwb-header"
  >
    <template #prepend>
      <RouterLink to="/" class="logo-link d-flex align-center ml-4 text-decoration-none">
        <span class="logo-dot" />
        <span class="logo-text">
          CWB<span class="logo-underscore">_</span>CONNECT
        </span>
      </RouterLink>
    </template>

    <template #append>
      <nav class="d-flex align-center ga-2 mr-4">
          

        <RouterLink to="/" class="nav-link d-none d-sm-flex">
          Eventos
        </RouterLink>


        <RouterLink to="/login" class="text-decoration-none">
          <v-btn
            variant="outlined"
            density="comfortable"
            class="login-btn"
            rounded="lg"
          >
            Entrar
          </v-btn>
        </RouterLink>
        <v-btn
            :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
            variant="text"
            density="comfortable"
            class="theme-toggle"
            :aria-label="isDark ? 'Ativar tema claro' : 'Ativar tema escuro'"
            @click="toggleTheme"
          />
      </nav>
    </template>
  </v-app-bar>
</template>

<style scoped>
.cwb-header {
  border-bottom: 1px solid rgba(var(--v-theme-outline), 0.5) !important;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  background-color: rgba(var(--v-theme-surface), 0.8) !important;
}

.logo-link {
  gap: 10px;
}

.logo-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: rgb(var(--v-theme-primary));
  animation: pulse 2s ease-in-out infinite;
  flex-shrink: 0;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.4; transform: scale(0.85); }
}

.logo-text {
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: rgb(var(--v-theme-on-surface));
  font-family: inherit;
}

.logo-underscore {
  color: rgb(var(--v-theme-primary));
}

.nav-link {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: rgb(var(--v-theme-medium));
  text-decoration: none;
  transition: color 0.2s;
  padding: 4px 8px;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: rgb(var(--v-theme-primary));
}

.theme-toggle {
  color: rgb(var(--v-theme-medium)) !important;
  transition: color 0.2s, transform 0.3s !important;
}

.theme-toggle:hover {
  color: rgb(var(--v-theme-primary)) !important;
  transform: rotate(20deg);
}

.login-btn {
  font-family: 'JetBrains Mono', monospace !important;
  font-size: 0.78rem !important;
  font-weight: 500 !important;
  letter-spacing: 0.01em !important;
  border-color: rgba(var(--v-theme-primary), 0.35) !important;
  color: rgb(var(--v-theme-primary)) !important;
  background-color: rgba(var(--v-theme-primary), 0.07) !important;
  transition: background-color 0.2s, border-color 0.2s !important;
}

.login-btn:hover {
  background-color: rgba(var(--v-theme-primary), 0.14) !important;
  border-color: rgba(var(--v-theme-primary), 0.6) !important;
}
</style>