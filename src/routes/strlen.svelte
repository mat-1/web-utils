<script lang="ts">
	import ClickableUrlsTextArea from '$lib/ClickableUrlsTextArea.svelte'
	import Double from '$lib/containers/Double.svelte'
	import Part from '$lib/containers/Part.svelte'
	import Label from '$lib/Label.svelte'

	let string = ''

	$: charCount = [...string].length
	$: utf16ByteCount = string.length
	$: utf8ByteCount = (new TextEncoder().encode(string)).length
</script>

<Double>
	<Part>
		<ClickableUrlsTextArea bind:value={string} id="strlen-string" label="String" />
	</Part>
	<Part>
		<Label>Characters</Label>
		<p>{charCount}</p>
		{#if utf8ByteCount != charCount}
		<Label>Bytes (UTF-8)</Label>
		<p>{utf8ByteCount}</p>
		{/if}
		{#if utf16ByteCount != utf8ByteCount}
		<Label>Bytes (UTF-16)</Label>
		<p>{utf16ByteCount}</p>
		{/if}
		<Label>Words</Label>
		<p>
			{string
				.trim()
				.split(/\s+/)
				.filter((w) => w).length}
		</p>
	</Part>
</Double>
