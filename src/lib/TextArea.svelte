<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte'
	import { browser } from '$app/env'
	import { getValue, storeValue } from './utils'
	import Label from './Label.svelte'

	export let id: string | undefined
	export let value = ''
	export let label: string | undefined

	const dispatch = createEventDispatcher()

	let mounted = false

	onMount(() => {
		mounted = true
		try {
			// we actually encode the data in localStorage as b64 since otherwise it complains when we put binary
			value = id ? getValue(id) : ''
		} catch (e) {
			value = ''
		}
	})

	$: {
		if (id && browser && mounted) storeValue(id, value)
	}

	function onInput() {
		dispatch('input', { value })
	}
</script>

<div class="textarea-container">
	{#if label && id}
		<Label for={id}>{label}</Label>
	{/if}
	<textarea bind:value on:input={onInput} {id} />
</div>

<style>
	textarea {
		border: 3px solid var(--background-color-alt);
		border-radius: 0.5em;
		resize: none;
		width: 100%;
		height: 100%;
		display: block;
		margin: 0;
		padding: 0.5em;
		font-family: inherit;
		background-color: var(--background-color);
		color: var(--text-color);
		flex-grow: 1;
		font-size: inherit;
	}

	label {
		color: var(--text-color-alt);
		font-size: 0.8em;
		position: relative;
		height: max-content;
		margin-left: 0.5em;
	}

	.textarea-container {
		height: 100%;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}
</style>
