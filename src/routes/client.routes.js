import { Router } from 'express'
import { renderApiKeys } from '../controllers/apiKey.controller.js'
import { renderDashboard } from '../controllers/dashboard.controller.js'
import { getInventory } from '../controllers/inventory.controller.js'
import authRouter from './authRoutes.js'

const clientRouter = Router()

clientRouter.use('/', authRouter)

// ─── Dashboard Routes ──────────────────────────────────────────────────────────────────
clientRouter.get('/', (req, res) => {
	res.redirect('/dashboard')
})

clientRouter.get('/dashboard', renderDashboard)

// ─── Api Key Routes ──────────────────────────────────────────────────────────────────
clientRouter.get('/apikeys', renderApiKeys)

// ─── Inventory Routes ──────────────────────────────────────────────────────────────────
clientRouter.get('/inventory', getInventory)

export default clientRouter
