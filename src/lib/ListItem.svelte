<script lang="ts">
	import { browser } from '$app/env'
	import { page } from '$app/stores'
	import { createEventDispatcher, onMount } from 'svelte'

	export let href: string | undefined
	export let isThisPage = false
	let pageLoaded = false

	const dispatch = createEventDispatcher()

	let el: HTMLLIElement

	page.subscribe(async (p) => {
		isThisPage = href === p.url.pathname
		if (browser && !el)
			// wait until el is defined
			await new Promise((resolve) => setTimeout(resolve, 0))
		if (isThisPage) dispatch('select', el)
	})

	onMount(() => {
		pageLoaded = true
	})
</script>

{#if href}
	<li
		class:selected={isThisPage}
		class:show-selected-background={isThisPage && !pageLoaded}
		class="anchor-list-item"
		bind:this={el}
	>
		<a {href} on:click>
			<slot />
		</a>
	</li>
{:else}
	<li
		class:selected={isThisPage}
		class:show-selected-background={isThisPage && !pageLoaded}
		on:click
		tabindex="0"
		bind:this={el}
	>
		<slot />
	</li>
{/if}

<style>
	li {
		padding: 0.25em 1em;
		border-radius: 0.25em;
		word-wrap: break-word;
		color: var(--text-color);
		margin: 0.25em;
		/* position: relative; */
		z-index: 10;
	}
	.anchor-list-item {
		padding: 0;
	}

	a {
		color: inherit;
		text-decoration: none;
		width: 100%;
		height: 100%;
		display: inline-block;
		padding: 0.25em 1em;
		z-index: 10;
		position: relative;
	}

	.show-selected-background {
		background-color: var(--background-color-alt-3);
	}
</style>
