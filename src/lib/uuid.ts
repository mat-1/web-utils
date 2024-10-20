export const uuidDatas: { name: string; key: string }[] = [
	{
		name: 'Type',
		key: 'type',
	},
	{
		name: 'Variant',
		key: 'variant',
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
	{
		name: 'Clock Sequence',
		key: 'clockSeq',
	},
	{
		name: 'Node',
		key: 'node',
	},
	{
		name: 'Local Domain',
		key: 'localDomain',
	},
	{
		name: 'Local Domain Number',
		key: 'localDomainNumber',
	},
	{
		name: 'MD5',
		key: 'md5',
	},
]
export const supportedUuidTypes = [
	'UUID v1',
	'UUID v2',
	'UUID v3',
	'UUID v4',
	'Snowflake',
	'ObjectID',
] as const

export interface UuidData {
	type: typeof supportedUuidTypes[number]
	variant?: string

	timestamp?: Date
	workerId?: number
	processId?: number
	increment?: number
	mac?: string

	// uuidv1, uuidv2
	clockSeq?: number
	node?: string

	// uuidv2
	localDomain?: number
	localDomainNumber?: number

	md5?: string
}

export function uuid1(uuid: string): UuidData {
	const uuidInt = BigInt('0x' + uuid)

	// inclusive..exclusive
	function readBits(start: number, end: number): bigint {
		return (uuidInt >> BigInt(128 - end)) & ((1n << BigInt(end - start)) - 1n)
	}

	const lowTime = readBits(0, 32)
	const midTime = readBits(32, 48)
	const highTime = readBits(52, 64)

	const clockSeq = Number(readBits(66, 80))
	const node = readBits(80, 128).toString(16).padStart(12, '0')

	const variant = parseUuidVariant(uuid)
	const timestamp = Number((highTime << 48n) + (midTime << 32n) + lowTime - 122192928000000000n)

	return {
		type: 'UUID v1',
		mac: uuid.substring(20).toUpperCase().match(/../g)?.join(':'),
		timestamp: new Date(timestamp / 10000),
		variant,
		clockSeq,
		node,
	}
}

// https://playfulprogramming.com/posts/what-happened-to-uuid-v2
export function uuid2(uuid: string): UuidData {
	const uuidInt = BigInt('0x' + uuid)

	// inclusive..exclusive
	function readBits(start: number, end: number): bigint {
		return (uuidInt >> BigInt(128 - end)) & ((1n << BigInt(end - start)) - 1n)
	}

	const localDomainNumber = Number(readBits(0, 32))
	const midTime = readBits(32, 48)
	const highTime = readBits(52, 64)

	const clockSeq = Number(readBits(66, 72))
	const localDomain = Number(readBits(72, 80))
	const node = readBits(80, 128).toString(16).padStart(12, '0')

	const variant = parseUuidVariant(uuid)
	const timestamp = Number((highTime << 48n) + (midTime << 32n) - 122192928000000000n)

	return {
		type: 'UUID v2',
		mac: uuid.substring(20).toUpperCase().match(/../g)?.join(':'),
		timestamp: new Date(timestamp / 10000),
		variant,
		clockSeq,
		node,

		localDomain,
		localDomainNumber,
	}
}

export function uuid3(uuid: string): UuidData {
	const uuidInt = BigInt('0x' + uuid)

	// inclusive..exclusive
	function readBits(start: number, end: number): bigint {
		return (uuidInt >> BigInt(128 - end)) & ((1n << BigInt(end - start)) - 1n)
	}

	const md5High = readBits(0, 48)
	const md5Mid = readBits(52, 64)
	const md5Low = readBits(66, 128)

	const variant = parseUuidVariant(uuid)

	const md5LowTop2 = md5Low >> 62n

	const md5HighString = md5High.toString(16).padStart(12, '0')
	const md5MidString = md5Mid.toString(16).padStart(3, '0')
	const md5LowString = (md5Low >> 2n).toString(16).padStart(15, '0')

	// like "0123", "4567", "89ab", "cdef"
	let md5Top2Possibilities = ['048c', '159d', '26ae', '37bf'][Number(md5LowTop2)]

	const md5 = `${md5HighString}.${md5MidString}[${md5Top2Possibilities}]${md5LowString}`

	return {
		type: 'UUID v3',
		variant,
		md5,
	}
}

export function uuid4(uuid: string): UuidData {
	const variant = parseUuidVariant(uuid)

	return {
		type: 'UUID v4',
		variant,
	}
}

function parseUuidVariant(uuid: string): string {
	const variantNibble = parseInt(uuid.charAt(16), 16)
	const msb0 = variantNibble & 0b1000
	const msb1 = variantNibble & 0b0100
	const msb2 = variantNibble & 0b0010

	if (!msb0) return 'Reserved for Network Computing System compatibility'
	else if (!msb1) return 'Normal'
	else if (!msb2) return 'Reserved for Microsoft compatibility'
	return 'Reserved for future use'
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
			case '2':
				return uuid2(uuid)
			case '3':
				return uuid3(uuid)
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
