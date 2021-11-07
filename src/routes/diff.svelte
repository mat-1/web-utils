<script lang="ts">
	import RenderedTextArea from '$lib/RenderedTextArea.svelte'
	import TextArea from '$lib/TextArea.svelte'
	import { encodeHtml } from '$lib/utils'
	import fastDiff from 'fast-diff'
	import { onMount } from 'svelte'

	let before: string
	let after: string

	let renderedDiff = ''

	function renderDiff() {
		const diff = fastDiff(before, after)
		console.log(before, after, diff)
		renderedDiff = ''
		for (const [type, difference] of diff) {
			switch (type) {
				case 0:
					renderedDiff += encodeHtml(difference)
					break
				case 1:
					renderedDiff += `<span class="diff-added">${encodeHtml(difference)}</span>`
					break
				case -1:
					renderedDiff += `<span class="diff-removed">${encodeHtml(difference)}</span>`
					break
			}
		}
		console.log(renderedDiff)
	}
	onMount(renderDiff)
</script>

<div class="container">
	<div class="before-container">
		<TextArea bind:value={before} id="diff-before" label="Before" on:input={renderDiff} />
	</div>
	<div class="after-container">
		<TextArea bind:value={after} id="diff-after" label="After" on:input={renderDiff} />
	</div>
	<div class="diff-container">
		<p class="rendered-diff">{@html renderedDiff}</p>
	</div>
</div>

<style>
	/* stack the containers on top of each other */
	.container {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-template-rows: 1fr;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.before-container,
	.after-container {
		margin: 0.5em;
	}

	.rendered-diff :global(.diff-added) {
		background-color: #09d82f66;
	}
	.rendered-diff :global(.diff-removed) {
		background-color: #fd2c2166;
	}
	.rendered-diff {
		white-space: pre;
	}
</style>
