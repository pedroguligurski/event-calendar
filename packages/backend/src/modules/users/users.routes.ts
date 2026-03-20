import { Router } from 'express'
import { createUser, getUserById, listUsers } from './users.controller.js'

const usersRouter = Router()

usersRouter.get('/', listUsers)
usersRouter.get('/:id', getUserById)
usersRouter.post('/', createUser)

export default usersRouter
