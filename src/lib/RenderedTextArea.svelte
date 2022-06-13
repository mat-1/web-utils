<script lang="ts">
	import { getValue, storeValue } from './utils'
	import { browser } from '$app/env'
	import { createEventDispatcher, onMount } from 'svelte'
	import Label from './Label.svelte'

	export let value = ''
	export let id: string | undefined = undefined
	export let label: string | undefined = undefined
	/** A function that renders the user's plaintext into HTML */
	export let render: (text: string) => string

	/** Whether the text area cannot be manually edited */
	export let readonly = false

	const dispatch = createEventDispatcher()

	function getText(el: HTMLTextAreaElement) {
		// remove the trailing newline
		return el.innerText.replace(/\n$/, '')
	}

	export let element: HTMLDivElement | undefined = undefined

	function setHtml(el: HTMLTextAreaElement, text: string) {
		el.innerHTML = text
	}

	function handlePaste(e: ClipboardEvent) {
		const text = e.clipboardData?.getData('text/plain') ?? ''
		// execCommand is deprecated but idk how to do this without execCommand lol
		document.execCommand('insertText', false, text)
	}
	interface HistoryItem {
		text: string
		pos: number
	}
	const history: HistoryItem[] = []
	function addStateToHistory(el: HTMLTextAreaElement) {
		history.push({
			text: getText(el),
			pos: el.selectionStart,
		})
	}
	// add the current value of the textarea to the history
	onMount(() => {
		history.push({ text: value, pos: 0 })
	})

	function caret(element: Node): number {
		const sel = window.getSelection()
		if (!sel) {
			console.warn('no selection')
			return 0
		}
		const range = sel.getRangeAt(0)

		const range2 = range.cloneRange()
		range2.setStart(element, 0)
		range2.setEnd(range.endContainer, range.endOffset)
		sel.removeAllRanges()
		sel.addRange(range2)
		const value = sel.toString().replace(/\r\n/g, '\n')
		return value.length
	}

	function setCaret(pos: number, parent: Node) {
		for (const node of parent.childNodes as unknown as Iterable<Node>) {
			if (node.nodeType == Node.TEXT_NODE) {
				if ((node.textContent?.length ?? 0) >= pos) {
					const range = document.createRange()
					const sel = window.getSelection()
					range.setStart(node, pos)
					range.collapse(true)
					sel?.removeAllRanges()
					sel?.addRange(range)
					return -1
				} else pos = pos - (node.textContent?.length ?? 0)
			} else {
				pos = setCaret(pos, node)
				if (pos < 0) return pos
			}
		}
		return pos
	}
	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			document.execCommand('insertLineBreak')
			e.preventDefault()
		}
	}

	function handleInput(e: InputEventInit) {
		const el = (e as any).target as HTMLTextAreaElement
		value = getText(el)
		dispatch('input', { value })
		const rendered = render(value)
		if (e.data && (e.data.charCodeAt(0) >= 32 || e.data.charCodeAt(0) == 0x20)) {
			const pos = caret(el)
			// we use innertext instead of textContent since innerText is aware of line breaks and textContent isn't
			setHtml(el, rendered)
			setCaret(pos, el)
		} else if (e.inputType == 'deleteContentBackward' || e.inputType == 'deleteContentForward') {
			const pos = caret(el)
			setHtml(el, rendered)
			setCaret(pos, el)
		}
	}

	$: {
		if (element && value !== getText(element as unknown as HTMLTextAreaElement)) {
			const rendered = render(value)
			setHtml(element as unknown as HTMLTextAreaElement, rendered)
		}
	}

	let spacesTyped = 0
	function handleBeforeInput(e: InputEvent) {
		const el = e.target as HTMLTextAreaElement
		// ctrl z
		if (e.inputType == 'historyUndo') {
			e.preventDefault()
			let pos = caret(el)
			const historyItem = history.pop()
			if (historyItem) {
				setHtml(el, historyItem.text)
				// if the pos is higher than the actual length, put it at the end
				if (pos > getText(el).length) pos = getText(el).length
				setCaret(pos, el)
			}
		} else {
			// we only add to history when at least one of the following is true:
			// - typed a non-space character after typing more than one space
			// - we typed a space after typing a non-space
			if (e.inputType == 'insertText') {
				const typedSpace = e.data === ' '
				if (typedSpace) spacesTyped++
				if (!typedSpace && spacesTyped > 1) addStateToHistory(el)
				else if (typedSpace && spacesTyped === 1) addStateToHistory(el)
				if (!typedSpace) spacesTyped = 0
				// limit the history to 10 entries
				if (history.length > 10) history.shift()
			}
		}
	}

	let mounted = false
	onMount(() => {
		mounted = true
		try {
			// we actually encode the data in localStorage as b64 since otherwise it complains when we put binary
			value = id ? getValue(id) ?? '' : ''
		} catch (e) {
			value = ''
		}
	})

	$: {
		if (id && browser && mounted) storeValue(id, value)
	}
</script>

<div class="editable-textarea-container-container">
	{#if label && id}
		<Label for={id} id="{id}-label" simulateLabel>{label}</Label>
	{/if}
	<div class="editable-textarea-container">
		<div
			{id}
			class="editable-textarea"
			contenteditable={!readonly || undefined}
			on:paste|preventDefault={handlePaste}
			on:input={handleInput}
			on:beforeinput={handleBeforeInput}
			on:keydown={handleKeyDown}
			bind:this={element}
			aria-labelledby={label && id ? `${id}-label` : undefined}
			role="textbox"
		/>
	</div>
</div>

<style>
	.editable-textarea {
		resize: none;
		width: 100%;
		height: 100%;
		display: block;
		margin: 0;
		padding: 0.5em;
		font-family: inherit;
		background-color: var(--background-color);
		color: var(--text-color);
		flex-grow: 1;
		font-size: inherit;

		white-space: pre-wrap;
		word-wrap: break-word;
		overflow-wrap: break-word;

		position: absolute;
		border: 3px solid var(--background-color-alt);
	}

	.editable-textarea-container-container {
		height: 100%;
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.editable-textarea-container {
		height: 100%;
		position: relative;
		overflow-x: hidden;
		border-radius: 0.5em;
	}

	.editable-textarea:focus {
		outline: none;
		border: 3px solid var(--background-color-alt-2);
	}
</style>
