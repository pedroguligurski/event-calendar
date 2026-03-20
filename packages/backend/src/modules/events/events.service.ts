import { EventFormat, EventStatus as PrismaEventStatus, Prisma } from '@prisma/client'
import type {
  CreateEventDTO,
  CreateEventResponse,
  EventDetailResponse,
  EventFormat as SharedEventFormat,
  EventListItemResponse,
  ModerateEventResponse,
  EventStatus,
  ListEventsResponse,
} from '@events/shared'
import { AppError } from '../../middlewares/app-error.js'
import { usersRepository } from '../users/users.repository.js'
import { eventsRepository } from './events.repository.js'

type EventWithRelations = Prisma.EventGetPayload<{
  include: {
    eventToThemes: {
      include: {
        theme: true
      }
    }
    location: true
    speakers: true
  }
}>

const mapEventFormat = (eventFormat: CreateEventDTO['eventFormat']): EventFormat => {
  switch (eventFormat) {
    case 'online':
      return EventFormat.Online
    case 'presential':
      return EventFormat.Presential
    case 'hybrid':
      return EventFormat.Hybrid
    default:
      throw new AppError('eventFormat invalido.', 400)
  }
}

const mapEventStatus = (status: PrismaEventStatus): EventStatus => {
  switch (status) {
    case PrismaEventStatus.Pending:
      return 'pending'
    case PrismaEventStatus.Approved:
      return 'approved'
    case PrismaEventStatus.Rejected:
      return 'rejected'
    default:
      return 'pending'
  }
}

const mapEventFormatToShared = (format: EventFormat): SharedEventFormat => {
  switch (format) {
    case EventFormat.Online:
      return 'online'
    case EventFormat.Presential:
      return 'presential'
    case EventFormat.Hybrid:
      return 'hybrid'
    default:
      return 'online'
  }
}

const mapTicketPrice = (price: Prisma.Decimal | null): number => {
  if (!price) {
    return 0
  }

  return Number(price)
}

const mapEventListItem = (event: EventWithRelations): EventListItemResponse => {
  return {
    id: event.id,
    title: event.title,
    resume: event.resume,
    startDateAndTime: event.startDateAndTime.toISOString(),
    endDateAndTime: event.endDateAndTime.toISOString(),
    eventFormat: mapEventFormatToShared(event.eventFormat),
    ticketPrice: mapTicketPrice(event.ticketPrice),
    status: mapEventStatus(event.status),
    themes: event.eventToThemes.map((item) => ({
      id: item.theme.id,
      name: item.theme.name,
    })),
  }
}

const mapEventDetail = (event: EventWithRelations): EventDetailResponse => {
  return {
    id: event.id,
    title: event.title,
    resume: event.resume,
    description: event.description,
    startDateAndTime: event.startDateAndTime.toISOString(),
    endDateAndTime: event.endDateAndTime.toISOString(),
    eventFormat: mapEventFormatToShared(event.eventFormat),
    transmissionLink: event.transmissionLink,
    ticketPrice: mapTicketPrice(event.ticketPrice),
    ticketPlatform: event.ticketPlatform,
    status: mapEventStatus(event.status),
    userId: event.userId,
    themes: event.eventToThemes.map((item) => ({
      id: item.theme.id,
      name: item.theme.name,
    })),
    location: event.location
      ? {
          localName: event.location.localName,
          zipCode: event.location.zipCode,
          street: event.location.street,
          number: event.location.number,
          neighborhood: event.location.neighborhood,
          complement: event.location.complement,
          city: event.location.city,
          state: event.location.state,
          country: event.location.country,
        }
      : null,
    speakers: event.speakers.map((speaker) => ({
      id: speaker.id,
      name: speaker.name,
      title: speaker.title,
      description: speaker.description,
      image: speaker.image,
      social: speaker.social,
      affiliation: speaker.affiliation,
    })),
  }
}

const mapModerateResponse = (event: { id: number; status: PrismaEventStatus }): ModerateEventResponse => {
  return {
    id: event.id,
    status: mapEventStatus(event.status),
  }
}

const validatePayload = (payload: CreateEventDTO): void => {
  if (!payload.title?.trim()) {
    throw new AppError('Titulo e obrigatorio.', 400)
  }

  if (!Array.isArray(payload.themeIds) || payload.themeIds.length === 0) {
    throw new AppError('themeIds deve conter ao menos um tema.', 400)
  }

  const start = new Date(payload.startDateAndTime)
  const end = new Date(payload.endDateAndTime)

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new AppError('Datas do evento invalidas.', 400)
  }

  if (end <= start) {
    throw new AppError('A data de termino deve ser maior que a de inicio.', 400)
  }

  if (payload.eventFormat === 'online') {
    if (!payload.transmissionLink?.trim()) {
      throw new AppError('transmissionLink e obrigatorio para eventos online.', 400)
    }

    if (payload.location) {
      throw new AppError('Eventos online nao devem ter location.', 400)
    }
  }

  if (payload.eventFormat === 'presential') {
    if (!payload.location) {
      throw new AppError('location e obrigatoria para eventos presenciais.', 400)
    }

    if (payload.transmissionLink?.trim()) {
      throw new AppError('Eventos presenciais nao devem ter transmissionLink.', 400)
    }
  }

  if (payload.eventFormat === 'hybrid') {
    if (!payload.location) {
      throw new AppError('location e obrigatoria para eventos hibridos.', 400)
    }

    if (!payload.transmissionLink?.trim()) {
      throw new AppError('transmissionLink e obrigatorio para eventos hibridos.', 400)
    }
  }

  const price = payload.ticketPrice ?? 0
  if (price > 0 && !payload.ticketPlatform?.trim()) {
    throw new AppError('ticketPlatform e obrigatorio quando ticketPrice > 0.', 400)
  }

  if (price <= 0 && payload.ticketPlatform?.trim()) {
    throw new AppError('ticketPlatform deve ser vazio quando ticketPrice e 0.', 400)
  }
}

