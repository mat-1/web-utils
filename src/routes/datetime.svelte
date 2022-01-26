<!-- convert between time formats and timezones -->
<script lang="ts">
	import Label from '$lib/Label.svelte'
	import Input from '$lib/Input.svelte'
	import { browser } from '$app/env'
	import { afterNavigate } from '$app/navigation'

	let inputDate = ''
	let date: Date

	// parse it as an int (so it's treated as ms since epoch) if it has more than 5 digits
	$: date = new Date(/^\d{5,}$/.test(inputDate) ? parseInt(inputDate) : inputDate)

	afterNavigate(({ from, to }) => {
		if (to.searchParams.has('date'))
			inputDate = to.searchParams.get('date') ?? ''
	})
</script>

<div class="container">
	<div class="string-container">
		<Input id="date-input" label="Date" bind:value={inputDate} />
		<button on:click={() => { inputDate = new Date().toString() }}>Now</button>
	</div>
	<div class="data-container">
		{#if !isNaN(date.getTime())}
			<Label>Milliseconds since epoch</Label>
			<p>{date.getTime()}</p>
			<Label>ISO 8601</Label>
			<p>{date.toISOString()}</p>
			<Label>UTC string</Label>
			<p>{date.toUTCString()}</p>
		{/if}
	</div>
</div>

<style>
	/* stack the containers on top of each other */
	.container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		height: 100%;
	}

	@media (max-width: 440px) {
		.container {
			grid-template-columns: 1fr;
			grid-template-rows: 1fr 1fr;
		}
	}

	.string-container,
	.data-container {
		margin: 0.5em;
		overflow: hidden;
		overflow-wrap: break-word;
	}

	p {
		margin: 0;
	}
</style>
