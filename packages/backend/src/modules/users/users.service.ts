import type { CreateUserDTO, CreateUserResponse, ListUsersResponse, UserResponse } from '@events/shared'
import { AppError } from '../../middlewares/app-error.js'
import { usersRepository } from './users.repository.js'

const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const usersService = {
  async createUser(payload: CreateUserDTO): Promise<CreateUserResponse> {
    if (!payload.name?.trim()) {
      throw new AppError('Nome e obrigatorio.', 400)
    }

    if (!payload.surname?.trim()) {
      throw new AppError('Sobrenome e obrigatorio.', 400)
    }

    if (!payload.email?.trim() || !isValidEmail(payload.email)) {
      throw new AppError('Email invalido.', 400)
    }

    let parsedDate: Date | undefined
    if (payload.dateOfBirth) {
      parsedDate = new Date(payload.dateOfBirth)
      if (Number.isNaN(parsedDate.getTime())) {
        throw new AppError('dateOfBirth deve ser uma data valida.', 400)
      }
    }

    const createdUser = await usersRepository.create({
      name: payload.name.trim(),
      surname: payload.surname.trim(),
      displayName: payload.displayName?.trim() || null,
      email: payload.email.trim().toLowerCase(),
      dateOfBirth: parsedDate,
    })

    return {
      id: createdUser.id,
      name: createdUser.name,
      surname: createdUser.surname,
      displayName: createdUser.displayName,
      email: createdUser.email,
      dateOfBirth: createdUser.dateOfBirth ? createdUser.dateOfBirth.toISOString().slice(0, 10) : null,
    }
  },

  async listUsers(): Promise<ListUsersResponse> {
    const users = await usersRepository.findAll()

    return {
      users: users.map((user) => ({
        id: user.id,
        name: user.name,
        surname: user.surname,
        displayName: user.displayName,
        email: user.email,
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString().slice(0, 10) : null,
      })),
    }
  },

  async getUserById(id: number): Promise<UserResponse> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError('Id do usuario invalido.', 400)
    }

    const user = await usersRepository.findById(id)

    if (!user) {
      throw new AppError('Usuario nao encontrado.', 404)
    }

    return {
      id: user.id,
      name: user.name,
      surname: user.surname,
      displayName: user.displayName,
      email: user.email,
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString().slice(0, 10) : null,
    }
  },
}
