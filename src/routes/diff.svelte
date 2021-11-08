<script lang="ts">
	import Label from '$lib/Label.svelte'
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
	}
	onMount(renderDiff)
</script>

<div class="container">
	<div class="before-after-container">
		<div class="before-container">
			<TextArea bind:value={before} id="diff-before" label="Before" on:input={renderDiff} />
		</div>
		<div class="after-container">
			<TextArea bind:value={after} id="diff-after" label="After" on:input={renderDiff} />
		</div>
	</div>
	<div class="diff-container">
		<Label id="diff-label" for="rendered-diff" simulateLabel>Diff</Label>
		<p class="rendered-diff" id="rendered-diff" aria-labelledby="diff-label">
			{@html renderedDiff}
		</p>
	</div>
</div>

<style>
	.container {
		display: grid;
		grid-template-columns: 2fr 1fr;
		grid-template-rows: 1fr;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		height: 100%;
	}

	.before-after-container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	@media (max-width: 440px) {
		.before-after-container {
			grid-template-columns: 1fr;
			grid-template-rows: 1fr 1fr;
		}
		.container {
			grid-template-columns: 1fr 1fr;
		}
	}

	.before-container,
	.after-container,
	.diff-container {
		margin: 0.5em;
	}

	.rendered-diff :global(.diff-added) {
		background-color: #09d82f66;
	}
	.rendered-diff :global(.diff-removed) {
		background-color: #fd2c2166;
	}
	.diff-container {
		overflow-x: hidden;
	}
	.rendered-diff {
		white-space: pre-wrap;
		word-wrap: break-word;
	}

	p {
		margin: 0;
	}
</style>
