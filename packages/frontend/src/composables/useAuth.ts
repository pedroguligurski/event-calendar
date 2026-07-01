import { ref } from 'vue'
import type { CreateUserDTO, SendMagicLinkDTO } from '@events/shared'

export type AuthStep = 'register' | 'magic-link-sent'

export interface AuthUser {
  id: number
  name: string
  surname: string
  displayName: string | null
  email: string
}

const isDialogOpen = ref(false)
const step = ref<AuthStep>('register')
const registeredEmail = ref('')
const loggedUser = ref<AuthUser | null>(null)
const authToken = ref<string | null>(localStorage.getItem('auth_token'))

if (authToken.value) {
  const stored = localStorage.getItem('auth_user')
  if (stored) {
    try {
      loggedUser.value = JSON.parse(stored)
    } catch {
      loggedUser.value = null
    }
  }
}

export function useAuth() {
  function openLoginDialog() {
    step.value = 'register'
    registeredEmail.value = ''
    isDialogOpen.value = true
  }

  function closeDialog() {
    isDialogOpen.value = false
  }

  function logout() {
    loggedUser.value = null
    authToken.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  async function registerAndSendMagicLink(payload: CreateUserDTO): Promise<void> {
    // Try to create the user; if already exists (409), that's fine — proceed to magic link
    const createRes = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!createRes.ok && createRes.status !== 409) {
      const data = await createRes.json().catch(() => ({}))
      throw new Error(data?.message ?? 'Erro ao criar usuário.')
    }

    // Now send magic link
    await sendMagicLink({ email: payload.email })

    registeredEmail.value = payload.email
    step.value = 'magic-link-sent'
  }

  async function sendMagicLink(payload: SendMagicLinkDTO): Promise<void> {
    const res = await fetch('/api/auth/magic-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data?.message ?? 'Erro ao enviar magic link.')
    }
  }

  async function verifyToken(token: string): Promise<AuthUser> {
    const res = await fetch(`/api/auth/verify?token=${encodeURIComponent(token)}`)

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data?.message ?? 'Token inválido ou expirado.')
    }

    const data = await res.json()
    loggedUser.value = data.user
    authToken.value = data.token
    localStorage.setItem('auth_token', data.token)
    localStorage.setItem('auth_user', JSON.stringify(data.user))
    return data.user
  }

  return {
    isDialogOpen,
    step,
    registeredEmail,
    loggedUser,
    authToken,
    openLoginDialog,
    closeDialog,
    logout,
    registerAndSendMagicLink,
    sendMagicLink,
    verifyToken,
  }
}
