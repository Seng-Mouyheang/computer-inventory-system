import { Router } from 'express'
import { renderDashboard } from '../controllers/dashboardController.js'

const clientRouter = Router()

clientRouter.get('/dashboard', renderDashboard)

export default clientRouter
