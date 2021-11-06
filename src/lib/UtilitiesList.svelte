<script lang="ts">
	import ListItem from '$lib/ListItem.svelte'
</script>

<ul>
	<ListItem href="/base64">Base64 Encode<wbr />/Decode</ListItem>
	<ListItem href="/diff">Text differ</ListItem>
	<ListItem href="/url">URL Encode<wbr />/Decode</ListItem>
	<ListItem href="/basen">Number Base Converter</ListItem>
	<ListItem href="/lipsum">Lorem Ipsum Generator</ListItem>
</ul>

<style>
	ul {
		list-style: none;
		padding: 0;
		margin: 0.25em;
	}
</style>
