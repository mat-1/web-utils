<script lang="ts">
	let _for: string
	export { _for as for }

	export let id: string | undefined = undefined
	// some elements can't be labelled normally, so we have to simulate the label with a span
	export let simulateLabel = false
</script>

{#if simulateLabel}
	<span class="label" {id} on:click={() => document.getElementById(_for).focus()}>
		<slot />
	</span>
{:else}
	<label class="label" for={_for} {id}><slot /></label>
{/if}

<style>
	.label {
		color: var(--text-color-alt);
		font-size: 0.8em;
		position: relative;
		height: max-content;
		margin-left: 0.5em;
		width: max-content;
	}
</style>
