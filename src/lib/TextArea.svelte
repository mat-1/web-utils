<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte'
	import { browser } from '$app/env'
	
	export let id: string | undefined
	export let value: string = ''

	const dispatch = createEventDispatcher()
	
	onMount(() => {
		value = id ? localStorage.getItem(id) ?? '' : ''
	})

	$: {
		if (id && browser)
			localStorage.setItem(id, value)
		dispatch('input', { value })
	}
</script>

<textarea bind:value {id} />
