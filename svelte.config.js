import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// GitHub Pages serveert dit project onder https://<user>.github.io/<repo>/
// Daarom moet `paths.base` gelijk zijn aan de repo-naam bij een productie-build.
// Lokaal (dev/preview) blijft de base leeg zodat alles op / draait.
const base = process.env.BASE_PATH ?? '';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			// 404.html laat GitHub Pages onbekende paden alsnog door de client-router afhandelen
			fallback: '404.html',
			precompress: false,
			strict: true
		}),
		paths: {
			base,
			relative: false
		},
		prerender: {
			handleHttpError: 'warn'
		}
	}
};

export default config;
