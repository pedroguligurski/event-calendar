<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuth } from '../composables/useAuth'

const {
  isDialogOpen,
  step,
  registeredEmail,
  closeDialog,
  registerAndSendMagicLink,
} = useAuth()

// ── Form state ──────────────────────────────────────────────────────────────
const name        = ref('')
const surname     = ref('')
const email       = ref('')
const displayName = ref('')
const dateOfBirth = ref('')

const showOptional = ref(false)
const loading      = ref(false)
const errorMsg     = ref<string | null>(null)

// ── Validation ───────────────────────────────────────────────────────────────
const emailRules = [
  (v: string) => !!v || 'E-mail é obrigatório.',
  (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'E-mail inválido.',
]
const nameRules    = [(v: string) => !!v.trim() || 'Nome é obrigatório.']
const surnameRules = [(v: string) => !!v.trim() || 'Sobrenome é obrigatório.']

const isFormValid = computed(() =>
  name.value.trim() !== '' &&
  surname.value.trim() !== '' &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value),
)

// ── Actions ──────────────────────────────────────────────────────────────────
async function submit() {
  if (!isFormValid.value) return
  loading.value  = true
  errorMsg.value = null

  try {
    await registerAndSendMagicLink({
      name:        name.value.trim(),
      surname:     surname.value.trim(),
      email:       email.value.trim().toLowerCase(),
      displayName: displayName.value.trim() || undefined,
      dateOfBirth: dateOfBirth.value || undefined,
    })
  } catch (e: unknown) {
    errorMsg.value = e instanceof Error ? e.message : 'Erro inesperado.'
  } finally {
    loading.value = false
  }
}

function handleClose() {
  // Reset form when dialog closes
  name.value        = ''
  surname.value     = ''
  email.value       = ''
  displayName.value = ''
  dateOfBirth.value = ''
  showOptional.value = false
  errorMsg.value     = null
  closeDialog()
}
</script>

<template>
  <v-dialog
    v-model="isDialogOpen"
    max-width="480"
    persistent
  >
    <v-card class="login-card" rounded="xl" elevation="0">

      <!-- ── Close button ───────────────────────────────────────────────── -->
      <v-btn
        icon="mdi-close"
        variant="text"
        density="compact"
        class="close-btn"
        aria-label="Fechar"
        @click="handleClose"
      />

      <!-- ══════════════════════════════════════════════════════════════════
           STEP 1 — Cadastro
      ══════════════════════════════════════════════════════════════════ -->
      <template v-if="step === 'register'">

        <!-- Header -->
        <div class="dialog-header">
          <div class="dialog-logo-dot" />
          <h2 class="dialog-title">Entrar na plataforma</h2>
          <p class="dialog-sub">
            Informe seus dados para acessar ou criar sua conta. Você receberá
            um link mágico no e-mail para validar o acesso.
          </p>
        </div>

        <!-- Form -->
        <v-card-text class="dialog-body">
          <v-form @submit.prevent="submit">

            <!-- Name + Surname -->
            <div class="row-2col">
              <v-text-field
                id="auth-name"
                v-model="name"
                label="Nome *"
                :rules="nameRules"
                variant="outlined"
                density="comfortable"
                class="field"
                autocomplete="given-name"
                hide-details="auto"
              />
              <v-text-field
                id="auth-surname"
                v-model="surname"
                label="Sobrenome *"
                :rules="surnameRules"
                variant="outlined"
                density="comfortable"
                class="field"
                autocomplete="family-name"
                hide-details="auto"
              />
            </div>

            <!-- Email -->
            <v-text-field
              id="auth-email"
              v-model="email"
              label="E-mail *"
              type="email"
              :rules="emailRules"
              variant="outlined"
              density="comfortable"
              class="field mt-3"
              autocomplete="email"
              hide-details="auto"
              prepend-inner-icon="mdi-email-outline"
            />

            <!-- Optional fields toggle -->
            <button
              type="button"
              class="optional-toggle"
              @click="showOptional = !showOptional"
            >
              <v-icon size="14" class="mr-1">
                {{ showOptional ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
              </v-icon>
              {{ showOptional ? 'Ocultar campos opcionais' : 'Adicionar informações opcionais' }}
            </button>

            <v-expand-transition>
              <div v-if="showOptional">
                <v-text-field
                  id="auth-display-name"
                  v-model="displayName"
                  label="Nome de exibição"
                  variant="outlined"
                  density="comfortable"
                  class="field mt-3"
                  autocomplete="nickname"
                  hide-details="auto"
                  hint="Como você quer ser chamado(a)?"
                />
                <v-text-field
                  id="auth-dob"
                  v-model="dateOfBirth"
                  label="Data de nascimento"
                  type="date"
                  variant="outlined"
                  density="comfortable"
                  class="field mt-3"
                  hide-details="auto"
                />
              </div>
            </v-expand-transition>

            <!-- Error message -->
            <v-alert
              v-if="errorMsg"
              type="error"
              variant="tonal"
              density="compact"
              rounded="lg"
              class="mt-3"
              :text="errorMsg"
            />

            <!-- Submit -->
            <v-btn
              id="auth-submit-btn"
              type="submit"
              block
              :loading="loading"
              :disabled="!isFormValid || loading"
              class="submit-btn mt-4"
              rounded="lg"
              size="large"
              elevation="0"
            >
              <v-icon start>mdi-send-outline</v-icon>
              Enviar link mágico
            </v-btn>

          </v-form>
        </v-card-text>

        <!-- Footer note -->
        <p class="dialog-footer-note">
          Ao continuar, você concorda com os termos de uso da plataforma.
        </p>

      </template>

      <!-- ══════════════════════════════════════════════════════════════════
           STEP 2 — Magic Link Sent
      ══════════════════════════════════════════════════════════════════ -->
      <template v-else-if="step === 'magic-link-sent'">
        <div class="magic-sent-wrapper">

          <!-- Animated icon -->
          <div class="magic-icon-ring">
            <v-icon size="36" color="primary">mdi-email-fast-outline</v-icon>
          </div>

          <h2 class="dialog-title mt-5">Verifique seu e-mail</h2>

          <p class="dialog-sub mt-2">
            Enviamos um link mágico para
            <strong class="email-highlight">{{ registeredEmail }}</strong>.
            Clique no link para acessar sua conta — ele expira em 15 minutos.
          </p>

          <div class="magic-tips mt-4">
            <div class="tip-item">
              <v-icon size="16" color="medium">mdi-inbox-outline</v-icon>
              <span>Verifique também sua pasta de spam.</span>
            </div>
            <div class="tip-item">
              <v-icon size="16" color="medium">mdi-clock-outline</v-icon>
              <span>O link pode levar até 2 minutos para chegar.</span>
            </div>
          </div>

          <v-btn
            id="auth-close-btn"
            block
            variant="outlined"
            class="close-sent-btn mt-6"
            rounded="lg"
            size="large"
            @click="handleClose"
          >
            Entendido
          </v-btn>

        </div>
      </template>

    </v-card>
  </v-dialog>
</template>

<style scoped>
/* ── Card ─────────────────────────────────────────────────────────────────── */
.login-card {
  background-color: rgb(var(--v-theme-surface)) !important;
  border: 1px solid rgba(var(--v-theme-outline), 0.4);
  position: relative;
  overflow: hidden;
}

/* ── Close button ─────────────────────────────────────────────────────────── */
.close-btn {
  position: absolute;
  top: 14px;
  right: 14px;
  color: rgb(var(--v-theme-medium)) !important;
  z-index: 10;
}

.close-btn:hover {
  color: rgb(var(--v-theme-on-surface)) !important;
}

/* ── Header ───────────────────────────────────────────────────────────────── */
.dialog-header {
  padding: 32px 32px 0;
}

.dialog-logo-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: rgb(var(--v-theme-primary));
  animation: pulse 2s ease-in-out infinite;
  margin-bottom: 16px;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.4; transform: scale(0.8); }
}

