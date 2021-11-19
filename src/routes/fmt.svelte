<script lang="ts">
	import CodeTextArea from '$lib/TextArea/Code.svelte'

	let unformatted: string
	let formatted: string

	enum DataFormat {
		Json,
	}

	let formatType: DataFormat

	function identifyFormat(data: string) {
		return DataFormat.Json
	}

	function formatData(data: string, format: DataFormat) {
		try {
			switch (format) {
				case DataFormat.Json:
					return JSON.stringify(JSON.parse(data), null, '\t')
			}
		} catch {
			return ''
		}
	}
	function unformatData(data: string, format: DataFormat) {
		try {
			switch (format) {
				case DataFormat.Json:
					return JSON.stringify(JSON.parse(data))
			}
		} catch {
			return ''
		}
	}

	function updateFormatted() {
		formatType = identifyFormat(unformatted)
		formatted = formatData(unformatted, formatType)
	}

	function updateUnformatted() {
		formatType = identifyFormat(formatted)
		unformatted = unformatData(formatted, formatType)
	}
</script>

<div class="container">
	<div class="unformatted-container">
		<CodeTextArea
			bind:value={unformatted}
			on:input={updateFormatted}
			id="unformatted-data"
			label="Unformatted"
		/>
	</div>
	<div class="formatted-container">
		<CodeTextArea
			bind:value={formatted}
			on:input={updateUnformatted}
			id="formatted-data"
			label="Formatted"
		/>
	</div>
</div>

<style>
	/* stack the containers on top of each other */
	.container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		height: 100%;
	}

	@media (max-width: 440px) {
		.container {
			grid-template-columns: 1fr;
			grid-template-rows: 1fr 1fr;
		}
	}

	.unformatted-container,
	.formatted-container {
		margin: 0.5em;
	}
</style>
