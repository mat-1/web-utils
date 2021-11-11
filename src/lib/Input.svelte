<script lang="ts">
	import Label from '$lib/Label.svelte'
	import { onMount } from 'svelte'
	import { getValue, storeValue } from './utils'
	import { browser } from '$app/env'

	export let value = ''
	export let placeholder = ''

	export let id = ''
	export let label = ''

	export let disabled = false

	let mounted = false

	onMount(() => {
		if (id) value = getValue(id)
		mounted = true
	})

	$: {
		if (id && mounted) {
			storeValue(id, value)
		}
	}
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
		{disabled}
		autocomplete="off"
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
