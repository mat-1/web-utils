<script lang="ts">
	import RenderedTextArea from './RenderedTextArea.svelte'
	import anchorme from 'anchorme'

	export let value = ''
	export let id: string | undefined
	export let label: string | undefined

	export let element: HTMLTextAreaElement | undefined

	const render = (text: string) => {
		return anchorme({
			input: text,
		})
	}
</script>

<RenderedTextArea bind:value on:input bind:element {id} {label} {render} />
