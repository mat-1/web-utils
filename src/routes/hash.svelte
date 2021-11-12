<script lang="ts">
	import ClickableUrlsTextArea from '$lib/ClickableUrlsTextArea.svelte'
	import Label from '$lib/Label.svelte'
	import { onMount } from 'svelte'
	import { browser } from '$app/env'
	import * as hashWasm from 'hash-wasm'

	let string = ''

	let md5 = ''
	let sha1 = ''
	let sha256 = ''
	let sha384 = ''
	let sha512 = ''
	let crc32 = ''
	let mounted = false

	
	async function updateHashes(s) {
		md5 = await hashWasm.md5(s)
		sha1 = await hashWasm.sha1(s)
		sha256 = await hashWasm.sha256(s)
		sha384 = await hashWasm.sha384(s)
		sha512 = await hashWasm.sha512(s)
		crc32 = await hashWasm.crc32(s)
	}

	$: if (browser) updateHashes(string)
</script>

<div class="container">
	<div class="string-container">
		<ClickableUrlsTextArea bind:value={string} id="hash-string" label="String" />
	</div>
	<div class="data-container">
		<Label>MD5</Label>
		<p>{md5}</p>
		<Label>SHA-1</Label>
		<p>{sha1}</p>
		<Label>SHA-256</Label>
		<p>{sha256}</p>
		<Label>SHA-384</Label>
		<p>{sha384}</p>
		<Label>SHA-512</Label>
		<p>{sha512}</p>
		<Label>CRC32</Label>
		<p>{crc32}</p>
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

	.string-container,
	.data-container {
		margin: 0.5em;
		overflow: hidden;
		overflow-wrap: break-word;
	}

p {
	margin: 0
}
</style>
