<script lang="ts">
	import { extractData, supportedUuidTypes, uuidDatas } from '$lib/uuid'
	import type { UuidData } from '$lib/uuid'
	import Input from '$lib/Input.svelte'
	import Label from '$lib/Label.svelte'
	import Double from '$lib/containers/Double.svelte'
	import Part from '$lib/containers/Part.svelte'

	let userUuid: string
	let uuidData: Partial<UuidData> = {}
	let snowflakeEpoch: string
	let snowflakeEpochBigint: bigint | undefined
	$: {
		snowflakeEpoch
		snowflakeEpochBigint = snowflakeEpoch ? BigInt(snowflakeEpoch) : undefined
		if (userUuid) uuidData = extractData(userUuid, snowflakeEpochBigint)
	}

	$: if (userUuid !== undefined) uuidData = extractData(userUuid, snowflakeEpochBigint)

	$: shownDatas = uuidDatas
		.filter(({ key }) => key in uuidData)
		.map(({ name, key }) => ({
			name,
			value: (uuidData as any)[key],
		}))
</script>

<Double>
	<Part>
		<Input id="uuid-input" label="UUID" bind:value={userUuid} />
		{#if 'type' in uuidData}
			{#if uuidData.type === 'Snowflake'}
				<Label>Epoch</Label>
				<select name="epoch" bind:value={snowflakeEpoch}>
					<option value="1420070400000" selected={true}>Discord</option>
					<option value="1288834974657">Twitter</option>
				</select>
			{/if}
		{:else}
			<div class="supported-uuids">
				Supported UUIDs:
				<ul>
					{#each supportedUuidTypes as name}
						<li>{name}</li>
					{/each}
				</ul>
			</div>
		{/if}
	</Part>
	<Part>
		{#each shownDatas as { name, value }}
			<Label>{name}</Label>
			{#if name == 'Timestamp'}
				<p><a href="/datetime?date={value.toISOString()}">{value.toISOString()}</a></p>
			{:else}
				<p>{value}</p>
			{/if}
		{/each}
	</Part>
</Double>

<style>
	ul {
		margin: 0;
		padding-left: 1.5em;
	}
	.supported-uuids {
		opacity: 0.5;
	}
</style>
