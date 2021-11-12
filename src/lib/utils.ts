// https://developer.mozilla.org/en-US/docs/Web/API/btoa#unicode_strings

// convert a Unicode string to a string in which
// each 16-bit unit occupies only one byte
export function toBinary(string: string): string {
	const codeUnits = new Uint16Array(string.length)
	for (let i = 0; i < codeUnits.length; i++) {
		codeUnits[i] = string.charCodeAt(i)
	}
	const charCodes = new Uint8Array(codeUnits.buffer)
	let result = ''
	for (let i = 0; i < charCodes.byteLength; i++) {
		result += String.fromCharCode(charCodes[i])
	}
	return result
}

export function fromBinary(binary: string): string {
	const bytes = new Uint8Array(binary.length)
	for (let i = 0; i < bytes.length; i++) {
		bytes[i] = binary.charCodeAt(i)
	}
	const charCodes = new Uint16Array(bytes.buffer)
	let result = ''
	for (let i = 0; i < charCodes.length; i++) {
		result += String.fromCharCode(charCodes[i])
	}
	return result
}

function utf8decode(str: string): string {
	let output = ''

	for (let i = 0; i < str.length; i++) {
		const c = str.charCodeAt(i)

		if (c < 128) {
			output += String.fromCharCode(c)
		} else if (c > 191 && c < 224) {
			const c2 = str.charCodeAt(i + 1)
			output += String.fromCharCode(((c & 31) << 6) | (c2 & 63))
			i++
		} else {
			const c2 = str.charCodeAt(i + 1)
			const c3 = str.charCodeAt(i + 2)
			output += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63))
			i += 2
		}
	}
	return output
}

const base64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
const nonBase64CharsRegex = /[^A-Za-z0-9+/=]|=+$/g

export function b64encode(str: string): string {
	return btoa(unescape(encodeURIComponent(str.replace(/[\ud800-\udfff]/g, '�'))))
}

/** A base64 decoder that doesn't complain about invalid characters */
export function b64decode(str: string): string {
	let output = ''

	str = str.replace(nonBase64CharsRegex, '')

	for (let i = 0; i < str.length; i += 4) {
		const enc1 = base64.indexOf(str.charAt(i + 0))
		const enc2 = base64.indexOf(str.charAt(i + 1))
		const enc3 = base64.indexOf(str.charAt(i + 2))
		const enc4 = base64.indexOf(str.charAt(i + 3))

		const chr1 = (enc1 << 2) | (enc2 >> 4)
		const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
		const chr3 = ((enc3 & 3) << 6) | enc4

		output = output + String.fromCharCode(chr1)

		if (enc3 !== 64 && chr2 !== 0) output = output + String.fromCharCode(chr2)
		if (enc4 !== 64 && chr3 !== 0) output = output + String.fromCharCode(chr3)
	}

	output = utf8decode(output)

	return output
}

/**
 * Store something in localStorage
 */
export function storeValue(id: string, value: string): void {
	localStorage.setItem(id, b64encode(value))
}

/**
 * Get something that was previously stored in localStorage. Will return an empty string if the value is not found.
 */
export function getValue(id: string): string {
	const value = localStorage.getItem(id)
	return value ? b64decode(value) : ''
}

export function encodeHtml(str: string): string {
	return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function decodeHtml(str: string): string {
	const p = document.createElement('p')
	p.innerHTML = str
	const decoded = p.textContent
	p.remove()
	return decoded
}

export const utilities = [
	{
		name: 'Base64 Encode/Decode',
		href: '/base64',
	},
	{
		name: 'Text Diff',
		href: '/diff',
	},
	{
		name: 'URL Encode/Decode',
		href: '/url',
	},
	{
		name: 'Number Base Converter',
		href: '/basen',
	},
	{
		name: 'Lorem Ipsum',
		href: '/lipsum',
	},
	{
		name: 'UUID Inspector',
		href: '/uuid',
	},
	{
		name: 'String Length',
		href: '/strlen',
	},
]
