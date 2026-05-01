import { randomBytes, createHash } from 'node:crypto'
import { desc, eq } from 'drizzle-orm'
import { db } from '../db/db.js'
import { apiKeys } from '../db/schema.js'

function toDateOnly(value) {
	if (!value) return '-'
	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return String(value).slice(0, 10)
	return date.toISOString().slice(0, 10)
}

function maskedKey(value) {
	if (!value) return '********'
	if (value.length <= 12) return `${value.slice(0, 4)}********`
	return `${value.slice(0, 8)}.....${value.slice(-6)}`
}

function buildStats(rows) {
	const active = rows.filter((key) => key.status === true && key.isDeleted !== true).length
	const revoked = rows.filter((key) => key.status === false || key.isDeleted === true).length

	return {
		total: rows.length,
		active,
		revoked,
	}
}

export async function getApiKeyPageData() {
	const rows = await getApiKeys()
	const keys = rows.map((key) => {
		const revoked = key.status === false || key.isDeleted === true

		return {
			id: key.id,
			label: key.label,
			keyHash: key.keyHash,
			keyPreview: maskedKey(key.keyHash),
			createdAt: toDateOnly(key.dateCreated),
			status: revoked ? 'Revoked' : 'Active',
			statusClass: revoked ? 'danger' : 'success',
			isRevoked: revoked,
		}
	})

	return {
		apiKeys: keys,
		stats: buildStats(rows),
	}
}

export async function createApiKey(_req, label) {
	const cleanLabel = String(label || '').trim()
	if (!cleanLabel) {
		throw new Error('Label is required.')
	}

	const secret = `ci_${randomBytes(24).toString('hex')}`
	const keyHash = createHash('sha256').update(secret).digest('hex')

	const [createdKey] = await db
		.insert(apiKeys)
		.values({
			label: cleanLabel,
			keyHash,
			status: true,
			isDeleted: false,
		})
		.returning({ id: apiKeys.id })
	if (!createdKey?.id) {
		throw new Error('Failed to create API key.')
	}
}

export async function revokeApiKey(_req, id) {
	const keyId = Number(id)
	if (!Number.isInteger(keyId) || keyId <= 0) {
		throw new Error('Valid API key id is required.')
	}

	const [existing] = await db
		.select({ id: apiKeys.id })
		.from(apiKeys)
		.where(eq(apiKeys.id, keyId))
		.limit(1)

	if (!existing) {
		throw new Error('API key not found.')
	}

	const now = new Date().toISOString()
	await db
		.update(apiKeys)
		.set({
			status: false,
			isDeleted: true,
			dateDeleted: now,
			dateUpdated: now,
		})
		.where(eq(apiKeys.id, keyId))
}

async function getApiKeys() {
	return db
		.select({
			id: apiKeys.id,
			label: apiKeys.label,
			keyHash: apiKeys.keyHash,
			status: apiKeys.status,
			isDeleted: apiKeys.isDeleted,
			dateCreated: apiKeys.dateCreated,
		})
		.from(apiKeys)
		.orderBy(desc(apiKeys.dateCreated))
}
