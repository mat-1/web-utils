<script lang="ts">
	import { page } from '$app/stores'

	export let href: string | undefined
	export let isThisPage: boolean = false
	page.subscribe((p) => {
		isThisPage = href === p.path
	})
</script>

{#if href}
	<a {href}><li class:selected={isThisPage}><slot /></li></a>
{:else}
	<li class:selected={isThisPage}><slot /></li>
{/if}

<style>
	li {
		/* border: 2px solid var(--background-color-alt-2); */
		/* background-color: var(--background-color-alt-2); */
		/* background-color: var(--background-color); */
		padding: 0.25em 1em;
		border-radius: 0.25em;
		word-wrap: break-word;
		color: var(--text-color);
		margin: 0.25em;
		opacity: 0.9;
	}

	a {
		color: inherit;
		text-decoration: none;
		width: 100%;
		height: 100%;
	}

	.selected {
		background-color: var(--background-color-alt-3);
	}
</style>
