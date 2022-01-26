<script lang="ts">
	import ClickableUrlsTextArea from '$lib/ClickableUrlsTextArea.svelte'
	import { b64decode, b64encode } from '$lib/utils'
	import Toggle from '$lib/Toggle.svelte'
	import { afterNavigate } from '$app/navigation'

	let decoded: string
	let encoded: string

	let encodeLinesSeparately = false

	let decodedTextArea: HTMLTextAreaElement | undefined
	let encodedTextArea: HTMLTextAreaElement | undefined

	function updateEncoded() {
		const newEncoded = encodeLinesSeparately
			? decoded.split('\n').map(b64encode).join('\n')
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

<div class="container">
	<div class="decoded-container">
		<div class="options">
			<Toggle
				bind:value={encodeLinesSeparately}
				on:input={updateEncodeLinesSeparately}
				id="base64-lines-separately">Encode lines separately</Toggle
			>
		</div>
		<ClickableUrlsTextArea
			bind:value={decoded}
			bind:element={decodedTextArea}
			id="base64-decoded"
			on:input={updateEncoded}
			label="Plaintext"
		/>
	</div>
	<div class="encoded-container">
		<ClickableUrlsTextArea
			bind:value={encoded}
			bind:element={encodedTextArea}
			id="base64-encoded"
			on:input={updateDecoded}
			label="Base64"
		/>
	</div>
</div>

<style>
	/* stack the containers on top of each other */
	.container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		height: 100%;
	}

	@media (max-width: 440px) {
		.container {
			grid-template-columns: 1fr;
			grid-template-rows: 1fr 1fr;
		}
	}

	.decoded-container,
	.encoded-container {
		margin: 0.5em;
		position: relative;
	}

	.options {
		right: 0;
		position: absolute;
	}
</style>
