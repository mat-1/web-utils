<script lang="ts">
	import { goto } from '$app/navigation'
	import { utilities } from '$lib/utils'

	import ListItem from '$lib/ListItem.svelte'

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

	function onWindowKeydown(event: KeyboardEvent) {
		if (event.ctrlKey && event.key === '/') {
			searchBarEl.focus()
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
		/>
	</div>
	<ul>
		{#each shownListItems as utility (utility.name)}
			<ListItem href={utility.href}>{utility.name}</ListItem>
		{/each}
	</ul>
</div>

<style>
	.utilities-list-container {
		padding: 0.25em;
		width: 100%;
	}
	ul {
		list-style: none;
		padding: 0;
		margin-top: 0;
		overflow-y: scroll;
		height: calc(100vh - 3rem);
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
			height: calc(100vh - 2.5rem);
		}
		:global(.hamburger-hidden) .search {
			width: calc(100% - 1rem);
			left: 0.5rem;
		}
	}
	.search-container {
		padding: 0.25em 0.25em 0 0.25em;
	}
</style>
