import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: {
		// Site statique pour GitHub Pages. fallback: SPA-routing pour les pages /work/[slug].
		adapter: adapter({ fallback: '200.html' }),
		// Site utilisateur (amcaw.github.io) servi à la racine -> pas de base path.
		paths: { base: '' }
	}
};

export default config;
