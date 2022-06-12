<script lang="ts">
	import Label from '$lib/Label.svelte'
	import { onMount } from 'svelte'
	import { getValue, storeValue } from './utils'

	export let value: string
	export let placeholder = ''

	export let id = ''
	export let label = ''

	export let inline = false
	export let small = false

	export let disabled = false

	let mounted = false

	onMount(() => {
		const storedValue = getValue(id)
		if (id && storedValue) value = storedValue
		mounted = true
		console.log('value', id, value)
	})

	$: {
		if (id && mounted) {
			storeValue(id, value)
			console.log('store value', id, value)
		}
	}
</script>

<div class="input-container" class:inline class:small>
	{#if (label || $$slots.label) && id}
		<Label for={id}>
			{#if label}
				{label}
			{:else if $$slots.label}
				<slot name="label" />
			{/if}
		</Label>
	{/if}
	<input
		bind:value
		on:input
		placeholder={placeholder ? placeholder : undefined}
		{id}
		aria-labelledby={id && (label || $$slots.label) ? `${id}-label` : undefined}
		{disabled}
		autocomplete="off"
		role="textbox"
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

	input {
		width: 100%;
	}

	.inline {
		display: inline-block;
		margin-bottom: 0;
		height: 1em;
	}

	.small {
		width: 1.5em;
		position: relative;
		margin-bottom: 0;
		overflow: visible;
	}
	.small input {
		padding: 0 0.1em;
		height: 100%;
		text-align: center;
	}
</style>
