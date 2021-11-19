<script lang="ts">
	import {
		keymap,
		highlightSpecialChars,
		drawSelection,
		highlightActiveLine,
		EditorView,
		ViewUpdate,
		ViewPlugin,
	} from '@codemirror/view'
	import { closeBrackets, closeBracketsKeymap } from '@codemirror/closebrackets'
	import { searchKeymap, highlightSelectionMatches } from '@codemirror/search'
	import { autocompletion, completionKeymap } from '@codemirror/autocomplete'
	import { rectangularSelection } from '@codemirror/rectangular-selection'
	import { EditorState, Compartment, Extension, Transaction } from '@codemirror/state'
	import { highlightActiveLineGutter } from '@codemirror/gutter'
	import { defaultHighlightStyle } from '@codemirror/highlight'
	import { history, historyKeymap } from '@codemirror/history'
	import { bracketMatching } from '@codemirror/matchbrackets'
	import { createEventDispatcher, onMount } from 'svelte'
	import { defaultKeymap } from '@codemirror/commands'
	import { indentOnInput } from '@codemirror/language'
	import { commentKeymap } from '@codemirror/comment'
	import { python } from '@codemirror/lang-python'
	import { foldKeymap } from '@codemirror/fold'
	import { lintKeymap } from '@codemirror/lint'

	const dispatch = createEventDispatcher()

	let tabSize = new Compartment()

	export let value: string = ''
	export let language: undefined | Extension
	export let monospace = false

	// whether the editor has user focus
	let focused = false

	let container: HTMLDivElement

	const extensions: Extension[] = [
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
		tabSize.of(EditorState.tabSize.of(8)),
		EditorView.theme(
			{
				'.cm-content': {
					fontFamily: monospace ? 'var(--monospace-font)' : 'var(--text-font)',
				},
				//'.cm-activeLine': { background: 'var(--background-color-alt)' },
				'.cm-activeLine': { background: '#0000' },
				'.cm-cursor': { borderColor: 'var(--text-color)' },
				'&': { height: '100%', background: 'var(--background-color)' },
			},
			{ dark: true }
		),
		ViewPlugin.define(() => ({
			update: (u) => {
				if (u.focusChanged) focused = view.hasFocus
			},
		})),
	]
	if (language) {
		const languageCompartment = new Compartment()
		extensions.push(languageCompartment.of(python()))
	}

	let startState = EditorState.create({
		doc: value,
		extensions,
	})

	let view: EditorView

	let actualValue = ''

	onMount(() => {
		view = new EditorView({
			state: startState,
			parent: container,
			// change value and dispatch input every time the doc changes
			dispatch: (tr) => {
				view.update([tr])
				const docText = view.state.doc.toString()
				if (docText !== actualValue) {
					value = docText
					actualValue = value
					dispatch('input', { value })
				}
			},
		})
	})

	// change the container border color when the code editor is selected
	// view.plugin()

	$: {
		if (view) {
			if (view.state.doc.toString() !== value)
				view.dispatch({
					changes: { from: 0, to: view.state.doc.length, insert: value },
				})
		}
	}
</script>

<div bind:this={container} class="code-textarea" class:focused />

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

	.focused.code-textarea {
		outline: none;
		border: 3px solid var(--background-color-alt-2);
	}
</style>
