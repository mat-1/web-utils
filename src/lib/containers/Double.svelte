<!-- A container with two parts -->

<div class="container">
	<slot />
</div>

<style>
	/* stack the containers on top of each other */
	.container {
		display: grid;
		grid-auto-flow: column;
		grid-template-rows: 1fr;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		height: 100%;
		overflow: auto;
	}

	@media (max-width: 440px) {
		.container {
			grid-template-columns: 1fr;
			grid-template-rows: minmax(25%, auto) minmax(25%, auto);
		}
	}
	.container > * {
		grid-column: 1 / span 2;
	}
</style>
