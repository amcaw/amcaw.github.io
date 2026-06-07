import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: {
		// Site statique pour GitHub Pages. Le fallback doit s'appeler 404.html :
		// Pages sert ce fichier pour toute route non prerendue (ex. /work/[slug]),
		// ce qui déclenche le routing SPA côté client.
		adapter: adapter({ fallback: '404.html' }),
		// Site utilisateur (amcaw.github.io) servi à la racine -> pas de base path.
		paths: { base: '' }
	}
};

export default config;
