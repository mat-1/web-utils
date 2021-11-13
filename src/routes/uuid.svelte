<script lang="ts">
	import Input from '$lib/Input.svelte'
	import Label from '$lib/Label.svelte'

	interface UuidData {
		type: typeof uuidDatas[number]['key']
		timestamp?: Date
		workerId?: number
		processId?: number
		increment?: number
		mac?: string
	}

	let userUuid: string | undefined
	let uuidData: Partial<UuidData> = {}
	let snowflakeEpoch: string
	$: {
		snowflakeEpoch
		if (userUuid) uuidData = extractData(userUuid)
	}

	$: if (userUuid) uuidData = extractData(userUuid)

	function uuid4(uuid: string): UuidData {
		return {
			type: 'UUID v4',
		}
	}
	function uuid1(uuid: string): UuidData {
		let lowTime = uuid.substring(0, 8)
		let midTime = uuid.substring(8, 12)
		let highTime = uuid.substring(13, 16)
		let timestamp = Number(BigInt('0x' + highTime + midTime + lowTime) - 122192928000000000n)

		return {
			type: 'UUID v1',
			mac: uuid.substring(20).toUpperCase().match(/../g)?.join(':'),
			timestamp: new Date(timestamp / 10000),
		}
	}

	function snowflake(uuid: bigint): UuidData {
		return {
			type: 'Snowflake',
			timestamp: snowflakeEpoch
				? new Date(Number((uuid >> 22n) + BigInt(snowflakeEpoch)))
				: undefined,
			workerId: Number((uuid & 0x3e0000n) >> 17n),
			processId: Number((uuid & 0x1f000n) >> 12n),
			increment: Number(uuid & 0xfffn),
		}
	}
	function objectid(uuid: string): UuidData {
		const n = BigInt('0x' + uuid)
		return {
			type: 'ObjectID',
			timestamp: new Date(Number(n >> 64n) * 1000),
			processId: Number((n >> 24n) & 0xffffffffffn),
			increment: Number(n & 0xffffffn),
		}
	}

	function extractData(uuid: string): Partial<UuidData> {
		uuid = uuid.replace(/-/g, '')
		// standard uuid
		if (uuid.match(/^[0-9a-f]{32}$/i))
			switch (uuid.charAt(12).toLowerCase()) {
				case '1':
					return uuid1(uuid)
				case '4':
					return uuid4(uuid)
			}
		else if (uuid.match(/^[0-9a-f]{24}$/i)) {
			// mongodb objectid
			return objectid(uuid)
		}

		let uuidNumber: bigint | undefined
		try {
			uuidNumber = BigInt(uuid)
		} catch (e) {
			// not a big int
		}
		if (uuidNumber && uuidNumber >= 2 ** 21 && uuidNumber <= 2 ** 63) {
			return snowflake(uuidNumber)
		}
		return {}
	}

	const uuidDatas: { name: string; key: string }[] = [
		{
			name: 'Type',
			key: 'type',
		},
		{
			name: 'Timestamp',
			key: 'timestamp',
		},
		{
			name: 'Worker ID',
			key: 'workerId',
		},
		{
			name: 'Process ID',
			key: 'processId',
		},
		{
			name: 'Increment',
			key: 'increment',
		},
		{
			name: 'MAC Address',
			key: 'mac',
		},
	]

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
			<p>{value}</p>
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
