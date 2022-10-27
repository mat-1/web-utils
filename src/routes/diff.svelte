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
	import Spinner from '$lib/Spinner.svelte'

	let syncWorker: Worker | undefined = undefined

	let loading = false

	let currentId = 0

	let renderedDiff = ''
	const loadWorker = async () => {
		let SyncWorker: typeof import('*?worker')
		try {
			SyncWorker = await import('$lib/diff-worker?worker')
			syncWorker = new SyncWorker.default()
		} catch (e) {
			console.error(e)
			return
		}

		syncWorker.addEventListener('message', (event) => {
			const { data } = event
			const thisId = data.id
			if (thisId === currentId) {
				renderedDiff = data.diff
				loading = false
			}
		})
		syncWorker.addEventListener('error', (event) => {
			console.error(event)
			if (
				event.message ===
				'SyntaxError: import declarations may only appear at top level of a module'
			) {
				console.log(
					"Disabling diff worker, this browser doesn't support esm workers: https://github.com/vitejs/vite/issues/4586 https://caniuse.com/mdn-api_worker_worker_ecmascript_modules https://bugzilla.mozilla.org/show_bug.cgi?id=1247687"
				)
				syncWorker = undefined
				renderDiff()
			}
		})
		renderDiff()
	}

	let before: string
	let after: string

	async function renderDiff() {
		if (before.length > 1000 || after.length > 1000) loading = true

		if (!syncWorker) {
			if (loading) {
				// wait two animation frames to make sure the spinner shows up
				await new Promise((resolve) => requestAnimationFrame(resolve))
				await new Promise((resolve) => requestAnimationFrame(resolve))
			}

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
			loading = false
		} else {
			currentId++
			syncWorker.postMessage({ before, after, id: currentId })
		}
	}

	function swapBeforeAfter() {
		;[before, after] = [after, before]
		renderDiff()
	}

	onMount(loadWorker)
</script>

<Triple>
	<Part>
		<Options>
			<button class="swap-button" on:click={swapBeforeAfter} aria-label="Swap textboxes">
				<Swap />
			</button>
		</Options>
		<TextArea bind:value={before} id="diff-before" label="Before" on:input={renderDiff} />
	</Part>
	<Part>
		<TextArea bind:value={after} id="diff-after" label="After" on:input={renderDiff} />
	</Part>
	<Part>
		<div class="diff-container">
			<Label id="diff-label" for="rendered-diff" simulateLabel>Diff</Label>
			<div class="rendered-diff" id="rendered-diff" aria-labelledby="diff-label">
				{#if loading}
					<div class="loader">
						<Spinner />
					</div>
				{:else}
					{@html renderedDiff}
				{/if}
			</div>
		</div>
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
		display: block;
		height: 100%;
		margin: 0;
		overflow: auto;
	}
	.diff-container {
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.swap-button {
		border: none;
		background: none;
		font-size: inherit;
		padding: 0;
		margin: 0;
	}

	.loader {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
	}
</style>
