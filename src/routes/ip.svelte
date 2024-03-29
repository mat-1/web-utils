<script lang="ts">
	import Input from '$lib/Input.svelte'
	import Label from '$lib/Label.svelte'
	import Double from '$lib/containers/Double.svelte'
	import Part from '$lib/containers/Part.svelte'

	let inputIp: string = ''

	const maxIpv6 = 2n ** 128n - 1n
	const maxIpv4 = 2n ** 32n - 1n

	function ipv4ToNumber(ip: string): number | null {
		if (!ip.includes('.')) {
			return Number(ip) ?? null
		}
		const parts = ip.split('.')
		if (parts.length === 2) return Number(parts[0]) * 256 * 256 * 256 + Number(parts[1])
		if (parts.length === 3)
			return Number(parts[0]) * 256 * 256 * 256 + Number(parts[1]) * 256 * 256 + Number(parts[2])
		// ok we can just do normal conversion if it's >= 4 parts
		let result = 0
		for (const part of parts) {
			result = result * 256 + Number(part)
		}
		return result
	}

	function ipToNumber(ip: string): bigint | null {
		if (ip.trim() === '') return null

		// support ipv4 and ipv6
		let ipNumber = 0n
		if (!ip.includes(':') && !ip.includes('.')) {
			try {
				return BigInt(ip) ?? null
			} catch (e) {
				return null
			}
		}
		const ipParts = ip.split(':')
		try {
			for (const ipPart of ipParts) {
				if (ipPart === '') {
					ipNumber = ipNumber * 65536n
					continue
				}

				if (ipPart.includes('.')) {
					const ipv4Number = ipv4ToNumber(ipPart)
					if (ipv4Number === null) return null
					ipNumber = ipNumber * 256n * 256n * 256n + BigInt(ipv4Number)
				} else {
					if (!/^[0-9a-fA-F]+$/.test(ipPart)) {
						throw new Error('Invalid IP')
					}
					ipNumber = ipNumber * 65536n + BigInt(parseInt(ipPart, 16))
				}
			}
		} catch (e) {
			console.error(e)
			return null
		}

		// impossibly big
		if (ipNumber > maxIpv6) {
			return null
		}

		return ipNumber
	}

	function numberToIpv4(num: number) {
		return [24, 16, 8, 0].map((shift) => (num >> shift) & 0xff).join('.')
	}
	function numberToIpv6(num: bigint) {
		let ipv6 = ''
		for (let i = 0; i < 8; i++) {
			ipv6 = ':' + (num & 0xffffn).toString(16) + ipv6
			num = num >> 16n
		}
		return ipv6.slice(1)
	}
	function numberToBinary(num: bigint) {
		// add spaces every byte
		let final = ''
		while (num > 0) {
			const byte = num & 0xffn
			num = num >> 8n
			final = byte.toString(2).padStart(8, '0') + ' ' + final
		}
		return final.trim() || '00000000'
	}

	$: inputIsRange = inputIp.includes('-') || inputIp.includes('/')

	$: numericIp = inputIsRange ? null : ipToNumber(inputIp)
	$: asIpv4 = numericIp !== null && numericIp <= maxIpv4 ? numberToIpv4(Number(numericIp)) : null
	$: asIpv6 = numericIp !== null ? numberToIpv6(numericIp) : null
	$: asBinary = numericIp !== null ? numberToBinary(numericIp) : null

	function parseCidr(cidr: string): [bigint, bigint] | null {
		const [ip, mask] = cidr.split('/')
		const ipNumber = ipToNumber(ip)
		console.log('cidr', ipNumber, mask)
		if (ipNumber === null) {
			return null
		}

		const isIpv6 = cidr.includes(':')

		const maskNumber = 2n ** BigInt((isIpv6 ? 128 : 32) - Number(mask)) - 1n
		const start = ipNumber & ~maskNumber
		const end = ipNumber | maskNumber
		return [start, end]
	}
	function parseRange(range: string): [bigint, bigint] | null {
		const [start, end] = range.split('-')
		const startNumber = ipToNumber(start.trim())
		const endNumber = ipToNumber(end.trim())
		if (startNumber === null || endNumber === null) {
			return null
		}
		return [startNumber, endNumber]
	}
	function rangeToIpv4Cidr(start: bigint, end: bigint): string | null {
		const mask = 32 - Math.log2(Number(end - start + 1n))
		if (mask % 1 !== 0) {
			return null
		}
		return `${numberToIpv4(Number(start))}/${mask}`
	}
	function rangeToIpv6Cidr(start: bigint, end: bigint): string | null {
		const mask = 128 - Math.log2(Number(end - start + 1n))
		if (mask % 1 !== 0) {
			return null
		}
		return `${numberToIpv6(start)}/${mask}`
	}

	$: [startNumber, endNumber] = inputIsRange
		? (inputIp.includes('/') ? parseCidr(inputIp) : parseRange(inputIp)) ?? [null, null]
		: [null, null]
	$: startIpv4 =
		startNumber !== null && startNumber <= maxIpv4 ? numberToIpv4(Number(startNumber)) : null
	$: startIpv6 = startNumber !== null ? numberToIpv6(startNumber) : null
	$: endIpv4 = endNumber !== null && endNumber <= maxIpv4 ? numberToIpv4(Number(endNumber)) : null
	$: endIpv6 = endNumber !== null ? numberToIpv6(endNumber) : null
	$: asIpv4Cidr =
		startNumber !== null && endNumber !== null ? rangeToIpv4Cidr(startNumber, endNumber) : null
	$: asIpv6Cidr =
		startNumber !== null && endNumber !== null ? rangeToIpv6Cidr(startNumber, endNumber) : null
</script>

<Double>
	<Part>
		<Input id="ip-input" label="IP or range" bind:value={inputIp} />
	</Part>
	<Part>
		{#if inputIsRange}
			<Label>IPv4</Label>
			<p>{startIpv4}-{endIpv4}</p>
			<Label>IPv6</Label>
			<p>{startIpv6}-{endIpv6}</p>
			<Label>Number</Label>
			<p>{startNumber}-{endNumber}</p>
			{#if asIpv4Cidr}
				<Label>IPv4 CIDR</Label>
				<p>{asIpv4Cidr}</p>
			{/if}
			{#if asIpv6Cidr}
				<Label>IPv6 CIDR</Label>
				<p>{asIpv6Cidr}</p>
			{/if}
			{#if endNumber !== null && startNumber !== null}
				<Label>Count</Label>
				<p>{endNumber - startNumber + 1n}</p>
			{/if}
		{:else if numericIp !== null}
			<Label>Type</Label>
			<p>
				{inputIp.includes(':') ? 'IPv6' : inputIp.includes('.') ? 'IPv4' : 'Number'}
			</p>
			{#if asIpv4}
				<Label>IPv4</Label>
				<p>{asIpv4}</p>
			{/if}
			<Label>IPv6</Label>
			<p>{asIpv6}</p>
			<Label>Number</Label>
			<p>{numericIp}</p>
			<Label>Binary</Label>
			<p>{asBinary}</p>
		{/if}
	</Part>
</Double>
