<script lang="ts">
	import Single from '$lib/containers/Single.svelte'
	import Input from '$lib/Input.svelte'
	import { onMount } from 'svelte'
	import { b64decode, b64encode } from '$lib/utils'
	import Label from '$lib/Label.svelte'

	// this number is a string so it can be infinitely large
	let number = '0'
	let base2: string
	let base8: string
	let base10: string
	let base16: string
	let base64: string
	let utf8: string

	let baseNRadix = '62'
	let baseN: string

	const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/'
	const b64Alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
	let baseNAlphabet = b64Alphabet

	let highestBase = alphabet.length

	// https://stackoverflow.com/a/32480941
	function fromBase10(n: string, radix: number, toAlphabet: string): string {
		// if it's unary, repeat 0 n times
		if (radix === 1) {
			let parsedInt = parseInt(n)
			// we limit it at 300 to not lag the browser and because it looks big enough
			return parsedInt < 300 ? '0'.repeat(parsedInt) : '0'.repeat(300)
		}

		let decValue = BigInt(n)

		const toBaseBigint = BigInt(radix)
		toAlphabet = toAlphabet.slice(0, radix)

		let newValue = ''
		while (decValue > 0) {
			newValue = toAlphabet[Number(decValue % toBaseBigint)] + newValue
			decValue = (decValue - (decValue % toBaseBigint)) / toBaseBigint
		}
		return newValue || ''
	}
	function toBase10(n: string, radix: number, fromAlphabet: string): string {
		// if it's unary, return the length
		if (radix === 1) return n.length.toString()

		const fromBaseBigint = BigInt(radix)

		fromAlphabet = fromAlphabet.slice(0, radix)

		let decValue: bigint = n
			.split('')
			.reverse()
			.reduce((carry: bigint, digit: string, index: number) => {
				if (fromAlphabet.indexOf(digit) === -1)
					throw new Error(`Invalid digit '${digit}' for base ${radix}.`)
				const digitIndex = BigInt(fromAlphabet.indexOf(digit))
				return (carry += digitIndex * fromBaseBigint ** BigInt(index))
			}, 0n)
		return decValue.toString()
	}

	function updateBases() {
		base2 = fromBase10(number, 2, alphabet)
		base8 = fromBase10(number, 8, alphabet)
		base10 = fromBase10(number, 10, alphabet)
		base16 = fromBase10(number, 16, alphabet)
		base64 = fromBase10(number, 64, b64Alphabet)
		utf8 = b64decode(base64)
		if (baseNRadix !== '') baseN = fromBase10(number, parseInt(baseNRadix), baseNAlphabet)
	}

	const updateBase2 = () => {
		try {
			number = toBase10(base2, 2, alphabet)
		} catch (e) {
			console.error(e)
		}
		updateBases()
	}
	const updateBase8 = () => {
		try {
			number = toBase10(base8, 8, alphabet)
		} catch (e) {
			console.error(e)
		}
		updateBases()
	}
	const updateBase10 = () => {
		try {
			number = toBase10(base10, 10, alphabet)
		} catch (e) {
			console.error(e)
		}
		updateBases()
	}
	const updateBase16 = () => {
		try {
			number = toBase10(base16, 16, alphabet)
		} catch (e) {
			console.error(e)
		}
		updateBases()
	}
	const updateBase64 = () => {
		try {
			number = toBase10(base64.replace(/=/g, ''), 64, b64Alphabet)
		} catch (e) {
			console.error(e)
		}
		updateBases()
	}
	const updateUtf8 = () => {
		try {
			number = toBase10(b64encode(utf8).replace(/=/g, ''), 64, b64Alphabet)
		} catch (e) {
			console.error(e)
		}
		updateBases()
	}
	const updateBaseNRadix = () => {
		if (baseNRadix !== '' && isNaN(parseInt(baseNRadix))) baseNRadix = '1'
		if (parseInt(baseNRadix) < 1) baseNRadix = '1'
		if (parseInt(baseNRadix) > highestBase) baseNRadix = highestBase.toString()

		if (baseNRadix !== '') updateBases()
	}
	const updateBaseN = () => {
		try {
			number = toBase10(baseN, parseInt(baseNRadix), baseNAlphabet)
		} catch (e) {
			console.error(e)
		}
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

<Single>
	<Input id="base2" label="Base 2 ({getBaseName(2)})" bind:value={base2} on:input={updateBase2} />
	<Input id="base8" label="Base 8 ({getBaseName(8)})" bind:value={base8} on:input={updateBase8} />
	<Input
		id="base10"
		label="Base 10 ({getBaseName(10)})"
		bind:value={base10}
		on:input={updateBase10}
	/>
	<Input
		id="base16"
		label="Base 16 ({getBaseName(16)})"
		bind:value={base16}
		on:input={updateBase16}
	/>
	<Input
		id="base64"
		label="Base 64 ({getBaseName(64)})"
		bind:value={base64}
		on:input={updateBase64}
	/>
	<Input id="UTF-8" label="UTF-8" bind:value={utf8} on:input={updateUtf8} />
	<hr />
	<div class="base-n-container">
		<Input id="base-n" bind:value={baseN} on:input={updateBaseN} disabled={!baseNRadix}>
			<div slot="label">
				Base
				<Input id="baseNRadix" bind:value={baseNRadix} on:input={updateBaseNRadix} inline small />
				({getBaseName(parseInt(baseNRadix))})
			</div>
		</Input>
		<div>
			<Label for="base-n-alphabet">Character set</Label>
			<select
				id="base-n-alphabet"
				name="base-n-alphabet"
				bind:value={baseNAlphabet}
				on:change={updateBases}
			>
				<option value={b64Alphabet} selected={true}>Base64 (A-Z a-z 0-9)</option>
				<option value={alphabet}>0-9 a-z A-Z</option>
			</select>
		</div>
	</div>
</Single>

<style>
	.base-n-container {
		display: grid;
		grid-template-columns: 1fr auto;
		grid-gap: 0.5em;
	}
	@media (max-width: 600px) {
		.base-n-container {
			display: block;
		}
	}
</style>
