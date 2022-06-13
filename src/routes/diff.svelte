<script lang="ts">
	import Label from '$lib/Label.svelte'
	import TextArea from '$lib/TextArea/index.svelte'
	import { encodeHtml } from '$lib/utils'
	import fastDiff from 'fast-diff'
	import { onMount } from 'svelte'
	import Swap from '$lib/icons/Swap.svelte'
	import Triple from '$lib/containers/Triple.svelte'
	import Part from '$lib/containers/Part.svelte'
	import Options from '$lib/containers/Options.svelte'
	import IconButton from '$lib/IconButton.svelte'

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

	function swapBeforeAfter() {
		;[before, after] = [after, before]
		renderDiff()
	}

	onMount(renderDiff)
</script>

<Triple>
	<Part>
		<Options>
			<IconButton on:click={swapBeforeAfter} arialabel="Swap textboxes">
				<Swap />
			</IconButton>
		</Options>
		<TextArea bind:value={before} id="diff-before" label="Before" on:input={renderDiff} />
	</Part>
	<Part>
		<TextArea bind:value={after} id="diff-after" label="After" on:input={renderDiff} />
	</Part>
	<Part>
		<Label id="diff-label" for="rendered-diff" simulateLabel>Diff</Label>
		<p class="rendered-diff" id="rendered-diff" aria-labelledby="diff-label">
			{@html renderedDiff}
		</p>
	</Part>
</Triple>

<style>
	.rendered-diff :global(.diff-added) {
		background-color: #09d82f66;
	}
	.rendered-diff :global(.diff-removed) {
		background-color: #fd2c2166;
	}
	.rendered-diff {
		white-space: pre-wrap;
		word-wrap: break-word;
	}

	p {
		margin: 0;
	}
</style>
