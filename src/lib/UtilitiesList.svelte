<script lang="ts">
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
</script>

<div class="utilities-list-container">
	<div class="search-container">
		<input type="text" placeholder="Search" class="search" bind:value={searchQuery} />
	</div>
	<ul>
		{#each utilities
			.filter((u) => {
				return matchesSearchQuery(searchQuery, u.name)
			})
			.sort((a, b) => a.name.length - b.name.length) as utility (utility.name)}
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
	}
	.search {
		display: block;
		width: 100%;
	}
	@media (max-width: 440px) {
		.search {
			position: absolute;
			top: 0.5em;
			width: calc(100% - 3rem);
			left: 2.5rem;
		}
		ul {
			margin-top: -1.15em;
		}
	}
	.search-container {
		padding: 0.25em 0.25em 0 0.25em;
	}
</style>
