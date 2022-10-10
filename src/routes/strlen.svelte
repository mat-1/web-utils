<script lang="ts">
	import TextArea from '$lib/TextArea/index.svelte'
	import Double from '$lib/containers/Double.svelte'
	import Part from '$lib/containers/Part.svelte'
	import Label from '$lib/Label.svelte'

	let string = ''

	$: charCount = [...string].length
	$: utf16ByteCount = string.length
	$: utf8Bytes = new TextEncoder().encode(string)
	$: utf8ByteCount = utf8Bytes.length

	let byteFormat: 'utf8' | 'utf16' = 'utf8'
	let bytes: number[] = []
	let bytesHexLength = 2
	$: {
		switch (byteFormat) {
			case 'utf8':
				bytes = Array.from(utf8Bytes)
				bytesHexLength = 2
				break
			case 'utf16':
				bytes = Array.from(string).map((c) => c.charCodeAt(0))
				bytesHexLength = 4
				break
		}
	}
</script>

<Double>
	<Part>
		<TextArea bind:value={string} id="strlen-string" label="String" />
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

		<Label>Bytes</Label>
		<select name="str-byte-format" bind:value={byteFormat}>
			<option value="utf8" selected={true}>UTF-8</option>
			<option value="utf16">UTF-16</option>
		</select>
		<p>
			<code>
				{bytes.map((b) => b.toString(16).padStart(bytesHexLength, '0')).join(' ')}
			</code>
		</p>
	</Part>
</Double>
