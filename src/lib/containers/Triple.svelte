<!-- A container with three parts -->

<div class="container">
	<slot />
</div>

<style>
	.container {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
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
			grid-template-columns: 1fr 1fr;
			grid-template-rows: 1fr 1fr;
		}
		.container :global(:nth-child(3)) {
			grid-column: 1 / span 2;
		}
	}
</style>
