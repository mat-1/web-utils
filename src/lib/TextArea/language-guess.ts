import type { Extension } from '@codemirror/state'
import * as languages from './languages'

// guess a programming language from a string

export function guessLanguage(code: string): Extension | null {
	// try parsing the json to see if it's valid
	try {
		JSON.parse(code)
		return languages.json()
	} catch {
		// noop
	}
	return languages.python()
	return null
}
