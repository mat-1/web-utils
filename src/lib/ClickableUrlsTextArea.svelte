<script lang="ts">
	import RenderedTextArea from './RenderedTextArea.svelte'
	import anchorme from 'anchorme'

	export let value = ''
	export let id: string | undefined
	export let label: string | undefined

	export let element: HTMLDivElement | HTMLTextAreaElement | undefined = undefined

	const render = (text: string) => {
		return anchorme({
			input: text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
		})
	}
</script>

<RenderedTextArea bind:value on:input bind:element {id} {label} {render} />
