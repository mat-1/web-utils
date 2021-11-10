<script lang="ts">
	import Input from '$lib/Input.svelte'

	// this number is a string so it can be infinitely large
	let number = 'a'

	function fromBase10(n: string, radix: number) {
		let parsedInt = parseInt(n)
		if (isNaN(parsedInt)) parsedInt = 0
		return parsedInt.toString(radix)
	}
	function toBase10(n: string, radix: number) {
		let parsedInt = parseInt(n, radix)
		if (isNaN(parsedInt)) parsedInt = 0
		return parsedInt.toString()
	}

	$: base2 = fromBase10(number, 2)
	$: base8 = fromBase10(number, 8)
	$: base10 = fromBase10(number, 10)
	$: base12 = fromBase10(number, 12)
	$: base16 = fromBase10(number, 16)

	const updateBase2 = () => number = toBase10(base2, 2)
	const updateBase8 = () => number = toBase10(base8, 8)
	const updateBase10 = () => number = toBase10(base10, 10)
	const updateBase12 = () => number = toBase10(base12, 12)
	const updateBase16 = () => number = toBase10(base16, 16)
</script>

<div class="container">
<Input id="base2" label="Base 2 (Binary)" bind:value={base2} on:input={updateBase2} />
<Input id="base8" label="Base 8 (Octal)" bind:value={base8} on:input={updateBase8} />
<Input id="base10" label="Base 10 (Decimal)" bind:value={base10} on:input={updateBase10} />
<Input id="base10" label="Base 12 (Dozenal)" bind:value={base12} on:input={updateBase12} />
<Input id="base16" label="Base 16 (Hexadecimal)" bind:value={base16} on:input={updateBase16} />
</div>

<style>
	.container {
		height: 100%;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		margin: .5em
	}
</style>