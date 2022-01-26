<!-- A container that only holds one set of things -->

<div class="container">
	<slot />
</div>

<style>
	.container {
		height: 100%;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		margin: 0.5em;
	}
</style>
