<script lang="ts">
	import { goto } from '$app/navigation'

	import ListItem from '$lib/ListItem.svelte'

	let searchQuery = ''

	function normalize(str: string) {
		return str.toLowerCase().replace(/ /g, '')
	}

	function matchesSearchQuery(query: string, value: string): boolean {
		return normalize(value).includes(normalize(query))
	}

	const utilities = [
		{
			name: 'Base64 Encode/Decode',
			href: '/base64',
		},
		{
			name: 'Text Diff',
			href: '/diff',
		},
		{
			name: 'URL Encode/Decode',
			href: '/url',
		},
		{
			name: 'Number Base Converter',
			href: '/basen',
		},
		{
			name: 'Lorem Ipsum',
			href: '/lipsum',
		},
	]

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
			type="text"
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
		overflow: scroll;
		height: calc(100vh - 3rem);
	}
	.search {
		display: block;
		width: 100%;
		margin-bottom: 0.5rem;
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
	}
	.search-container {
		padding: 0.25em 0.25em 0 0.25em;
	}
</style>