export const eventsService = {
  async createEvent(payload: CreateEventDTO, userId: number): Promise<CreateEventResponse> {
    validatePayload(payload)

    const user = await usersRepository.findById(userId)
    if (!user) {
      throw new AppError('Usuario nao encontrado.', 404)
    }

    const uniqueThemeIds = [...new Set(payload.themeIds)]
    const themesCount = await eventsRepository.countThemesByIds(uniqueThemeIds)
    if (themesCount !== uniqueThemeIds.length) {
      throw new AppError('Um ou mais themeIds nao existem.', 400)
    }

    const createdEvent = await eventsRepository.create({
      title: payload.title.trim(),
      resume: payload.resume?.trim() || null,
      description: payload.description?.trim() || null,
      startDateAndTime: new Date(payload.startDateAndTime),
      endDateAndTime: new Date(payload.endDateAndTime),
      eventFormat: mapEventFormat(payload.eventFormat),
      transmissionLink: payload.transmissionLink?.trim() || null,
      ticketPrice: payload.ticketPrice ?? 0,
      ticketPlatform: payload.ticketPlatform?.trim() || null,
      user: {
        connect: {
          id: userId,
        },
      },
      eventToThemes: {
        create: uniqueThemeIds.map((themeId) => ({
          theme: {
            connect: {
              id: themeId,
            },
          },
        })),
      },
      location: payload.location
        ? {
            create: {
              localName: payload.location.localName,
              zipCode: payload.location.zipCode,
              street: payload.location.street,
              number: payload.location.number,
              neighborhood: payload.location.neighborhood,
              complement: payload.location.complement,
              city: payload.location.city,
              state: payload.location.state,
              country: payload.location.country,
            },
          }
        : undefined,
      speakers: payload.speakers?.length
        ? {
            create: payload.speakers.map((speaker) => ({
              name: speaker.name,
              title: speaker.title,
              description: speaker.description,
              image: speaker.image,
              social: speaker.social,
              affiliation: speaker.affiliation,
            })),
          }
        : undefined,
    })

    return {
      id: createdEvent.id,
      title: createdEvent.title,
      userId: createdEvent.userId,
      status: mapEventStatus(createdEvent.status),
    }
  },

  async listApprovedEvents(): Promise<ListEventsResponse> {
    const events = await eventsRepository.findApprovedEvents()

    return {
      events: events.map(mapEventListItem),
    }
  },

  async getEventById(id: number, viewerUserId?: number): Promise<EventDetailResponse> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError('Id do evento invalido.', 400)
    }

    const event = await eventsRepository.findEventById(id)

    if (!event) {
      throw new AppError('Evento nao encontrado.', 404)
    }

    const isApproved = event.status === PrismaEventStatus.Approved
    const isOwner = viewerUserId !== undefined && event.userId === viewerUserId

    if (!isApproved && !isOwner) {
      throw new AppError('Evento nao encontrado.', 404)
    }

    return mapEventDetail(event)
  },

  async listEventsByUser(userId: number): Promise<ListEventsResponse> {
    const events = await eventsRepository.findEventsByUserId(userId)

    return {
      events: events.map(mapEventListItem),
    }
  },

  async listPendingEvents(): Promise<ListEventsResponse> {
    const events = await eventsRepository.findPendingEvents()

    return {
      events: events.map(mapEventListItem),
    }
  },

  async approveEventById(id: number): Promise<ModerateEventResponse> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError('Id do evento invalido.', 400)
    }

    const existingEvent = await eventsRepository.findEventById(id)
    if (!existingEvent) {
      throw new AppError('Evento nao encontrado.', 404)
    }

    if (existingEvent.status !== PrismaEventStatus.Pending) {
      throw new AppError('Apenas eventos pendentes podem ser aprovados.', 409)
    }

    await eventsRepository.updateStatusIfPending(id, PrismaEventStatus.Approved)
    const updatedEvent = await eventsRepository.findEventById(id)

    if (!updatedEvent) {
      throw new AppError('Evento nao encontrado.', 404)
    }

    return mapModerateResponse(updatedEvent)
  },

  async rejectEventById(id: number): Promise<ModerateEventResponse> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError('Id do evento invalido.', 400)
    }

    const existingEvent = await eventsRepository.findEventById(id)
    if (!existingEvent) {
      throw new AppError('Evento nao encontrado.', 404)
    }

    if (existingEvent.status !== PrismaEventStatus.Pending) {
      throw new AppError('Apenas eventos pendentes podem ser rejeitados.', 409)
    }

    await eventsRepository.updateStatusIfPending(id, PrismaEventStatus.Rejected)
    const updatedEvent = await eventsRepository.findEventById(id)

    if (!updatedEvent) {
      throw new AppError('Evento nao encontrado.', 404)
    }

    return mapModerateResponse(updatedEvent)
  },
}
