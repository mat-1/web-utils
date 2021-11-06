<script lang="ts">
	import RenderedTextArea from '$lib/RenderedTextArea.svelte'
	let before: string
	let after: string
</script>

<RenderedTextArea bind:value={before} id="diff-before" label="Before" render={(t) => t} />
<RenderedTextArea bind:value={after} id="diff-after" label="After" render={(t) => t} />
