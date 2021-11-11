<script lang="ts">
	import Input from '$lib/Input.svelte'
	import Label from '$lib/Label.svelte'
	import { b64decode, b64encode } from '$lib/utils'

	interface UuidData {
		type: string
		timestamp?: Date
		workerId?: number
		processId?: number
		increment?: number
		mac?: string
	}

	let userUuid: string | undefined
	let uuidData: UuidData | {} = {}

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
			mac: uuid.substring(20).toUpperCase().match(/../g).join(':'),
			timestamp: new Date(timestamp / 10000)
		}
	}

	
	function snowflake(uuid: BigInt): UuidData {
		return {
			type: 'Snowflake',
			timestamp: new Date(Number(uuid >> 22n) + 1420070400000),
			workerId: Number((uuid & 0x3E0000n) >> 17n),
			processId: Number((uuid & 0x1F000n) >> 12n),
			increment: Number(uuid & 0xFFFn)
		}
	}
	function objectid(uuid: string): UuidData {
		const n = BigInt('0x' + uuid)
		return {
			type: 'ObjectID',
			timestamp: new Date(Number(n >> 64n) * 1000),
			processId: Number((n >> 24n) & 0xFFFFFFFFFFn),
			increment: Number(n & 0xFFFFFFn),
		}
	}

	function extractData(uuid: string): UuidData {
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

		let uuidNumber: BigInt | null
		try {
			uuidNumber = BigInt(uuid)
		} catch (e) {
			// not a big int
		}
		console.log(uuidNumber)
		if (uuidNumber >= (2 ** 21) && uuidNumber <= (2 ** 63)) {
			return snowflake(uuidNumber)
			}
		return {}
	}

	const uuidDatas = [
		{
			name: 'Type',
			key: 'type'
		},
		{
			name: 'Timestamp',
			key: 'timestamp'
		},
		{
			name: 'Worker ID',
			key: 'workerId'
		},
		{
			name: 'Process ID',
			key: 'processId'
		},
		{
			name: 'Increment',
			key: 'increment'
		},
		{
			name: 'MAC Address',
			key: 'mac'
		}
	]
</script>

<div class="container">
	<div class="uuid-container">
		<Input id="uuid-input" label="UUID" bind:value={userUuid} />
	</div>
	<div class="data-container">
		{#each uuidDatas as d}
			{#if uuidData[d.key] !== undefined}
				<Label>{d.name}</Label>
				<p>{uuidData[d.key]}</p>
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
	.error {
		color: #e44;
		font-weight: bold;
		font-size: 1.1em;
		margin-top: 1em;
	}

	p {
		margin: 0 0.25em;
	}
</style>
