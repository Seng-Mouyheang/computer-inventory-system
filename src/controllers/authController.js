function parseCookies(cookieHeader) {
	if (!cookieHeader) return {}
	return Object.fromEntries(
		cookieHeader
			.split(';')
			.map((cookie) => cookie.trim().split('='))
			.map(([name, value]) => [name, decodeURIComponent(value || '')]),
	)
}

function isAuthenticated(req) {
	const cookies = parseCookies(req.headers.cookie)
	return cookies.auth === '1'
}

export function renderLogin(req, res) {
	if (isAuthenticated(req)) {
		return res.redirect('/')
	}

	return res.render('login', { title: 'Login' })
}

export function handleLogin(req, res) {
	const role = req.body.role === 'admin' ? 'Admin' : 'Technician'

	res.cookie('auth', '1', { httpOnly: true, sameSite: 'lax' })
	res.cookie('role', role, { httpOnly: true, sameSite: 'lax' })

	res.redirect('/')
}

export function handleLogout(_req, res) {
	res.clearCookie('auth')
	res.clearCookie('role')
	res.redirect('/login')
}
