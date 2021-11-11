<script lang="ts">
	import { goto } from '$app/navigation'
	import { onMount } from 'svelte'
	import { getValue } from '$lib/utils'
	
	onMount(() => {
		if (!window.matchMedia('(max-width: 440px)').matches) {
			goto(getValue('current-page') || '/base64')
		}
	})
</script>

<noscript>
	<p>Please enable JavaScript.</p>
</noscript>
