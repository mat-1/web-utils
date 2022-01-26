<script lang="ts">
	import { guessLanguage } from './language-guess'
	import CodeMirror from './CodeMirror.svelte'

	export let value = ''
	export let label: string | undefined = undefined
	export let id: string | undefined = undefined
</script>

<CodeMirror language={guessLanguage(value)} bind:value on:input {label} {id} />
