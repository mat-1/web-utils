<script lang="ts">
	import Input from '$lib/Input.svelte'
	import { onMount } from 'svelte'

	// this number is a string so it can be infinitely large
	let number = '0'
	let base2: string
	let base8: string
	let base10: string
	let base12: string
	let base16: string

	let baseNRadix = ''
	let baseN: string

	
	const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/'.split('')
	let highestBase = alphabet.length
	
	// https://stackoverflow.com/a/32480941

	function fromBase10(n: string, radix: number): string {
		// if it's unary, repeat 0 n times
		if (radix === 1) {
			let parsedInt = parseInt(n)
			// we limit it at 300 to not lag the browser and because it looks big enough
			return parsedInt < 300 ? '0'.repeat(parsedInt) : '0'.repeat(300)
		}

		let decValue = BigInt(n)

		const toBaseBigint = BigInt(radix)
		const toAlphabet = alphabet.slice(0, radix)

		let newValue = ''
		while (decValue > 0) {
			newValue = toAlphabet[Number(decValue % toBaseBigint)] + newValue
			decValue = (decValue - (decValue % toBaseBigint)) / toBaseBigint
		}
		return newValue || '0'
	}
	function toBase10(n: string, radix: number): string {
		// let parsedInt = parseInt(n, radix)

		// // if it's unary, return the length
		if (radix === 1) return n.length.toString()

		const fromBaseBigint = BigInt(radix)

		const fromAlphabet = alphabet.slice(0, radix)

		let decValue: bigint = n
			.split('')
			.reverse()
			.reduce((carry: bigint, digit: string, index: number) => {
				if (fromAlphabet.indexOf(digit) === -1)
					throw new Error(`Invalid digit '${digit}' for base ${radix}.`)
				const digitIndex = BigInt(fromAlphabet.indexOf(digit))
				return carry += digitIndex * (fromBaseBigint ** BigInt(index))
			}, 0n)
		return decValue.toString()

		// if (isNaN(parsedInt)) parsedInt = 0
		// return parsedInt.toString()
	}

	function updateBases() {
		base2 = fromBase10(number, 2)
		base8 = fromBase10(number, 8)
		base10 = fromBase10(number, 10)
		base12 = fromBase10(number, 12)
		base16 = fromBase10(number, 16)
		if (baseNRadix !== '') baseN = fromBase10(number, parseInt(baseNRadix))
	}

	const updateBase2 = () => {
		number = toBase10(base2, 2)
		updateBases()
	}
	const updateBase8 = () => {
		number = toBase10(base8, 8)
		updateBases()
	}
	const updateBase10 = () => {
		number = toBase10(base10, 10)
		updateBases()
	}
	const updateBase12 = () => {
		number = toBase10(base12, 12)
		updateBases()
	}
	const updateBase16 = () => {
		number = toBase10(base16, 16)
		updateBases()
	}
	const updateBaseNRadix = () => {
		if (baseNRadix !== '' && isNaN(parseInt(baseNRadix))) baseNRadix = '1'
		if (parseInt(baseNRadix) < 1) baseNRadix = '1'
		if (parseInt(baseNRadix) > highestBase) baseNRadix = highestBase.toString()

		if (baseNRadix !== '') updateBases()
	}
	const updateBaseN = () => {
		number = toBase10(baseN, parseInt(baseNRadix))
		updateBases()
	}

	updateBases()
	onMount(() => (number = base10))

	// https://www.seximal.net/names-of-other-bases
	function getBaseName(base: number): string | null {
		return (
			[
				'unary',
				'binary',
				'trinary',
				'quaternary',
				'quinary',
				'seximal',
				'septimal',
				'octal',
				'nonary',
				'decimal',
				'elevenary',
				'dozenal',
				"baker's dozenal",
				'biseptimal',
				'triquinary',
				'hex',
				'suboptimal',
				'triseximal',
				'untriseximal',
				'vigesimal',
				'triseptimal',
				'bielevenary',
				'unbielevenary',
				'tetraseximal',
				'pentaquinary',
				"biker's dozenal",
				'trinonary',
				'tetraseptimal',
				'untetraseptimal',
				'pentaseximal',
				'unpentaseximal',
				'tetroctal',
				'trielevenary',
				'bisuboptimal',
				'pentaseptimal',
				'unpentaseptimal',
				'niftimal',
				'unniftimal',
				'bintriseximal',
				"triker's dozenal",
				'pentoctal',
				'unpentoctal',
				'hexaseptimal',
				'unhexaseptimal',
				'tetrelevenary',
				'pentanonary',
				'binbielevenary',
				'unbinbielevenary',
				'hexoctal',
				'heptaseptimal',
				'pentagesimal',
				'trisuboptimal',
				"tetraker's dozenal",
				"untetraker's dozenal",
				'hexanonary',
				'pentelevenary',
				'heptoctal',
				'trintriseximal',
				'bintetraseptimal',
				'unbintetraseptimal',
				'hexagesimal',
				'unhexagesimal',
				'binpentaseximal',
				'heptanonary',
				'octoctal',
			][base - 1] ?? null
		)
	}
</script>

<div class="container">
	<Input id="base2" label="Base 2 ({getBaseName(2)})" bind:value={base2} on:input={updateBase2} />
	<Input id="base8" label="Base 8 ({getBaseName(8)})" bind:value={base8} on:input={updateBase8} />
	<Input
		id="base10"
		label="Base 10 ({getBaseName(10)})"
		bind:value={base10}
		on:input={updateBase10}
	/>
	<Input
		id="base12"
		label="Base 12 ({getBaseName(12)})"
		bind:value={base12}
		on:input={updateBase12}
	/>
	<Input
		id="base16"
		label="Base 16 ({getBaseName(16)})"
		bind:value={base16}
		on:input={updateBase16}
	/>
	<hr />
	<Input
		id="baseNRadix"
		label="Custom Base Radix"
		bind:value={baseNRadix}
		on:input={updateBaseNRadix}
	/>
	{#if baseNRadix}
		<Input
			id="baseN"
			label="Base {baseNRadix} ({getBaseName(parseInt(baseNRadix))})"
			bind:value={baseN}
			on:input={updateBaseN}
		/>
	{/if}
</div>

<style>
	.container {
		height: 100%;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		margin: 0.5em;
	}
</style>
