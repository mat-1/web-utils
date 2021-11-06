<script lang="ts">
	import ClickableUrlsTextArea from '$lib/ClickableUrlsTextArea.svelte'

	import { b64decode, b64encode } from '$lib/utils'

	let decoded: string
	let encoded: string

	function updateEncoded() {
		if (b64encode(decoded) !== encoded) encoded = b64encode(decoded)
		console.log('decoded', decoded, '->', encoded)
	}

	function updateDecoded() {
		if (b64decode(encoded) !== decoded) decoded = b64decode(encoded)
		console.log('encoded', encoded, '->', decoded)
	}
</script>

<div class="container">
	<div class="decoded-container">
		<ClickableUrlsTextArea
			bind:value={decoded}
			id="base64-decoded"
			on:input={updateEncoded}
			label="Plaintext"
		/>
	</div>
	<div class="encoded-container">
		<ClickableUrlsTextArea
			bind:value={encoded}
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
		grid-template-columns: 1fr;
		grid-template-rows: 1fr 1fr;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.decoded-container,
	.encoded-container {
		margin: 0.5em;
	}
</style>
