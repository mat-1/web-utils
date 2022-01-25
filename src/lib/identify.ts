/** Go to the formatter we should use for a string */

import { goto } from '$app/navigation'
import { b64decode, storeValue } from './utils'
import { extractData as extractUUIDData } from './uuid'

export function identifyAndGoto(str: string): boolean {
	// base64
	if (str.match(/^[a-zA-Z0-9+/=]+$/) && b64decode(str).match(/^[\x20-\x7F]+$/)) {
		storeValue('base64-encoded', str)
		storeValue('base64-decoded', '')
		goto('/base64')
		return true
	}

	// uuid
	const uuid = extractUUIDData(str, undefined)
	if (uuid.type) {
		storeValue('uuid-input', str)
		console.log('uuid-input', str)
		goto('/uuid')
		return true
	}

	// json
	// we test with a regex first since we only care about object jsons and not strings or numbers
	console.log(str)
	if (/^{[\w\W]+}$/.test(str) && JSON.parse(str)) {
		storeValue('unformatted-data', str)
		storeValue('formatted-data', '')
		goto('/fmt')
		return true
	}

	return false
}
