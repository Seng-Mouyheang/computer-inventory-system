import 'dotenv/config'
import app from './src/config/view.js'
import corsMiddleware from './src/config/cors.js'
import rateLimitMiddleware from './src/config/rateLimit.js'
import auditLogger from './src/config/morgan.js'

app.use(auditLogger)
app.use(corsMiddleware)
app.use(rateLimitMiddleware)

const port = process.env.PORT || 3000

app.listen(port, () => {
	// console.log(`Server running at http://localhost:${port}`)
})
