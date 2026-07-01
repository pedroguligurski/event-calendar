<script setup lang="ts">
import { useTheme } from 'vuetify'
import { computed } from 'vue'
import { useAuth } from '../composables/useAuth'

const theme = useTheme()
const isDark = computed(() => theme.global.current.value.dark)

function toggleTheme() {
  theme.global.name.value = isDark.value ? 'light' : 'dark'
}

const { openLoginDialog, logout, loggedUser } = useAuth()

const userInitials = computed(() => {
  if (!loggedUser.value) return ''
  return (loggedUser.value.name[0] + loggedUser.value.surname[0]).toUpperCase()
})
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

        <!-- Logged OUT: show "Entrar" button -->
        <template v-if="!loggedUser">
          <v-btn
            id="header-login-btn"
            variant="outlined"
            density="comfortable"
            class="login-btn"
            rounded="lg"
            @click="openLoginDialog"
          >
            Entrar
          </v-btn>
        </template>

        <!-- Logged IN: show avatar + dropdown -->
        <template v-else>
          <v-menu offset="8" min-width="180">
            <template #activator="{ props }">
              <v-btn
                id="header-user-menu-btn"
                v-bind="props"
                variant="text"
                density="comfortable"
                class="user-avatar-btn"
                rounded="lg"
              >
                <v-avatar size="28" class="user-avatar mr-2" color="primary">
                  <span class="avatar-initials">{{ userInitials }}</span>
                </v-avatar>
                <span class="user-name d-none d-sm-inline">{{ loggedUser.displayName ?? loggedUser.name }}</span>
                <v-icon size="16" class="ml-1">mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list density="compact" rounded="lg" class="user-menu">
              <v-list-item disabled>
                <template #prepend>
                  <v-icon size="16">mdi-email-outline</v-icon>
                </template>
                <v-list-item-title class="user-menu-email">{{ loggedUser.email }}</v-list-item-title>
              </v-list-item>
              <v-divider class="my-1" />
              <v-list-item
                id="header-logout-btn"
                @click="logout"
              >
                <template #prepend>
                  <v-icon size="16" color="error">mdi-logout</v-icon>
                </template>
                <v-list-item-title class="text-error">Sair</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>

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

.user-avatar-btn {
  font-family: 'JetBrains Mono', monospace !important;
  font-size: 0.78rem !important;
  color: rgb(var(--v-theme-on-surface)) !important;
  padding: 0 8px !important;
  transition: background-color 0.2s !important;
}

.user-avatar-btn:hover {
  background-color: rgba(var(--v-theme-primary), 0.08) !important;
}

.user-avatar {
  font-size: 0.62rem !important;
}

.avatar-initials {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.62rem;
  font-weight: 700;
  color: rgb(var(--v-theme-on-primary));
  letter-spacing: 0.03em;
}

.user-name {
  font-weight: 500;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-menu {
  border: 1px solid rgba(var(--v-theme-outline), 0.4) !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
}

.user-menu-email {
  font-family: 'JetBrains Mono', monospace !important;
  font-size: 0.7rem !important;
  color: rgb(var(--v-theme-medium)) !important;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>