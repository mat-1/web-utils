import preprocess from 'svelte-preprocess'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
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
