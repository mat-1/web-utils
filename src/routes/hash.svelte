<script lang="ts">
	import ClickableUrlsTextArea from '$lib/ClickableUrlsTextArea.svelte'
	import Label from '$lib/Label.svelte'
	import { onMount } from 'svelte'
	import { browser } from '$app/env'
	import * as hashWasm from 'hash-wasm'
	import Double from '$lib/containers/Double.svelte'
	import Part from '$lib/containers/Part.svelte'

	let string = ''

	let md5 = ''
	let sha1 = ''
	let sha256 = ''
	let sha384 = ''
	let sha512 = ''
	let crc32 = ''

	async function updateHashes(s: string) {
		md5 = await hashWasm.md5(s)
		sha1 = await hashWasm.sha1(s)
		sha256 = await hashWasm.sha256(s)
		sha384 = await hashWasm.sha384(s)
		sha512 = await hashWasm.sha512(s)
		crc32 = await hashWasm.crc32(s)
	}

	$: if (browser) updateHashes(string)
</script>

<Double>
	<Part>
		<ClickableUrlsTextArea bind:value={string} id="hash-string" label="String" />
	</Part>
	<Part>
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
	</Part>
</Double>
