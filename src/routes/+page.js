import { loadProjects } from '$lib/projects.js';

export async function load({ fetch }) {
  const projectsFr = await loadProjects('fr', fetch);
  return { projectsFr };
}
