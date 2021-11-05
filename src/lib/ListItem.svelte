<script lang="ts">
	export let href: string | undefined
</script>

{#if href}
<a {href}><li><slot /></li></a>
{:else}
<li><slot /></li>
{/if}
