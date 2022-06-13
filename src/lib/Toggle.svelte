<script lang="ts">
	import { browser } from '$app/env'

	import Label from '$lib/Label.svelte'
	import { onMount } from 'svelte'
	import { getValue, storeValue } from './utils'

	export let value = false
	export let id: string | undefined

	let mounted = false

	onMount(() => {
		mounted = true
		try {
			// we actually encode the data in localStorage as b64 since otherwise it complains when we put binary
			value = id ? getValue(id) === 'true' : false
		} catch (e) {
			value = false
		}
	})
	$: {
		if (id && browser && mounted) storeValue(id, value ? 'true' : 'false')
	}
</script>

<div class="switch-container">
	<Label>
		<slot />
		<label class="switch">
			<input type="checkbox" bind:checked={value} on:input />
			<span class="slider" />
		</label>
	</Label>
</div>

<style>
	.switch-container {
		position: relative;
		display: inline-block;
		bottom: 0.3em;
	}
	/* The switch - the box around the slider */
	.switch {
		position: relative;
		display: inline-block;
		width: 1.5em;
		height: 0.8em;
		bottom: -0.35em;
		left: -0.1em;
	}

	/* Hide default HTML checkbox */
	.switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	/* The slider */
	.slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: var(--background-color-alt-2);
		transition: 200ms;
	}

	.slider:before {
		position: absolute;
		content: '';
		height: 0.6em;
		width: 0.6em;
		left: 0.1em;
		bottom: 0.095em;
		background-color: var(--text-color-alt);
		transition: 200ms;
	}

	input:checked + .slider {
		background-color: var(--background-color-alt-3);
	}

	input:focus + .slider {
		box-shadow: 0 0 1px var(--background-color-alt-3);
	}

	input:checked + .slider:before {
		transform: translateX(0.7em);
	}

	/* Rounded sliders */
	.slider {
		border-radius: 0.5em;
	}

	.slider:before {
		border-radius: 0.5em;
	}
</style>
