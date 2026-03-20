import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { config as dotenvConfig } from 'dotenv'

const currentDir = dirname(fileURLToPath(import.meta.url))
const dotenvCandidates = [
  resolve(currentDir, '../.env'),
  resolve(currentDir, '../../../.env'),
]

for (const candidate of dotenvCandidates) {
  if (existsSync(candidate)) {
    dotenvConfig({ path: candidate })
    break
  }
}

const requireEnv = (name: string): string => {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

const optionalEnv = (name: string, defaultValue: string): string => {
  const value = process.env[name]
  return value && value.trim().length > 0 ? value : defaultValue
}

const optionalNumberEnv = (name: string, defaultValue: number): number => {
  const value = process.env[name]
  if (!value || value.trim().length === 0) {
    return defaultValue
  }

  const parsed = Number(value)
  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid numeric environment variable: ${name}`)
  }

  return parsed
}

export const env = {
  databaseUrl: requireEnv('DATABASE_URL'),
  nodeEnv: optionalEnv('NODE_ENV', 'development'),
  adminSetupKey: optionalEnv('ADMIN_SETUP_KEY', ''),
  frontendUrl: optionalEnv('FRONTEND_URL', 'http://localhost:5173'),
  jwtSecret: requireEnv('JWT_SECRET'),
  jwtExpiresIn: optionalEnv('JWT_EXPIRES_IN', '7d'),
  magicLinkSecret: requireEnv('MAGIC_LINK_SECRET'),
  magicLinkExpiresIn: optionalEnv('MAGIC_LINK_EXPIRES_IN', '15m'),
  mailFrom: optionalEnv('MAIL_FROM', 'no-reply@cwb-connect.local'),
  smtpHost: optionalEnv('SMTP_HOST', ''),
  smtpPort: optionalNumberEnv('SMTP_PORT', 587),
  smtpUser: optionalEnv('SMTP_USER', ''),
  smtpPass: optionalEnv('SMTP_PASS', ''),
  smtpSecure: optionalEnv('SMTP_SECURE', 'false') === 'true',
}
