<script lang="ts">
	import Input from '$lib/Input.svelte'
	import { onMount } from 'svelte'
	import { b64decode, b64encode } from '$lib/utils'
	import Label from '$lib/Label.svelte'
	import IconButton from '$lib/IconButton.svelte'
	import Part from '$lib/containers/Part.svelte'
	import Double from '$lib/containers/Double.svelte'
	import { quintOut } from 'svelte/easing'
	import { crossfade } from 'svelte/transition'
	import { flip } from 'svelte/animate'

	let number: bigint = 0n

	let lastModifiedBaseId: BaseItem['id'] | undefined = undefined

	const charset = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/'
	const b64charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
	let baseNcharset = b64charset

	let highestBase = charset.length

	type BaseItem =
		| {
				id: string
				base: `${number}` | ''
				value: string
				charset: string
				modifiable?: boolean
		  }
		| {
				id: string
				base: 'utf8'
				value: string
		  }

	let baseId = 0
	function newBaseId(): number {
		return baseId++
	}

	const bases: BaseItem[] = [
		{
			id: 'base2',
			base: '2',
			value: '',
			charset,
		},
		{
			id: 'base8',
			base: '8',
			value: '',
			charset,
		},
		{
			id: 'base10',
			base: '10',
			value: '',
			charset,
		},
		{
			id: 'base16',
			base: '16',
			value: '',
			charset,
		},
		{
			id: 'base64',
			base: '64',
			value: '',
			charset: b64charset,
		},
		{
			id: 'utf8',
			base: 'utf8',
			value: '',
		},
		{
			id: 'n',
			base: '62',
			value: '',
			modifiable: true,
			charset,
		},
	]

	interface Charset {
		name: string
		chars: string
	}

	const charsets: Charset[] = [
		{
			name: 'Normal (0-9 a-z A-Z)',
			chars: charset,
		},
		{
			name: 'Base64 (A-Z a-z 0-9)',
			chars: b64charset,
		},
		{
			name: 'a-z A-Z 0-9',
			chars: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/',
		},
		{
			name: '0-9 A-Z a-z',
			chars: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/',
		},
	]

	// https://stackoverflow.com/a/32480941
	function fromBase10(n: bigint, radix: number, tocharset: string): string {
		// if it's unary, repeat 0 n times
		if (radix === 1) {
			// we limit it at 300 to not lag the browser and because it looks big enough
			return n < 300 ? '0'.repeat(Number(n)) : '0'.repeat(300)
		}

		let decValue = n

		const toBaseBigint = BigInt(radix)
		tocharset = tocharset.slice(0, radix)

		let newValue = ''
		while (decValue > 0) {
			newValue = tocharset[Number(decValue % toBaseBigint)] + newValue
			decValue = (decValue - (decValue % toBaseBigint)) / toBaseBigint
		}
		return newValue || ''
	}
	function toBase10(n: string, radix: number, fromcharset: string): bigint {
		// if it's unary, return the length
		if (radix === 1) return BigInt(n.toString().length)

		const fromBaseBigint = BigInt(radix)

		fromcharset = fromcharset.slice(0, radix)

		let decValue: bigint = n
			.split('')
			.reverse()
			.reduce((carry: bigint, digit: string, index: number) => {
				if (fromcharset.indexOf(digit) === -1)
					throw new Error(`Invalid digit '${digit}' for base ${radix}.`)
				const digitIndex = BigInt(fromcharset.indexOf(digit))
				return (carry += digitIndex * fromBaseBigint ** BigInt(index))
			}, 0n)
		return decValue
	}

	function updateBases() {
		for (const base of bases) {
			if (base.base === 'utf8') base.value = b64decode(fromBase10(number, 64, b64charset))
			else base.value = fromBase10(number, Number(base.base), base.charset)
		}
	}

	const updateBase = (base: BaseItem) => {
		lastModifiedBaseId = base.id
		try {
			if (base.base === 'utf8')
				number = toBase10(b64encode(base.value).replace(/=/g, ''), 64, b64charset)
			else number = toBase10(base.value, Number(base.base), base.charset)
		} catch (e) {
			console.error(e)
		}
		updateBases()
	}

	const updateBaseNRadix = (base: BaseItem) => {
		if (base.base === '') {
		} else if (isNaN(parseInt(base.base))) base.base = ''
		else if (Number(base.base) < 1) base.base = '1'
		else if (Number(base.base) > highestBase) base.base = highestBase.toString() as any

		if (base.base !== '') updateBases()
	}

	let expandedBaseId: string | undefined = undefined
	function expandBase(base: BaseItem) {
		if (expandedBaseId === base.id) expandedBaseId = undefined
		else expandedBaseId = base.id
	}

	updateBases()

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

	onMount(() => (number = BigInt(bases.find((b) => b.id === 'base10')!.value)))

	const [send, receive] = crossfade({
		duration: (d) => Math.sqrt(d * 200),

		fallback(node, params) {
			const style = getComputedStyle(node)
			const transform = style.transform === 'none' ? '' : style.transform

			return {
				duration: 600,
				easing: quintOut,
				css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`,
			}
		},
	})
</script>

<Double>
	<Part>
		{#each bases.filter((b) => b.id !== expandedBaseId) as base (base.id)}
			<div
				class="base-container"
				in:receive={{ key: base.id }}
				out:send={{ key: base.id }}
				animate:flip
			>
				<Input id={base.id} bind:value={base.value} on:input={() => updateBase(base)}>
					<div slot="label">
						{#if base.base !== 'utf8'}
							Base
							{#if base.modifiable}
								<Input
									id="{base.id}-radix"
									bind:value={base.base}
									on:input={() => updateBaseNRadix(base)}
									inline
									small
								/>
							{:else}
								{base.base}
							{/if}
							({getBaseName(Number(base.base))})
						{:else if base.base === 'utf8'}
							UTF-8
						{/if}
						<IconButton arialabel="Expand" on:click={() => expandBase(base)}>⛶</IconButton>
					</div>
				</Input>

				{#if base.base !== 'utf8' && base.modifiable}
					<div>
						<Label for="base-n-charset">Character set</Label>
						<select
							id="base-n-charset"
							name="base-n-charset"
							bind:value={baseNcharset}
							on:change={lastModifiedBaseId === 'n' ? () => updateBase(base) : updateBases}
						>
							{#each charsets as charset}
								<option value={charset.chars}>{charset.name}</option>
							{/each}
						</select>
					</div>
				{/if}
			</div>
		{/each}
	</Part>
	{#if expandedBaseId}
		<Part>
			{#each bases.filter((b) => b.id === expandedBaseId) as base (base.id)}
				<div
					class="base-container"
					in:receive={{ key: base.id }}
					out:send={{ key: base.id }}
					animate:flip
				>
					<Input id={base.id} bind:value={base.value} on:input={() => updateBase(base)}>
						<div slot="label">
							{#if base.base !== 'utf8'}
								Base
								{#if base.modifiable}
									<Input
										id="{base.id}-radix"
										bind:value={base.base}
										on:input={() => updateBaseNRadix(base)}
										inline
										small
									/>
								{:else}
									{base.base}
								{/if}
								({getBaseName(Number(base.base))})
							{:else if base.base === 'utf8'}
								UTF-8
							{/if}
							<IconButton arialabel="Expand" on:click={() => expandBase(base)}>⛶</IconButton>
						</div>
					</Input>

					{#if base.base !== 'utf8' && base.modifiable}
						<div>
							<Label for="base-n-charset">Character set</Label>
							<select
								id="base-n-charset"
								name="base-n-charset"
								bind:value={baseNcharset}
								on:change={lastModifiedBaseId === 'n' ? () => updateBase(base) : updateBases}
							>
								{#each charsets as charset}
									<option value={charset.chars}>{charset.name}</option>
								{/each}
							</select>
						</div>
					{/if}
				</div>
			{/each}
		</Part>
	{/if}
</Double>

<style>
	.base-container {
		display: grid;
		/* grid-auto-flow: column; */
		grid-template-columns: 1fr auto;
		grid-gap: 0.5em;
		width: 100%;
	}
	/* .base-container :nth-child(2) {
		grid-column: 1 / span 2;
	} */
	/* @media (max-width: 600px) {
		.base-n-container {
			display: block;
		}
	} */
</style>
