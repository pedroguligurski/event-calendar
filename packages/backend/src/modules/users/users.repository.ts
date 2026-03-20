import type { Prisma, User } from '@prisma/client'
import { prisma } from '../../lib/prisma.js'

export const usersRepository = {
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data })
  },

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } })
  },

  async findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } })
  },

  async findAll(): Promise<User[]> {
    return prisma.user.findMany({ orderBy: { createdAt: 'desc' } })
  },
}
