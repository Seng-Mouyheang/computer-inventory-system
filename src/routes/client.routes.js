import { Router } from 'express'
import {
	generateApiKey,
	renderApiKeys,
	revokeApiKeyById,
} from '../controllers/apiKey.controller.js'
import { renderDashboard } from '../controllers/dashboard.controller.js'
import { getInventory } from '../controllers/inventory.controller.js'

const clientRouter = Router()

// ─── Dashboard Routes ──────────────────────────────────────────────────────────────────
clientRouter.get('/', (req, res) => {
	res.redirect('/dashboard')
})

clientRouter.get('/dashboard', renderDashboard)

// ─── Api Key Routes ──────────────────────────────────────────────────────────────────
clientRouter.get('/apikeys', renderApiKeys)
clientRouter.post('/apikeys', generateApiKey)
clientRouter.post('/apikeys/:id/revoke', revokeApiKeyById)

// ─── Inventory Routes ──────────────────────────────────────────────────────────────────
clientRouter.get('/inventory', getInventory)

export default clientRouter