.dialog-title {
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: rgb(var(--v-theme-on-surface));
  margin-bottom: 8px;
}

.dialog-sub {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.78rem;
  line-height: 1.7;
  color: rgb(var(--v-theme-medium));
}

/* ── Body / Form ──────────────────────────────────────────────────────────── */
.dialog-body {
  padding: 20px 32px !important;
}

.row-2col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.field :deep(.v-field) {
  border-radius: 10px !important;
}

.field :deep(.v-field__outline) {
  --v-field-border-opacity: 0.3;
}

.field :deep(.v-field.v-field--focused .v-field__outline) {
  --v-field-border-opacity: 1;
}

/* ── Optional toggle ─────────────────────────────────────────────────────── */
.optional-toggle {
  display: inline-flex;
  align-items: center;
  margin-top: 10px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  color: rgb(var(--v-theme-primary));
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: opacity 0.2s;
  letter-spacing: 0.01em;
}

.optional-toggle:hover {
  opacity: 0.75;
}

/* ── Submit button ───────────────────────────────────────────────────────── */
.submit-btn {
  font-family: 'JetBrains Mono', monospace !important;
  font-size: 0.82rem !important;
  font-weight: 600 !important;
  letter-spacing: 0.02em !important;
  background-color: rgb(var(--v-theme-primary)) !important;
  color: rgb(var(--v-theme-on-primary)) !important;
  transition: opacity 0.2s, transform 0.15s !important;
}

.submit-btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.submit-btn:disabled {
  opacity: 0.4 !important;
}

/* ── Footer note ─────────────────────────────────────────────────────────── */
.dialog-footer-note {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.68rem;
  color: rgb(var(--v-theme-medium));
  text-align: center;
  padding: 0 32px 24px;
  opacity: 0.7;
}

/* ── Magic Sent State ────────────────────────────────────────────────────── */
.magic-sent-wrapper {
  padding: 40px 32px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.magic-icon-ring {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(var(--v-theme-primary), 0.1);
  border: 2px solid rgba(var(--v-theme-primary), 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ring-pulse 2s ease-in-out infinite;
}

@keyframes ring-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(var(--v-theme-primary), 0.2); }
  50%       { box-shadow: 0 0 0 12px rgba(var(--v-theme-primary), 0); }
}

.email-highlight {
  color: rgb(var(--v-theme-primary));
  font-weight: 600;
  word-break: break-all;
}

.magic-tips {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
  width: 100%;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.74rem;
  color: rgb(var(--v-theme-medium));
  padding: 8px 12px;
  background: rgba(var(--v-theme-surface-variant), 0.5);
  border-radius: 8px;
}

.close-sent-btn {
  font-family: 'JetBrains Mono', monospace !important;
  font-size: 0.82rem !important;
  border-color: rgba(var(--v-theme-primary), 0.3) !important;
  color: rgb(var(--v-theme-primary)) !important;
}
</style>
