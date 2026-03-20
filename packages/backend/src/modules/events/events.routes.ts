import { Router } from 'express'
import { createEvent, getEventById, listEvents, listMyEvents } from './events.controller.js'
import { optionalAuth, requireAuth } from '../../middlewares/auth.js'

const eventsRouter = Router()

eventsRouter.get('/', listEvents)
eventsRouter.get('/mine', requireAuth, listMyEvents)
eventsRouter.get('/:id', optionalAuth, getEventById)
eventsRouter.post('/', requireAuth, createEvent)

export default eventsRouter
