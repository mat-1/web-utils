import preprocess from 'svelte-preprocess'
import staticAdapter from '@sveltejs/adapter-static'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: staticAdapter(),
		target: '#svelte',
		vite: process.env.REPL_ID
			? {
					hmr: {
						server: {
							protocol: 'wss',
							port: 443,
						},
					},
			  }
			: undefined,
	},
}

export default config
