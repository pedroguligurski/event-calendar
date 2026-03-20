import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../env.js'
import { AppError } from './app-error.js'

const { verify } = jwt

interface AuthTokenPayload {
  type?: string
  sub?: string
  userId?: number
  adminId?: number
}

const attachAuthUserFromToken = (req: Request, token: string): void => {
  const decoded = verify(token, env.jwtSecret) as AuthTokenPayload

  if (decoded.type !== 'access') {
    throw new AppError('Token de acesso invalido.', 401)
  }

  const tokenUserId = decoded.userId ?? (decoded.sub ? Number(decoded.sub) : NaN)

  if (!Number.isInteger(tokenUserId) || tokenUserId <= 0) {
    throw new AppError('Token invalido: userId ausente.', 401)
  }

  req.authUser = {
    userId: tokenUserId,
    raw: decoded,
  }
}

export const requireAuth = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next(new AppError('Token de autenticacao ausente.', 401))
    return
  }

  const token = authHeader.slice(7)

  try {
    attachAuthUserFromToken(req, token)

    next()
  } catch (error) {
    if (error instanceof AppError) {
      next(error)
      return
    }

    next(new AppError('Token invalido ou expirado.', 401))
  }
}

export const optionalAuth = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next()
    return
  }

  const token = authHeader.slice(7)

  try {
    attachAuthUserFromToken(req, token)
  } catch {
    // Ignora token inválido para manter a rota pública quando necessário.
  }

  next()
}

export const requireAdmin = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next(new AppError('Token de autenticacao admin ausente.', 401))
    return
  }

  const token = authHeader.slice(7)

  try {
    const decoded = verify(token, env.jwtSecret) as AuthTokenPayload

    if (decoded.type !== 'admin-access') {
      throw new AppError('Token de admin invalido.', 401)
    }

    const tokenAdminId = decoded.adminId ?? (decoded.sub ? Number(decoded.sub) : NaN)

    if (!Number.isInteger(tokenAdminId) || tokenAdminId <= 0) {
      throw new AppError('Token invalido: adminId ausente.', 401)
    }

    req.authAdmin = {
      adminId: tokenAdminId,
      raw: decoded,
    }

    next()
  } catch (error) {
    if (error instanceof AppError) {
      next(error)
      return
    }

    next(new AppError('Token de admin invalido ou expirado.', 401))
  }
}

export const requireAdminSetupKey = (req: Request, _res: Response, next: NextFunction): void => {
  const setupKey = env.adminSetupKey
  if (!setupKey) {
    next(new AppError('ADMIN_SETUP_KEY nao configurada no servidor.', 503))
    return
  }

  const providedKey = req.header('x-admin-setup-key')
  if (!providedKey || providedKey !== setupKey) {
    next(new AppError('Chave de setup admin invalida.', 403))
    return
  }

  next()
}
