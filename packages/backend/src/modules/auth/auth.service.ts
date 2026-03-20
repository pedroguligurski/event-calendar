import jwt from 'jsonwebtoken'
import type { SignOptions } from 'jsonwebtoken'
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import type {
  AdminAuthResponse,
  AdminLoginDTO,
  CreateAdminDTO,
  SendMagicLinkDTO,
  SendMagicLinkResponse,
  VerifyMagicLinkResponse,
} from '@events/shared'
import { env } from '../../env.js'
import { AppError } from '../../middlewares/app-error.js'
import { usersRepository } from '../users/users.repository.js'
import { adminsRepository } from '../admins/admins.repository.js'
import { mailService } from '../../services/mail.service.js'

const { sign, verify } = jwt

interface MagicLinkPayload {
  type?: string
  email?: string
  sub?: string
}

const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const asJwtExpiresIn = (value: string): SignOptions['expiresIn'] => {
  return value as SignOptions['expiresIn']
}

const hashPassword = (password: string): string => {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

const verifyPassword = (password: string, storedHash: string): boolean => {
  const [salt, hash] = storedHash.split(':')

  if (!salt || !hash) {
    return false
  }

  const hashedBuffer = Buffer.from(hash, 'hex')
  const candidateBuffer = scryptSync(password, salt, hashedBuffer.length)

  return timingSafeEqual(hashedBuffer, candidateBuffer)
}

export const authService = {
  async createAdmin(payload: CreateAdminDTO): Promise<AdminAuthResponse> {
    const name = payload.name?.trim()
    const email = payload.email?.trim().toLowerCase()
    const password = payload.password?.trim()

    if (!name) {
      throw new AppError('Nome do admin e obrigatorio.', 400)
    }

    if (!email || !isValidEmail(email)) {
      throw new AppError('Email invalido.', 400)
    }

    if (!password || password.length < 8) {
      throw new AppError('Senha deve ter ao menos 8 caracteres.', 400)
    }

    const existingAdmin = await adminsRepository.findByEmail(email)
    if (existingAdmin) {
      throw new AppError('Ja existe um admin com este e-mail.', 409)
    }

    const createdAdmin = await adminsRepository.create({
      name,
      email,
      passwordHash: hashPassword(password),
    })

    const token = sign({ type: 'admin-access', adminId: createdAdmin.id, email: createdAdmin.email }, env.jwtSecret, {
      subject: String(createdAdmin.id),
      expiresIn: asJwtExpiresIn(env.jwtExpiresIn),
    })

    return {
      token,
      admin: {
        id: createdAdmin.id,
        name: createdAdmin.name,
        email: createdAdmin.email,
      },
    }
  },

  async loginAdmin(payload: AdminLoginDTO): Promise<AdminAuthResponse> {
    const email = payload.email?.trim().toLowerCase()
    const password = payload.password?.trim()

    if (!email || !isValidEmail(email)) {
      throw new AppError('Email invalido.', 400)
    }

    if (!password) {
      throw new AppError('Senha e obrigatoria.', 400)
    }

    const admin = await adminsRepository.findByEmail(email)
    if (!admin || !verifyPassword(password, admin.passwordHash)) {
      throw new AppError('Credenciais de admin invalidas.', 401)
    }

    const token = sign({ type: 'admin-access', adminId: admin.id, email: admin.email }, env.jwtSecret, {
      subject: String(admin.id),
      expiresIn: asJwtExpiresIn(env.jwtExpiresIn),
    })

    return {
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    }
  },

  async sendMagicLink(payload: SendMagicLinkDTO): Promise<SendMagicLinkResponse> {
    const email = payload.email?.trim().toLowerCase()
    if (!email || !isValidEmail(email)) {
      throw new AppError('Email invalido.', 400)
    }

    const user = await usersRepository.findByEmail(email)
    if (!user) {
      throw new AppError('Usuario nao encontrado. Realize o cadastro primeiro.', 404)
    }

    const token = sign({ type: 'magic-link', email: user.email }, env.magicLinkSecret, {
      subject: String(user.id),
      expiresIn: asJwtExpiresIn(env.magicLinkExpiresIn),
    })

    const magicLink = `${env.frontendUrl}/auth/verify?token=${encodeURIComponent(token)}`
    if (mailService.isConfigured()) {
      await mailService.sendMagicLinkEmail(user.email, magicLink)

      return {
        message: 'Magic link enviado para o e-mail informado.',
      }
    }

    if (env.nodeEnv === 'production') {
      throw new AppError('Servico de e-mail nao configurado no servidor.', 500)
    }

    return {
      message: 'SMTP nao configurado. Magic link retornado apenas em desenvolvimento.',
      magicLink,
    }
  },

  async verifyMagicLink(token: string): Promise<VerifyMagicLinkResponse> {
    if (!token?.trim()) {
      throw new AppError('Token e obrigatorio.', 400)
    }

    let decoded: MagicLinkPayload

    try {
      const verified = verify(token, env.magicLinkSecret)
      if (typeof verified === 'string') {
        throw new AppError('Token de magic link invalido.', 401)
      }

      decoded = verified as MagicLinkPayload
    } catch {
      throw new AppError('Token de magic link invalido ou expirado.', 401)
    }

    if (decoded.type !== 'magic-link') {
      throw new AppError('Token de magic link invalido.', 401)
    }

    const tokenUserId = decoded.sub ? Number(decoded.sub) : NaN
    const user = Number.isInteger(tokenUserId)
      ? await usersRepository.findById(tokenUserId)
      : decoded.email
        ? await usersRepository.findByEmail(decoded.email)
        : null

    if (!user) {
      throw new AppError('Usuario nao encontrado.', 404)
    }

    const accessToken = sign({ type: 'access', userId: user.id, email: user.email }, env.jwtSecret, {
      subject: String(user.id),
      expiresIn: asJwtExpiresIn(env.jwtExpiresIn),
    })

    return {
      token: accessToken,
      user: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        displayName: user.displayName,
        email: user.email,
      },
    }
  },
}
