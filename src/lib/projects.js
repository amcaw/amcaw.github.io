/** @type {Record<string, Promise<any[]>>} */
const cache = {};

/**
 * Charge (et mémoïse) la liste de projets d'une langue depuis static/projects.<lang>.json.
 * Une seule requête réseau par langue, réutilisée ensuite.
 * @param {'fr'|'en'} lang
 * @param {typeof fetch} [fetchFn]
 * @returns {Promise<any[]>}
 */
export function loadProjects(lang, fetchFn = fetch) {
  if (!cache[lang]) {
    cache[lang] = fetchFn(`/projects.${lang}.json`).then((res) => {
      if (!res.ok) throw new Error(`Impossible de charger projects.${lang}.json (${res.status})`);
      return res.json();
    });
  }
  return cache[lang];
}
