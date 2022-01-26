<script lang="ts">
	import ClickableUrlsTextArea from '$lib/ClickableUrlsTextArea.svelte'
	import Double from '$lib/containers/Double.svelte'
	import Part from '$lib/containers/Part.svelte'
	import Label from '$lib/Label.svelte'

	let string = ''
</script>

<Double>
	<Part>
		<ClickableUrlsTextArea bind:value={string} id="strlen-string" label="String" />
	</Part>
	<Part>
		<Label>Characters</Label>
		<p>{string.length}</p>
		<Label>Words</Label>
		<p>
			{string
				.trim()
				.split(/\s+/)
				.filter((w) => w).length}
		</p>
	</Part>
</Double>
