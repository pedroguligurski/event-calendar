import type { NextFunction, Request, Response } from 'express'
import type {
  AdminAuthResponse,
  AdminLoginDTO,
  CreateAdminDTO,
  SendMagicLinkDTO,
  SendMagicLinkResponse,
  VerifyMagicLinkQueryDTO,
  VerifyMagicLinkResponse,
} from '@events/shared'
import { authService } from './auth.service.js'

export const createAdmin = async (
  req: Request<object, AdminAuthResponse, CreateAdminDTO>,
  res: Response<AdminAuthResponse>,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await authService.createAdmin(req.body)
    res.status(201).json(response)
  } catch (error) {
    next(error)
  }
}

export const loginAdmin = async (
  req: Request<object, AdminAuthResponse, AdminLoginDTO>,
  res: Response<AdminAuthResponse>,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await authService.loginAdmin(req.body)
    res.status(200).json(response)
  } catch (error) {
    next(error)
  }
}

export const sendMagicLink = async (
  req: Request<object, SendMagicLinkResponse, SendMagicLinkDTO>,
  res: Response<SendMagicLinkResponse>,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await authService.sendMagicLink(req.body)
    res.status(200).json(response)
  } catch (error) {
    next(error)
  }
}

export const verifyMagicLink = async (
  req: Request<object, VerifyMagicLinkResponse, object, VerifyMagicLinkQueryDTO>,
  res: Response<VerifyMagicLinkResponse>,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await authService.verifyMagicLink(req.query.token)
    res.status(200).json(response)
  } catch (error) {
    next(error)
  }
}
