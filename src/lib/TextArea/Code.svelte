<script lang="ts">
	import CodeMirror from './CodeMirror.svelte'
	import { javascript } from './languages'

	export let value: string
</script>

<CodeMirror language={javascript()} bind:value on:input />
