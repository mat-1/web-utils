<script lang="ts">
	import { goto } from '$app/navigation'
	import { onMount } from 'svelte'

	onMount(() => {
		if (!window.matchMedia('(max-width: 440px)').matches) {
			goto('/base64')
		}
	})
</script>

<noscript>
	<p>Please enable JavaScript.</p>
</noscript>
