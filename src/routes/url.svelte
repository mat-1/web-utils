<script lang="ts">
	import ClickableUrlsTextArea from '$lib/ClickableUrlsTextArea.svelte'
	import TextArea from '$lib/TextArea/index.svelte'
import Toggle from '$lib/Toggle.svelte';

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
</script>

<div class="container">
	<div class="decoded-container">
		<div class="options">
			<Toggle bind:value={encodeAll} on:input={updateEncodeAll} id="html-encode-all">Encode everything</Toggle>
		</div>

		<ClickableUrlsTextArea
			bind:value={decoded}
			id="url-decoded"
			on:input={updateEncoded}
			label="Plaintext"
		/>
	</div>
	<div class="encoded-container">
		<TextArea bind:value={encoded} id="url-encoded" on:input={updateDecoded} label="URL encoded" />
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
