import express from 'express'
import { renderLogin, handleLogin, handleLogout } from '../controllers/authController.js'

const router = express.Router()

router.get('/login', renderLogin)
router.post('/login', handleLogin)
router.post('/logout', handleLogout)

export default router
