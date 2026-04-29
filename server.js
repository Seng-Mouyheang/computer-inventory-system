import 'dotenv/config'
import app from './src/config/view.js'
import authRoutes from './src/routes/authRoutes.js'
import homeRoutes from './src/routes/homeRoutes.js'

const port = process.env.PORT || 3000

app.use('/', authRoutes)
app.use('/', homeRoutes)

app.listen(port, () => {
	// console.log(`Server running at http://localhost:${port}`)
})
