import { createApiKey, getApiKeyPageData, revokeApiKey } from '../models/apiKey.model.js'

export const renderApiKeys = async (req, res) => {
	try {
		const pageData = await getApiKeyPageData(req)
		res.render('api-key', {
			title: 'API Keys',
			...pageData,
		})
	} catch (error) {
		res.status(500).render('error', {
			message: 'Failed to load API keys',
			error: error.message,
		})
	}
}

export const generateApiKey = async (req, res) => {
	try {
		await createApiKey(req, req.body.label)
		res.redirect('/apikeys')
	} catch (error) {
		res.status(400).render('error', {
			message: 'Failed to generate API key',
			error: error.message,
		})
	}
}

export const revokeApiKeyById = async (req, res) => {
	try {
		await revokeApiKey(req, req.params.id)
		res.redirect('/apikeys')
	} catch (error) {
		res.status(400).render('error', {
			message: 'Failed to revoke API key',
			error: error.message,
		})
	}
}
