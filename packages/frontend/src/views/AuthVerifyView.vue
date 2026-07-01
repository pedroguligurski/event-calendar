<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const route  = useRoute()
const router = useRouter()
const { verifyToken } = useAuth()

const status = ref<'loading' | 'success' | 'error'>('loading')
const userName = ref('')
const errorMsg = ref('')

onMounted(async () => {
  const token = route.query.token as string | undefined

  if (!token) {
    status.value  = 'error'
    errorMsg.value = 'Nenhum token encontrado na URL.'
    return
  }

  try {
    const user = await verifyToken(token)
    userName.value = user.displayName ?? user.name
    status.value   = 'success'

    // Redirect to home after 2.5 s
    setTimeout(() => router.push('/'), 2500)
  } catch (e: unknown) {
    status.value  = 'error'
    errorMsg.value = e instanceof Error ? e.message : 'Token inválido ou expirado.'
  }
})
</script>

<template>
  <div class="verify-page">
    <!-- Background grid -->
    <div class="verify-grid" />

    <v-container class="verify-container">

      <!-- ── Loading ──────────────────────────────────────────────────────── -->
      <transition name="fade" mode="out-in">
        <div v-if="status === 'loading'" key="loading" class="verify-card">
          <v-progress-circular
            indeterminate
            color="primary"
            size="52"
            width="3"
          />
          <p class="verify-caption mt-5">Validando seu acesso…</p>
        </div>

        <!-- ── Success ────────────────────────────────────────────────────── -->
        <div v-else-if="status === 'success'" key="success" class="verify-card">
          <div class="verify-icon-ring success-ring">
            <v-icon size="36" color="success">mdi-check-circle-outline</v-icon>
          </div>
          <h1 class="verify-title mt-5">Bem-vindo, {{ userName }}!</h1>
          <p class="verify-caption mt-2">
            Autenticação concluída. Redirecionando para a página inicial…
          </p>
          <v-progress-linear
            color="primary"
            indeterminate
            rounded
            class="mt-6"
            style="max-width: 200px;"
          />
        </div>

        <!-- ── Error ──────────────────────────────────────────────────────── -->
        <div v-else key="error" class="verify-card">
          <div class="verify-icon-ring error-ring">
            <v-icon size="36" color="error">mdi-alert-circle-outline</v-icon>
          </div>
          <h1 class="verify-title mt-5">Ops, algo deu errado</h1>
          <p class="verify-caption mt-2">{{ errorMsg }}</p>
          <v-btn
            id="verify-back-btn"
            class="mt-6 back-btn"
            variant="outlined"
            rounded="lg"
            @click="$router.push('/')"
          >
            <v-icon start>mdi-arrow-left</v-icon>
            Voltar ao início
          </v-btn>
        </div>
      </transition>

    </v-container>
  </div>
</template>

<style scoped>
.verify-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background-color: rgb(var(--v-theme-background));
  position: relative;
  overflow: hidden;
}

.verify-grid {
  pointer-events: none;
  position: absolute;
  inset: 0;
  opacity: 0.03;
  background-image:
    linear-gradient(hsl(185 80% 55% / 0.4) 1px, transparent 1px),
    linear-gradient(90deg, hsl(185 80% 55% / 0.4) 1px, transparent 1px);
  background-size: 60px 60px;
}

.verify-container {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
}

.verify-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background-color: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-theme-outline), 0.4);
  border-radius: 24px;
  padding: 56px 48px;
  max-width: 440px;
  width: 100%;
  animation: cardIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes cardIn {
  from { opacity: 0; transform: translateY(24px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.verify-icon-ring {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ring-pulse 2s ease-in-out infinite;
}

.success-ring {
  background: rgba(var(--v-theme-success), 0.1);
  border: 2px solid rgba(var(--v-theme-success), 0.3);
}

.error-ring {
  background: rgba(var(--v-theme-error), 0.1);
  border: 2px solid rgba(var(--v-theme-error), 0.3);
}

@keyframes ring-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(var(--v-theme-primary), 0.15); }
  50%       { box-shadow: 0 0 0 14px rgba(var(--v-theme-primary), 0); }
}

.verify-title {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: rgb(var(--v-theme-on-surface));
}

.verify-caption {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  line-height: 1.7;
  color: rgb(var(--v-theme-medium));
}

.back-btn {
  font-family: 'JetBrains Mono', monospace !important;
  font-size: 0.8rem !important;
  border-color: rgba(var(--v-theme-primary), 0.3) !important;
  color: rgb(var(--v-theme-primary)) !important;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
