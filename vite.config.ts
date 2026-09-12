import { sveltekit } from '@sveltejs/kit/vite';
import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide',
			// Geen taal in de URL: dat houdt de statische GitHub Pages build simpel.
			// Volgorde = prioriteit: eerder gekozen taal > browsertaal > Nederlands.
			strategy: ['localStorage', 'preferredLanguage', 'baseLocale']
		}),
		sveltekit()
	]
});
