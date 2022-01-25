export const uuidDatas: { name: string; key: string }[] = [
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

export interface UuidData {
	type: typeof uuidDatas[number]['key']
	timestamp?: Date
	workerId?: number
	processId?: number
	increment?: number
	mac?: string
}

export function uuid4(uuid: string): UuidData {
	return {
		type: 'UUID v4',
	}
}

export function uuid1(uuid: string): UuidData {
	const lowTime = uuid.substring(0, 8)
	const midTime = uuid.substring(8, 12)
	const highTime = uuid.substring(13, 16)
	const timestamp = Number(BigInt('0x' + highTime + midTime + lowTime) - 122192928000000000n)

	return {
		type: 'UUID v1',
		mac: uuid.substring(20).toUpperCase().match(/../g)?.join(':'),
		timestamp: new Date(timestamp / 10000),
	}
}

export function snowflake(uuid: bigint, snowflakeEpoch: bigint): UuidData {
	return {
		type: 'Snowflake',
		timestamp: snowflakeEpoch ? new Date(Number((uuid >> 22n) + snowflakeEpoch)) : undefined,
		workerId: Number((uuid & 0x3e0000n) >> 17n),
		processId: Number((uuid & 0x1f000n) >> 12n),
		increment: Number(uuid & 0xfffn),
	}
}

export function objectid(uuid: string): UuidData {
	const n = BigInt('0x' + uuid)
	return {
		type: 'ObjectID',
		timestamp: new Date(Number(n >> 64n) * 1000),
		processId: Number((n >> 24n) & 0xffffffffffn),
		increment: Number(n & 0xffffffn),
	}
}

export function extractData(uuid: string, snowflakeEpoch: bigint | undefined): Partial<UuidData> {
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
		return snowflake(uuidNumber, snowflakeEpoch ?? 0n) // idk just default to 0
	}
	return {}
}
