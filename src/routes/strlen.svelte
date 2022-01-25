<script lang="ts">
	import ClickableUrlsTextArea from '$lib/ClickableUrlsTextArea.svelte'
	import Label from '$lib/Label.svelte'

	import { b64decode, b64encode } from '$lib/utils'

	let string = ''
</script>

<div class="container">
	<div class="string-container">
		<ClickableUrlsTextArea bind:value={string} id="strlen-string" label="String" />
	</div>
	<div class="data-container">
		<Label>Characters</Label>
		<p>{string.length}</p>
		<Label>Words</Label>
<<<<<<< HEAD
		<p>{string.trim().split(/\s+/).filter(w => w).length}</p>
=======
		<p>{string.split(/\s+/).filter((w) => w).length}</p>
>>>>>>> 7db558c48eb40de699cbf9333bd56d89b268597b
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
	}

	p {
		margin: 0;
	}
</style>
