<script lang="ts">
	/*
	import { EditorState } from '@codemirror/state'
	import { EditorView, keymap } from '@codemirror/view'
	import { defaultKeymap } from '@codemirror/commands'*/
	import { onMount } from 'svelte'

	let container
	/*
	let startState = EditorState.create({
		doc: 'Hello World',
		extensions: [keymap.of(defaultKeymap)],
	})*/

	//onMount(() => {
	//	alert('onmount')
	/*let view = new EditorView({
			state: startState,
			parent: container,
		})*/
	//})
</script>

<div bind:this={container} />
