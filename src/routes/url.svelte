<script lang="ts">
	import { afterNavigate } from '$app/navigation'
	import TextArea from '$lib/TextArea/index.svelte'
	import Double from '$lib/containers/Double.svelte'
	import Options from '$lib/containers/Options.svelte'
	import Part from '$lib/containers/Part.svelte'
	import TextArea from '$lib/TextArea/index.svelte'
	import Toggle from '$lib/Toggle.svelte'

	let decoded: string
	let encoded: string

	let encodeAll = false

	function updateEncoded() {
		let result = ''
		if (encodeAll) {
			for (const char of decoded) {
				result += '%' + char.charCodeAt(0).toString(16)
			}
		} else {
			result = encodeURIComponent(decoded)
		}
		if (result !== encoded) encoded = result
	}

	function updateDecoded() {
		if (decodeURIComponent(encoded) !== decoded) decoded = decodeURIComponent(encoded)
	}

	function updateEncodeAll(e: Event) {
		encodeAll = (e.target as HTMLInputElement).checked
		updateEncoded()
	}

	afterNavigate(({ from, to }) => {
		if (decoded && !encoded) {
			updateEncoded()
		} else if (encoded && !decoded) {
			updateDecoded()
		}
	})
</script>

<Double>
	<Part>
		<Options>
			<Toggle bind:value={encodeAll} on:input={updateEncodeAll} id="url-encode-all">
				Encode everything
			</Toggle>
		</Options>

		<TextArea bind:value={decoded} id="url-decoded" on:input={updateEncoded} label="Plaintext" />
	</Part>
	<Part>
		<TextArea bind:value={encoded} id="url-encoded" on:input={updateDecoded} label="URL encoded" />
	</Part>
</Double>
