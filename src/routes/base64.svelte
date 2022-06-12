<script lang="ts">
	import ClickableUrlsTextArea from '$lib/ClickableUrlsTextArea.svelte'
	import Double from '$lib/containers/Double.svelte'
	import { b64decode, b64encode } from '$lib/utils'
	import { afterNavigate } from '$app/navigation'
	import Part from '$lib/containers/Part.svelte'
	import Toggle from '$lib/Toggle.svelte'
	import Options from '$lib/containers/Options.svelte'

	let decoded: string
	let encoded: string

	let encodeLinesSeparately = false

	let decodedTextArea: HTMLTextAreaElement | undefined
	let encodedTextArea: HTMLTextAreaElement | undefined

	function updateEncoded() {
		const newEncoded = encodeLinesSeparately
			? decoded
					.split('\n')
					.map((l) => b64encode(l))
					.join('\n')
			: b64encode(decoded)
		if (newEncoded !== encoded) encoded = newEncoded
	}

	function updateDecoded() {
		// if encoded has a newline, we must turn on decode lines separately
		if (encoded.trim().includes('\n')) encodeLinesSeparately = true

		const newDecoded = encodeLinesSeparately
			? encoded.split('\n').map(b64decode).join('\n')
			: b64decode(encoded)
		if (newDecoded !== decoded) decoded = newDecoded
	}

	function updateEncodeLinesSeparately(e: Event) {
		encodeLinesSeparately = (e.target as HTMLInputElement).checked
		updateEncoded()
	}

	afterNavigate(({ from, to }) => {
		if (encoded && !decoded) {
			updateDecoded()
			decodedTextArea?.focus()
		} else if (decoded && !encoded) {
			updateEncoded()
			encodedTextArea?.focus()
		}
	})
</script>

<Double>
	<Part>
		<Options>
			<Toggle
				bind:value={encodeLinesSeparately}
				on:input={updateEncodeLinesSeparately}
				id="base64-lines-separately">Encode lines separately</Toggle
			>
		</Options>
		<ClickableUrlsTextArea
			bind:value={decoded}
			bind:element={decodedTextArea}
			id="base64-decoded"
			on:input={updateEncoded}
			label="Plaintext"
		/>
	</Part>
	<Part>
		<ClickableUrlsTextArea
			bind:value={encoded}
			bind:element={encodedTextArea}
			id="base64-encoded"
			on:input={updateDecoded}
			label="Base64"
		/>
	</Part>
</Double>
