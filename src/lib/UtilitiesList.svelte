<script lang="ts">
	import { goto } from '$app/navigation'
	import { utilities } from '$lib/utils'

	import ListItem from '$lib/ListItem.svelte'
	import { identifyAndGoto } from './identify'

	let searchQuery = ''

	function normalize(str: string) {
		return str.toLowerCase().replace(/ /g, '')
	}

	function matchesSearchQuery(query: string, value: string): boolean {
		return normalize(value).includes(normalize(query))
	}

	$: shownListItems = utilities
		.filter((u) => {
			return matchesSearchQuery(searchQuery, u.name)
		})
		.sort((a, b) => a.name.length - b.name.length)

	let searchBarEl: HTMLInputElement

	function onSearchKeydown(event: KeyboardEvent) {
		console.log(event)
		if (event.key === 'Enter') {
			if (searchQuery.length > 0 && shownListItems.length > 0 && 'href' in shownListItems[0]) {
				goto(shownListItems[0].href)
			}
		}
	}

	async function onSearchPaste(event: ClipboardEvent) {
		let paste: string = (event.clipboardData || (window as any).clipboardData).getData('text')

		if (identifyAndGoto(paste.trim())) {
			event.preventDefault()
		}
	}

	function onWindowKeydown(event: KeyboardEvent) {
		if (event.ctrlKey && event.key === '/') {
			searchBarEl.focus()
			event.preventDefault()
		}
	}
</script>

<svelte:window on:keydown={onWindowKeydown} />

<div class="utilities-list-container">
	<div class="search-container">
		<input
			type="search"
			placeholder="Search"
			class="search"
			bind:this={searchBarEl}
			bind:value={searchQuery}
			on:keydown={onSearchKeydown}
			on:paste={onSearchPaste}
		/>
	</div>
	<ul>
		{#each shownListItems as utility (utility.name)}
			<ListItem href={utility.href}>{utility.name}</ListItem>
		{/each}
	</ul>
	<div class="credits">
		<p>By <a href="https://matdoes.dev">mat</a>.</p>
	</div>
</div>

<style>
	.utilities-list-container {
		padding: 0.25em;
		width: 100%;
		display: grid;
		grid-template-rows: auto 1fr auto;
		height: 100%;
	}
	ul {
		list-style: none;
		padding: 0;
		margin: 0;
		overflow-y: auto;
	}
	.search {
		display: block;
		width: 100%;
		margin-bottom: 0.5rem;
		/* Safari rounds borders on input[type=search] but i don't want it here */
		-webkit-appearance: none;
	}
	@media (max-width: 440px) {
		.search {
			position: absolute;
			top: 0.55rem;
			width: calc(100% - 3rem);
			left: 2.5rem;
		}
		ul {
			margin-top: -0.7rem;
		}
		:global(.hamburger-hidden) .search {
			width: calc(100% - 1rem);
			left: 0.5rem;
		}
	}
	.search-container {
		padding: 0.25em 0.25em 0 0.25em;
	}
	.credits p {
		text-align: center;
		margin: 0.25em 0;
		opacity: 0.5;
	}
</style>
