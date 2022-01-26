<!-- convert between time formats and timezones -->
<script lang="ts">
	import ClickableUrlsTextArea from '$lib/ClickableUrlsTextArea.svelte'
	import Label from '$lib/Label.svelte'
	import { onMount } from 'svelte'
	import { browser } from '$app/env'
	import * as hashWasm from 'hash-wasm'
	import { strptime } from '../lib/strptime'

	let string = ''

	let format = '%d/%B/%Y:%H:%M:%S %Z'
	let time: string

	let mounted = false

	async function updateTime(s: string) {
		time
	}

	// $: if (browser) updateHashes(string)
</script>

<div class="container">
	<div class="string-container">
		<ClickableUrlsTextArea bind:value={string} id="hash-string" label="String" />
	</div>
	<div class="data-container">
		<!-- <Label>MD5</Label>
		<p>{md5}</p> -->
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
		margin: 0;
	}
</style>
