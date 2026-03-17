import express from 'express'
import cors from 'cors'
import type { Evento, ListarEventosResponse } from '@eventos/shared'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Servidor de eventos rodando!' })
})

const eventos: Evento[] = [
  { id: 1, nome: 'Tech Summit RJ', descricao: 'Maior evento de tecnologia do RJ', data: '2026-04-10', local: 'Rio de Janeiro', categoria: 'tecnologia' },
  { id: 2, nome: 'Vue.js Meetup', descricao: 'Encontro da comunidade Vue', data: '2026-05-20', local: 'Online', categoria: 'tecnologia' },
]

app.get('/api/eventos', (_req, res) => {
  const response: ListarEventosResponse = {
    data: eventos,
    total: eventos.length,
  }
  res.json(response)
})

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`)
})