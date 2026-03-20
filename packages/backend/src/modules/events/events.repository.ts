import type { Prisma, Event, EventStatus } from '@prisma/client'
import { prisma } from '../../lib/prisma.js'

const eventWithRelationsSelect = {
  eventToThemes: {
    include: {
      theme: true,
    },
  },
  location: true,
  speakers: true,
} satisfies Prisma.EventInclude

export const eventsRepository = {
  async create(data: Prisma.EventCreateInput): Promise<Event> {
    return prisma.event.create({ data })
  },

  async countThemesByIds(themeIds: number[]): Promise<number> {
    return prisma.theme.count({ where: { id: { in: themeIds } } })
  },

  async findApprovedEvents() {
    return prisma.event.findMany({
      where: { status: 'Approved' },
      include: eventWithRelationsSelect,
      orderBy: { startDateAndTime: 'asc' },
    })
  },

  async findApprovedEventById(id: number) {
    return prisma.event.findFirst({
      where: {
        id,
        status: 'Approved',
      },
      include: eventWithRelationsSelect,
    })
  },

  async findEventById(id: number) {
    return prisma.event.findUnique({
      where: { id },
      include: eventWithRelationsSelect,
    })
  },

  async findEventsByUserId(userId: number) {
    return prisma.event.findMany({
      where: { userId },
      include: eventWithRelationsSelect,
      orderBy: { createdAt: 'desc' },
    })
  },

  async findPendingEvents() {
    return prisma.event.findMany({
      where: { status: 'Pending' },
      include: eventWithRelationsSelect,
      orderBy: { createdAt: 'asc' },
    })
  },

  async updateStatusIfPending(id: number, status: EventStatus): Promise<number> {
    const result = await prisma.event.updateMany({
      where: {
        id,
        status: 'Pending',
      },
      data: {
        status,
      },
    })

    return result.count
  },
}
