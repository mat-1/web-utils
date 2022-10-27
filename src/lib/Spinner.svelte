<div class="spinner" />

<style>
	.spinner {
		display: inline-block;
		width: 1em;
		height: 1em;
		border: 2px solid var(--text-color-alt);
		border-radius: 50%;
		border-top-color: transparent;
		animation: spin 0.6s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
