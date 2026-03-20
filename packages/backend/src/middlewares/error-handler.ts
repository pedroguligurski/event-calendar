import type { ErrorRequestHandler } from 'express'
import { Prisma } from '@prisma/client'
import { AppError } from './app-error.js'

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ message: error.message })
    return
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      res.status(409).json({ message: 'Registro duplicado para campo unico.' })
      return
    }
  }

  console.error(error)
  res.status(500).json({ message: 'Erro interno do servidor.' })
}
