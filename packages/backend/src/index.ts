import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import eventsRouter from './modules/events/events.routes.js'
import adminEventsRouter from './modules/events/admin-events.routes.js'
import usersRouter from './modules/users/users.routes.js'
import authRouter from './modules/auth/auth.routes.js'
import { errorHandler } from './middlewares/error-handler.js'
import './env.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Servidor de eventos rodando!' })
})

app.use('/api/events', eventsRouter)
app.use('/api/users', usersRouter)
app.use('/api/auth', authRouter)
app.use('/admin/events', adminEventsRouter)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`)
})