<script lang="ts">
	import CodeMirror from './CodeMirror.svelte'
	import { javascript } from './languages'

	export let value: string
	export let label: string | undefined = undefined
	export let id: string | undefined = undefined
</script>

<CodeMirror language={javascript()} bind:value on:input {label} {id} />
