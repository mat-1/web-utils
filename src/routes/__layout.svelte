<script lang="ts" context="module">
	import { Load } from 'svelte'
	import { utilities } from '$lib/utils'

	export const load: Load = ({ page }) => {
		return {
			props: {
				path: page.path,
				isIndex: page.path == base.replace(/^\/$/g, '') + '/',
				name: utilities.find((u) => u.href === page.path)?.name,
			},
		}
	}
</script>

<script lang="ts">
	import { browser } from '$app/env'
	import { page } from '$app/stores'
	import { base } from '$app/paths'

	import HamburgerMenu from '$lib/icons/HamburgerMenu.svelte'
	import UtilitiesList from '$lib/UtilitiesList.svelte'
	import { storeValue } from '$lib/utils'
	import { onMount } from 'svelte'
	import '../app.css'

	let sidebarHidden = false

	export let isIndex = false
	export let path: string
	export let name: string

	function updateSidebarForMobile() {
		sidebarHidden = window.matchMedia('(max-width: 440px)').matches && !isIndex
	}

	// hack so sveltekit runs this every time the page changes
	$: $page,
		(() => {
			// we wait a frame so the sidebar hiding animation plays
			if (browser) {
				requestAnimationFrame(updateSidebarForMobile)
				if (!isIndex) storeValue('current-page', path)
			}
		})()
	onMount(updateSidebarForMobile)
</script>

<svelte:head>
	<title>
		{name ? `${name} - Web Utils` : 'Web Utils'}
	</title>
</svelte:head>

<div id="page" class:sidebar-hidden={sidebarHidden} class:hamburger-hidden={isIndex}>
	<nav>
		<UtilitiesList />
	</nav>

	{#if !isIndex}
		<button id="sidebar-toggle" on:click={() => (sidebarHidden = !sidebarHidden)}>
			<HamburgerMenu />
		</button>
	{/if}

	<main>
		<slot />
	</main>
</div>

<style>
	#page {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		--sidebar-width: 15rem;
		--content-left-margin: var(--sidebar-width);
		--margin-top: 2.75em;
	}

	#sidebar-toggle {
		margin-left: var(--content-left-margin);
		transition: margin-left 200ms ease;
		background: none;
		border: none;
		width: max-content;
		padding: 1.25em;
		z-index: 3;
	}

	nav {
		background: var(--background-color-alt);
		width: var(--sidebar-width);
		height: 100%;
		position: fixed;
		left: 0;
		transition: left 200ms ease;
		z-index: 2;
	}

	@media (max-width: 440px) {
		nav {
			padding-top: var(--margin-top);
		}
		#page:not(.sidebar-hidden) nav {
			right: 0;
		}
		#page:not(.sidebar-hidden) {
			--sidebar-width: 100vw;
		}
		#page:not(.sidebar-hidden) main {
			display: none;
		}
		#page:not(.sidebar-hidden) #sidebar-toggle {
			margin-left: 0;
		}
	}

	main {
		margin-left: var(--content-left-margin);
		transition: margin-left 200ms ease;
		margin-top: var(--margin-top);
		padding: 0.5em;
		min-height: calc(100vh - var(--margin-top));
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: grid;
		overflow: hidden;
	}

	#page.sidebar-hidden {
		--content-left-margin: 0;
	}

	.sidebar-hidden nav {
		left: calc(0em - var(--sidebar-width));
	}
</style>
