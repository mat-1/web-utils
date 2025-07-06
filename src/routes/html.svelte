<script lang="ts">
	import TextArea from '$lib/TextArea/index.svelte'
	import Double from '$lib/containers/Double.svelte'
	import Options from '$lib/containers/Options.svelte'
	import Part from '$lib/containers/Part.svelte'
	import TextArea from '$lib/TextArea/index.svelte'
	import Toggle from '$lib/Toggle.svelte'

	let decoded: string
	let encoded: string

	let encodeAll = false

	const escapeChars: Record<string, string> = {
		'¢': 'cent',
		'£': 'pound',
		'¥': 'yen',
		'€': 'euro',
		'©': 'copy',
		'®': 'reg',
		'<': 'lt',
		'>': 'gt',
		'"': 'quot',
		'&': 'amp',
	}

	function encodeHTMLEntities(str: string, opts: { encodeAll?: boolean } = {}): string {
		if (opts.encodeAll) {
			let result = ''
			for (const char of str) {
				if (char in escapeChars) result += '&' + escapeChars[char]! + ';'
				else result += '&#' + char.charCodeAt(0) + ';'
			}
			return result
		} else {
			const el = document.createElement('template')
			el.textContent = str
			return el.innerHTML
		}
	}

	function decodeHTMLEntities(str: string): string {
		const el = document.createElement('template')
		el.innerHTML = str
		return el.textContent ?? ''
	}

	function updateEncoded() {
		if (encodeHTMLEntities(decoded, { encodeAll }) !== encoded)
			encoded = encodeHTMLEntities(decoded, { encodeAll })
	}

	function updateDecoded() {
		if (decodeHTMLEntities(encoded) !== decoded) decoded = decodeHTMLEntities(encoded)
	}

	function updateEncodeAll(e: Event) {
		encodeAll = (e.target as HTMLInputElement).checked
		updateEncoded()
	}
</script>

<Double>
	<Part>
		<Options>
			<Toggle bind:value={encodeAll} on:input={updateEncodeAll} id="html-encode-all">
				Encode everything
			</Toggle>
		</Options>

		<TextArea bind:value={decoded} id="html-decoded" on:input={updateEncoded} label="Plaintext" />
	</Part>
	<Part>
		<TextArea
			bind:value={encoded}
			id="html-encoded"
			on:input={updateDecoded}
			label="HTML encoded"
		/>
	</Part>
</Double>
