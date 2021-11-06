<script lang="ts">
	import UtilitiesList from '$lib/UtilitiesList.svelte'
	import '../app.css'
</script>

<div id="page">
	<nav>
		<UtilitiesList />
	</nav>

	<main>
		<slot />
	</main>
</div>

<style>
	#page {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		--sidebar-width: 15em;
	}

	nav {
		background: var(--background-color-alt);
		width: var(--sidebar-width);
		height: 100%;
		position: fixed;
	}

	main {
		margin-left: var(--sidebar-width);
		padding: 1em;
		min-height: 100vh;
		position: relative;
	}
</style>
