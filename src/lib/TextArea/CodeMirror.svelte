<script lang="ts">
	import {
		keymap,
		highlightSpecialChars,
		drawSelection,
		highlightActiveLine,
		EditorView,
		ViewPlugin,
	} from '@codemirror/view'
	import { closeBrackets, closeBracketsKeymap } from '@codemirror/closebrackets'
	import { searchKeymap, highlightSelectionMatches } from '@codemirror/search'
	import { autocompletion, completionKeymap } from '@codemirror/autocomplete'
	import { rectangularSelection } from '@codemirror/rectangular-selection'
	import { EditorState, Compartment, Extension } from '@codemirror/state'
	import { defaultKeymap, indentWithTab } from '@codemirror/commands'
	import { defaultHighlightStyle } from '@codemirror/highlight'
	import { history, historyKeymap } from '@codemirror/history'
	import { bracketMatching } from '@codemirror/matchbrackets'
	import { createEventDispatcher, onMount } from 'svelte'
	import { indentOnInput } from '@codemirror/language'
	import { commentKeymap } from '@codemirror/comment'
	import { python } from '@codemirror/lang-python'
	import { foldKeymap } from '@codemirror/fold'
	import { lintKeymap } from '@codemirror/lint'
	import Label from '$lib/Label.svelte'
	import { getValue, storeValue } from '$lib/utils'
	import { browser } from '$app/env'

	const dispatch = createEventDispatcher()

	let tabSize = new Compartment()

	export let value = ''
	export let language: Extension | null
	export let monospace = false
	export let id: string | undefined = undefined
	export let label: string | undefined = undefined

	// whether the editor has user focus
	let focused = false

	let container: HTMLDivElement

	const extensions: Extension[] = [
		highlightSpecialChars(),
		history(),
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
			indentWithTab,
		]),
		tabSize.of(EditorState.tabSize.of(2)),
		EditorView.theme(
			{
				'.cm-content': {
					fontFamily: monospace ? 'var(--monospace-font)' : 'var(--text-font)',
					caretColor: 'var(--caret-color)',
				},
				//'.cm-activeLine': { background: 'var(--background-color-alt)' },
				'.cm-activeLine': { background: '#0000' },
				'.cm-cursor': { borderColor: 'var(--caret-color)' },
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
	const languageCompartment = new Compartment()
	if (language) {
		extensions.push(languageCompartment.of(language))
	}
	$: {
		if (language) languageCompartment.reconfigure(language)
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

	$: {
		if (view) {
			if (view.state.doc.toString() !== value)
				view.dispatch({
					changes: { from: 0, to: view.state.doc.length, insert: value },
				})
		}
	}

	// we store whether the component has been mounted because then if we store the value too early it'll override the previous stored value
	let mounted = false
	onMount(() => {
		mounted = true
		value = id ? getValue(id) : ''
	})
	$: {
		if (id && browser && mounted) storeValue(id, value)
	}
</script>

{#if label && id}
	<Label for={id}>{label}</Label>
{/if}
<div bind:this={container} {id} class="code-textarea" class:focused />

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
