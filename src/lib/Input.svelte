<script lang="ts">
	import Label from '$lib/Label.svelte'

	export let value = ''
	export let placeholder = ''

	export let id = ''
	export let label = ''
</script>

<div class="input-container">
	{#if label && id}
		<Label for={id}>{label}</Label>
	{/if}
	<input
		bind:value
		on:input
		placeholder={placeholder ? placeholder : undefined}
		{id}
		aria-labelledby={id && label ? `${id}-label` : undefined}
	/>
</div>

<style>
	.input-container {
		height: max-content;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		margin-bottom: 0.5em;
	}
</style>
