<script lang="ts">
	export let arialabel: string
</script>

<button on:click aria-label={arialabel}>
	<slot />
</button>

<style>
	button {
		border: none;
		background: none;
		font-size: inherit;
		padding: 0;
		margin: 0;
		color: var(--text-color-alt);
		line-height: 0;
	}
</style>
