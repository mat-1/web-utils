<script lang="ts">
	import { extractData, uuidDatas } from '$lib/uuid'
	import type { UuidData } from '$lib/uuid'
	import Input from '$lib/Input.svelte'
	import Label from '$lib/Label.svelte'

	let userUuid: string | undefined
	let uuidData: Partial<UuidData> = {}
	let snowflakeEpoch: string
	let snowflakeEpochBigint: bigint | undefined
	$: {
		snowflakeEpoch
		snowflakeEpochBigint = snowflakeEpoch ? BigInt(snowflakeEpoch) : undefined
		if (userUuid) uuidData = extractData(userUuid, snowflakeEpochBigint)
	}

	$: if (userUuid) uuidData = extractData(userUuid, snowflakeEpochBigint)

	$: shownDatas = uuidDatas
		.filter(({ key }) => key in uuidData)
		.map(({ name, key }) => ({
			name,
			value: (uuidData as any)[key],
		}))
</script>

<div class="container">
	<div class="uuid-container">
		<Input id="uuid-input" label="UUID" bind:value={userUuid} />
		{#if 'type' in uuidData && uuidData.type === 'Snowflake'}
			<Label>Epoch</Label>
			<select name="epoch" bind:value={snowflakeEpoch}>
				<option value="1420070400000" selected={true}>Discord</option>
				<option value="1288834974657">Twitter</option>
			</select>
		{/if}
	</div>
	<div class="data-container">
		{#each shownDatas as { name, value }}
			<Label>{name}</Label>
			{#if name == 'Timestamp'}
				<p><a href="/datetime?date={value}">{value}</a></p>
			{:else}
				<p>{value}</p>
			{/if}
		{/each}
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

	.uuid-container,
	.data-container {
		margin: 0.5em;
	}

	p {
		margin: 0 0.25em;
	}
</style>
