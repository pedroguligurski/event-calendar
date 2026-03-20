import { Router } from 'express'
import { createAdmin, loginAdmin, sendMagicLink, verifyMagicLink } from './auth.controller.js'
import { requireAdminSetupKey } from '../../middlewares/auth.js'

const authRouter = Router()

authRouter.post('/admin/register', requireAdminSetupKey, createAdmin)
authRouter.post('/admin/login', loginAdmin)
authRouter.post('/magic-link', sendMagicLink)
authRouter.get('/verify', verifyMagicLink)

export default authRouter
