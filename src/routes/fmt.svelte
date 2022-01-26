<script lang="ts">
	import { afterNavigate } from '$app/navigation'
	import Double from '$lib/containers/Double.svelte'
	import Part from '$lib/containers/Part.svelte'
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

	afterNavigate(({ from, to }) => {
		if (unformatted && !formatted) {
			updateFormatted()
		} else if (formatted && !unformatted) {
			updateUnformatted()
		}
	})
</script>

<Double>
	<Part>
		<CodeTextArea
			bind:value={unformatted}
			on:input={updateFormatted}
			id="unformatted-data"
			label="Unformatted"
		/>
	</Part>
	<Part>
		<CodeTextArea
			bind:value={formatted}
			on:input={updateUnformatted}
			id="formatted-data"
			label="Formatted"
		/>
	</Part>
</Double>
