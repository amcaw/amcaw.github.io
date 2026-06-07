// Universal load: fetch the project list once from the editable CSV and share it
// with every page (home + detail) via `data.projects`. Runs on the server for the
// first hit and in the browser on later navigations — either way it reads the file
// fresh, so editing static/projects.csv only needs a page refresh, no rebuild.
import { loadProjects } from '$lib/projects.js';

// Site statique (GitHub Pages) : on prerend ce qui peut l'être ; les pages projet
// /work/[slug] sont servies via le fallback SPA (200.html) car leurs slugs viennent
// du CSV au runtime.
export const prerender = true;
export const trailingSlash = 'ignore';

export async function load({ fetch }) {
  try {
    const projects = await loadProjects(fetch);
    return { projects, error: null };
  } catch (e) {
    return { projects: [], error: e instanceof Error ? e.message : String(e) };
  }
}
