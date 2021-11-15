<script lang="ts">
	import { EditorState, Compartment, Extension } from '@codemirror/state'
	import { python } from '@codemirror/lang-python'
	import { onMount } from 'svelte'
	import {
		keymap,
		highlightSpecialChars,
		drawSelection,
		highlightActiveLine,
		EditorView,
	} from '@codemirror/view'
	import { history, historyKeymap } from '@codemirror/history'
	import { foldGutter, foldKeymap } from '@codemirror/fold'
	import { indentOnInput } from '@codemirror/language'
	import { lineNumbers, highlightActiveLineGutter } from '@codemirror/gutter'
	import { defaultKeymap } from '@codemirror/commands'
	import { bracketMatching } from '@codemirror/matchbrackets'
	import { closeBrackets, closeBracketsKeymap } from '@codemirror/closebrackets'
	import { searchKeymap, highlightSelectionMatches } from '@codemirror/search'
	import { autocompletion, completionKeymap } from '@codemirror/autocomplete'
	import { commentKeymap } from '@codemirror/comment'
	import { rectangularSelection } from '@codemirror/rectangular-selection'
	import { defaultHighlightStyle } from '@codemirror/highlight'
	import { lintKeymap } from '@codemirror/lint'

	let language = new Compartment(),
		tabSize = new Compartment()

	let container: HTMLDivElement
	let startState = EditorState.create({
		doc: 'Hello World',
		extensions: [
			highlightActiveLineGutter(),
			highlightSpecialChars(),
			history(),
			// foldGutter(),
			drawSelection(),
			EditorState.allowMultipleSelections.of(true),
			indentOnInput(),
			defaultHighlightStyle.fallback,
			bracketMatching(),
			closeBrackets(),
			autocompletion(),
			rectangularSelection(),
			highlightActiveLine(),
			highlightSelectionMatches(),
			keymap.of([
				...closeBracketsKeymap,
				...defaultKeymap,
				...searchKeymap,
				...historyKeymap,
				...foldKeymap,
				...commentKeymap,
				...completionKeymap,
				...lintKeymap,
			]),
			language.of(python()),
			tabSize.of(EditorState.tabSize.of(8)),
			EditorView.theme(
				{
					'.cm-content': {
						fontFamily: 'Consolas',
					},
					'.cm-activeLine': { background: 'var(--background-color-alt)' },
					'.cm-cursor': { borderColor: 'var(--text-color)' },
					'&': { height: '100%', background: 'var(--background-color)' },
				},
				{ dark: true }
			),
		],
	})

	onMount(() => {
		let view = new EditorView({
			state: startState,
			parent: container,
		})
	})
</script>

<div bind:this={container} class="code-textarea" />

<style>
	.code-textarea {
		border: 3px solid var(--background-color-alt);
		border-radius: 0.5em;
		resize: none;
		width: 100%;
		height: 100%;
		display: block;
		margin: 0;
		padding: 0.25em;
		font-family: inherit;
		background-color: var(--background-color);
		color: var(--text-color);
		flex-grow: 1;
		font-size: inherit;
	}

	.code-textarea:focus {
		outline: none;
		border: 3px solid var(--background-color-alt-2);
	}
</style>
