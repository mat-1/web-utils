<script lang="ts">
	import { goto } from '$app/navigation'
	import { utilities } from '$lib/utils'
	import ListItem from '$lib/ListItem.svelte'
	import { identifyAndGoto } from './identify'
	import { page } from '$app/stores'
	import { browser } from '$app/env'

	let searchQuery = ''

	function normalize(str: string) {
		return str.toLowerCase().replace(/ /g, '')
	}

	function matchesSearchQuery(query: string, value: string): boolean {
		return normalize(value).includes(normalize(query))
	}

	let shownListItems: typeof utilities[number][] = []
	$: {
		shownListItems = utilities
			.filter((u) => {
				return matchesSearchQuery(searchQuery, u.name)
			})
			.sort((a, b) => a.name.length - b.name.length)
		if (browser)
			requestAnimationFrame(() => {
				instantBackgroundMove = true
				updateSelectedItemBackground()
			})
	}

	let searchBarEl: HTMLInputElement

	async function goInDirection(direction: 1 | -1) {
		const current = shownListItems.findIndex((u) => u.href === $page.url.pathname)
		let next = current + direction

		// wrap around
		if (next > shownListItems.length - 1) {
			next = 0
		} else if (next < 0) {
			next = shownListItems.length - 1
		}

		await goto(shownListItems[next].href, { keepfocus: true })
	}

	async function onSearchKeydown(event: KeyboardEvent) {
		console.log(event)
		if (event.key === 'Enter') {
			if (searchQuery.length > 0 && shownListItems.length > 0 && 'href' in shownListItems[0]) {
				await goto(shownListItems[0].href)

				// select the first selectable thing in `main`
				const firstSelectable = document.querySelector('main textarea, main input[type="text"]')
				if (firstSelectable) {
					;(firstSelectable as HTMLInputElement).focus()
				}
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
		// down and up arrow
		if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
			// only if the target is the body or the search bar
			if (event.target === document.body || event.target === searchBarEl) {
				console.log(event)
				const direction = event.key === 'ArrowDown' ? 1 : -1
				goInDirection(direction)
				event.preventDefault()
			}
		}
	}

	let selectedItemEl: HTMLLIElement
	let selectedItemBackgroundEl: HTMLDivElement

	$: {
		selectedItemEl
		updateSelectedItemBackground()
	}

	let instantBackgroundMove = true
	function updateSelectedItemBackground() {
		if (!browser) return
		if (!selectedItemBackgroundEl) return
		if (!selectedItemEl) {
			console.warn('No selected element in list')
			selectedItemBackgroundEl.style.display = 'none'
			instantBackgroundMove = true
			return
		}
		if (instantBackgroundMove) {
			// make it transition instantly
			selectedItemBackgroundEl.style.transition = 'none'
			instantBackgroundMove = false
		} else {
			selectedItemBackgroundEl.style.transition = ''
		}
		// set the background element to the same size and at the same position as the selected element
		selectedItemBackgroundEl.style.width = selectedItemEl.offsetWidth + 'px'
		selectedItemBackgroundEl.style.height = selectedItemEl.offsetHeight + 'px'
		selectedItemBackgroundEl.style.transform = `translate(${selectedItemEl.offsetLeft}px, ${selectedItemEl.offsetTop}px)`
		selectedItemBackgroundEl.style.display = 'block'
	}

	// update selectedItemEl when the page changes
	page.subscribe((page) => {
		if (!browser) return
		const selected = document.querySelector(`li[data-href="${page.url.pathname}"]`)
		if (selected) {
			selectedItemEl = selected as HTMLLIElement
			updateSelectedItemBackground()
		}
	})
</script>

<svelte:window
	on:keydown={onWindowKeydown}
	on:resize={() => {
		instantBackgroundMove = true
		updateSelectedItemBackground()
	}}
/>

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
		<div class="selected-background" bind:this={selectedItemBackgroundEl} />
		{#each shownListItems as utility (utility.name)}
			<ListItem href={utility.href} icon={utility.icon}>{utility.name}</ListItem>
		{/each}
	</ul>
	<div class="credits">
		<p>
			<a href="//github.com/mat-1/web-utils">Source</a>
		</p>
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
		position: relative;
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

	.selected-background {
		user-select: none;
		border-radius: 0.25em;
		background-color: var(--background-color-alt-3);
		position: absolute;

		transition: transform 100ms ease-out;
	}
</style>
