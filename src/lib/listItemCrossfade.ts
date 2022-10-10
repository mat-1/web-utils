import { crossfade } from 'svelte/transition'
import { quintOut } from 'svelte/easing'

export const [send, receive] = crossfade({
	// duration: (d) => Math.sqrt(d * 200),
	duration: (d) => 5000,
})
