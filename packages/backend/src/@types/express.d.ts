import type { JwtPayload } from 'jsonwebtoken'

declare global {
  namespace Express {
    interface Request {
      authUser?: {
        userId: number
        raw: JwtPayload | string
      }
      authAdmin?: {
        adminId: number
        raw: JwtPayload | string
      }
    }
  }
}

export {}
