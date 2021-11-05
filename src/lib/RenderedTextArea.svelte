<script lang="ts">
	import { onMount } from 'svelte'

	export let value: string = ''
	export let render: ((text: string) => string) | null = null

	function handlePaste(e: ClipboardEvent) {
		const text = e.clipboardData.getData('text/plain')
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
			text: el.innerText,
			pos: el.selectionStart,
		})
	}
	// add the current value of the textarea to the history
	onMount(() => {
		history.push({ text: value, pos: 0 })
	})
	function caret(element: Node) {
		const range = window.getSelection().getRangeAt(0)
		const prefix = range.cloneRange()
		prefix.selectNodeContents(element)
		prefix.setEnd(range.endContainer, range.endOffset)
		return prefix.toString().length
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
	function handleKeyDown(e) {
		if (e.key === 'Enter') {
			document.execCommand('insertLineBreak')
			e.preventDefault()
		}
	}
	function handleInput(e) {
		const el = e.target as HTMLTextAreaElement
		if (e.data && (e.data.charCodeAt(0) >= 32 || e.data.charCodeAt(0) == 0x20)) {
			const pos = caret(el)
			// we use innertext instead of textContent since innerText is aware of line breaks and textContent isn't
			el.innerHTML = render(el.innerText)
			setCaret(pos, el)
		} else if (e.inputType == 'deleteContentBackward' || e.inputType == 'deleteContentForward') {
			const pos = caret(el)
			el.innerHTML = render(el.innerText)
			setCaret(pos, el)
		}
		value = el.innerText
	}
	let spacesTyped = 0
	function handleBeforeInput(e) {
		const el = e.target as HTMLTextAreaElement
		// ctrl z
		if (e.inputType == 'historyUndo') {
			e.preventDefault()
			let pos = caret(el)
			const historyItem = history.pop()
			if (historyItem) {
				el.innerHTML = render(historyItem.text)
				// if the pos is higher than the actual length, put it at the end
				if (pos > el.innerText.length) pos = el.innerText.length
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
</script>

<noscript>
	<p>The editor won't work properly without JavaScript, please enable it.</p>
	<style>
		#editable-text-area {
			display: none;
		}
	</style>
</noscript>
<div
	id="editable-text-area"
	contenteditable
	on:paste|preventDefault={handlePaste}
	on:input={handleInput}
	on:beforeinput={handleBeforeInput}
	on:keydown={handleKeyDown}
/>

<style>
	#editable-text-area {
		background-color: var(--alternate-background-color);
		max-width: 50em;
		min-height: 20em;
		padding: 0.5em;
		border-radius: 0.25em;
		background-color: var(--alternate-background-color);
	}
</style>