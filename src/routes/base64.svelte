<script lang="ts">
	import TextArea from '$lib/TextArea.svelte'

	let decoded: string
	let encoded: string

	function updateEncoded() {
		if (btoa(decoded) !== encoded)
			encoded = btoa(decoded)
	}

	function updateDecoded() {
		if (atob(encoded) !== decoded)
			decoded = atob(encoded)
	}
</script>

<TextArea bind:value={decoded} id="base64-decoded" on:input={updateEncoded} />
<TextArea bind:value={encoded} id="base64-encoded" on:input={updateDecoded} />
