<script lang="ts">
	import ClickableUrlsTextArea from '$lib/ClickableUrlsTextArea.svelte'
	import TextArea from '$lib/TextArea.svelte'

	let decoded: string
	let encoded: string

	function updateEncoded() {
		if (encodeURIComponent(decoded) !== encoded) encoded = encodeURIComponent(decoded)
	}

	function updateDecoded() {
		if (decodeURIComponent(encoded) !== decoded) decoded = decodeURIComponent(encoded)
	}
</script>

<div class="container">
	<div class="decoded-container">
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
	}

	.decoded-container,
	.encoded-container {
		margin: 0.5em;
	}
</style>
