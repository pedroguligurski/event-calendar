import type { Admin, Prisma } from '@prisma/client'
import { prisma } from '../../lib/prisma.js'

export const adminsRepository = {
  async create(data: Prisma.AdminCreateInput): Promise<Admin> {
    return prisma.admin.create({ data })
  },

  async findByEmail(email: string): Promise<Admin | null> {
    return prisma.admin.findUnique({ where: { email } })
  },

  async findById(id: number): Promise<Admin | null> {
    return prisma.admin.findUnique({ where: { id } })
  },
}