<!-- convert between time formats and timezones -->
<script lang="ts">
	import Double from '$lib/containers/Double.svelte'
	import { afterNavigate } from '$app/navigation'
	import Part from '$lib/containers/Part.svelte'
	import Label from '$lib/Label.svelte'
	import Input from '$lib/Input.svelte'

	let inputDate = ''
	let date: Date

	// parse it as an int (so it's treated as ms since epoch) if it has more than 5 digits
	$: date = new Date(/^\d{5,}$/.test(inputDate) ? parseInt(inputDate) : inputDate)

	afterNavigate(({ from, to }) => {
		if (to.searchParams.has('date')) inputDate = to.searchParams.get('date') ?? ''
	})
</script>

<Double>
	<Part>
		<Input id="date-input" label="Date" bind:value={inputDate} />
		<button
			on:click={() => {
				inputDate = new Date().toString()
			}}>Now</button
		>
	</Part>
	<Part>
		{#if !isNaN(date.getTime())}
			<Label>Milliseconds since epoch</Label>
			<p>{date.getTime()}</p>
			<Label>ISO 8601</Label>
			<p>{date.toISOString()}</p>
			<Label>UTC string</Label>
			<p>{date.toUTCString()}</p>
		{/if}
	</Part>
</Double>
