import { Router } from 'express'
import { approveEvent, listPendingEvents, rejectEvent } from './events.controller.js'
import { requireAdmin } from '../../middlewares/auth.js'

const adminEventsRouter = Router()

adminEventsRouter.get('/pending', requireAdmin, listPendingEvents)
adminEventsRouter.patch('/:id/approve', requireAdmin, approveEvent)
adminEventsRouter.patch('/:id/reject', requireAdmin, rejectEvent)

export default adminEventsRouter