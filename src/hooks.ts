import cookie from 'cookie'
import { v4 as uuid } from '@lukeed/uuid'
import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event)

	return response
}
