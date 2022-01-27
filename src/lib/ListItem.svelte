<script lang="ts">
	import { page } from '$app/stores'

	export let href: string | undefined
	export let isThisPage = false
	page.subscribe((p) => {
		isThisPage = href === p.url.pathname
	})
</script>

{#if href}
	<li class:selected={isThisPage} class="anchor-list-item"><a {href} on:click><slot /></a></li>
{:else}
	<li class:selected={isThisPage} on:click tabindex="0"><slot /></li>
{/if}

<style>
	li {
		padding: 0.25em 1em;
		border-radius: 0.25em;
		word-wrap: break-word;
		color: var(--text-color);
		margin: 0.25em;
		opacity: 0.9;
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
	}

	.selected {
		background-color: var(--background-color-alt-3);
	}
</style>
