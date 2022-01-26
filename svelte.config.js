import preprocess from 'svelte-preprocess'
import staticAdapter from '@sveltejs/adapter-static'
import glob from 'fast-glob'
import fs from 'fs'

const routes = glob
	.sync('src/routes/**/!(_)*.svelte')
	.filter((page) => {
		return !page.includes(']')
	})
	.map((r) => '/' + r.replace(/^src\/routes\//, '').replace(/(index)?\.svelte$/, ''))
fs.writeFileSync('_routes.json', JSON.stringify(routes))

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: staticAdapter(),
		target: '#svelte',

		vite: {
			build: {
				target: 'es2020',
			},
			// if the user is on replit or gitpod, use a secure websocket
			server:
				process.env.REPL_ID || process.env.GITPOD_WORKSPACE_ID
					? {
							hmr: {
								protocol: 'wss',
								port: 443,
							},
					  }
					: {},
		},
	},
}

export default config
