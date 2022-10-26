<script lang="ts">
	import { onMount } from 'svelte'

	let dayOfMonth = 0
	onMount(() => {
		dayOfMonth = new Date().getDate()
	})
</script>

<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
	<!-- box with rounded corners -->
	<path
		d="
		M12,4
		H52
		a8,8 0 0 1 8,8
		V50
		a8,8 0 0 1 -8,8
		H12
		a8,8 0 0 1 -8,-8
		V12
		a8,8 0 0 1 8,-8
		Z
	"
	/>
	<path
		d="
		M6, 16
		h56
	"
	/>
	{#if dayOfMonth}
		<text x="32" y="48">{dayOfMonth}</text>
	{/if}
</svg>

<style>
	text {
		font: 100 32px sans-serif;
		stroke-width: 3px;
		text-anchor: middle;
		letter-spacing: 2px;
	}
</style>
