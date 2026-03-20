import type { Request, Response, NextFunction } from 'express'
import type {
  CreateEventDTO,
  CreateEventResponse,
  EventDetailResponse,
  ListEventsResponse,
  ModerateEventResponse,
} from '@events/shared'
import { eventsService } from './events.service.js'
import { AppError } from '../../middlewares/app-error.js'

export const createEvent = async (
  req: Request<object, CreateEventResponse, CreateEventDTO>,
  res: Response<CreateEventResponse>,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.authUser) {
      throw new AppError('Usuario não autenticado.', 401)
    }

    const event = await eventsService.createEvent(req.body, req.authUser.userId)
    res.status(201).json(event)
  } catch (error) {
    next(error)
  }
}

export const listEvents = async (
  _req: Request,
  res: Response<ListEventsResponse>,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await eventsService.listApprovedEvents()
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

export const getEventById = async (
  req: Request<{ id: string }, EventDetailResponse>,
  res: Response<EventDetailResponse>,
  next: NextFunction,
): Promise<void> => {
  try {
    const eventId = Number(req.params.id)
    const event = await eventsService.getEventById(eventId, req.authUser?.userId)
    res.status(200).json(event)
  } catch (error) {
    next(error)
  }
}

export const listMyEvents = async (
  req: Request<object, ListEventsResponse>,
  res: Response<ListEventsResponse>,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.authUser) {
      throw new AppError('Usuario não autenticado.', 401)
    }

    const result = await eventsService.listEventsByUser(req.authUser.userId)
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

export const listPendingEvents = async (
  _req: Request<object, ListEventsResponse>,
  res: Response<ListEventsResponse>,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await eventsService.listPendingEvents()
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

export const approveEvent = async (
  req: Request<{ id: string }, ModerateEventResponse>,
  res: Response<ModerateEventResponse>,
  next: NextFunction,
): Promise<void> => {
  try {
    const eventId = Number(req.params.id)
    const result = await eventsService.approveEventById(eventId)
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

export const rejectEvent = async (
  req: Request<{ id: string }, ModerateEventResponse>,
  res: Response<ModerateEventResponse>,
  next: NextFunction,
): Promise<void> => {
  try {
    const eventId = Number(req.params.id)
    const result = await eventsService.rejectEventById(eventId)
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}
