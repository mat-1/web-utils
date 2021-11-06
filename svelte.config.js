import preprocess from 'svelte-preprocess'
import staticAdapter from '@sveltejs/adapter-static'
import { VitePWA } from 'vite-plugin-pwa'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: staticAdapter(),
		target: '#svelte',
		vite: {
			hmr: process.env.REPL_ID
				? {
						server: {
							protocol: 'wss',
							port: 443,
						},
				  }
				: undefined,
			plugins: [
				VitePWA({
					manifest: {
						short_name: 'Web Utils',
						name: 'Web Utils',
						start_url: '/',
						icons: [
							{
								src: 'favicon-512.png',
								type: 'image/png',
								sizes: '512x512',
							},
							{
								src: 'favicon.png',
								type: 'image/png',
								sizes: '16x16',
							},
						],
						background_color: '#21222c',
						display: 'standalone',
						scope: '/',
						theme_color: '#21222c',
						description: 'Random useful things for developers',
					},
					registerType: 'autoUpdate',
				}),
			],
		},
		ssr: false,
	},
}

export default config
