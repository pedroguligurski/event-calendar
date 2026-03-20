import type { Request, Response, NextFunction } from 'express'
import type { CreateUserDTO, CreateUserResponse, ListUsersResponse, UserResponse } from '@events/shared'
import { usersService } from './users.service.js'

export const createUser = async (
  req: Request<object, CreateUserResponse, CreateUserDTO>,
  res: Response<CreateUserResponse>,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await usersService.createUser(req.body)
    res.status(201).json(user)
  } catch (error) {
    next(error)
  }
}

export const listUsers = async (
  _req: Request,
  res: Response<ListUsersResponse>,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await usersService.listUsers()
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

export const getUserById = async (
  req: Request<{ id: string }, UserResponse>,
  res: Response<UserResponse>,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = Number(req.params.id)
    const user = await usersService.getUserById(userId)
    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}
