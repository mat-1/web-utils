<script lang="ts">
	import { extractData, supportedUuidTypes, uuidDatas } from '$lib/uuid'
	import type { UuidData } from '$lib/uuid'
	import Input from '$lib/Input.svelte'
	import Label from '$lib/Label.svelte'
	import Double from '$lib/containers/Double.svelte'
	import Part from '$lib/containers/Part.svelte'

	let floatInput: string
</script>

<Double>
	<Part>
		<Input id="float-input" label="Floating point number" bind:value={floatInput} />
	</Part>
	<Part>a</Part>
</Double>
