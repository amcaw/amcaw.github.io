// Loads projects from the editable CSV at static/projects.csv.
//
// Both the home page and the project detail pages call loadProjects() — there is
// ONE source of truth (static/projects.csv). Edit that file and refresh the page;
// no rebuild is needed, because the CSV is fetched at runtime from /projects.csv.
//
// CSV columns: slug,title,type,cats,featured,url,image,image2,caption,date,desc,lede,role,stack,data
//   - cats is a "|"-separated list (e.g. "Cartes|Interactif") so commas stay free.
//   - desc/lede (and any field containing a comma) must be wrapped in "quotes".
//   - featured is "true" / "false".
//   - url            : the live project link (button on the detail page). Optional.
//   - image / image2 : screenshots. Give just the file name (e.g. "warmaps.jpg");
//                      the loader prefixes "/images/" automatically. image is the
//                      card thumbnail + first gallery shot; image2 is the 2nd shot.
//                      Empty image falls back to the striped placeholder.
//   - caption        : legend shown under the gallery on the detail page. Optional.
//   - date           : publication date, free text (e.g. "23 janvier 2026" or "2026").
//                      The 4-digit year is auto-extracted for the "Année" spec.
//   - related        : slug d'un projet lié (encart "Voir aussi" sur la page projet).
//                      Optionnel.
//
// Les champs texte affichés (title/type/caption/desc/lede + specs) passent par typo()
// pour appliquer les espaces insécables FR — le CSV reste en texte simple.
import { typo } from '$lib/typo.js';

/**
 * Minimal RFC-4180-style CSV parser: handles quoted fields, escaped quotes ("")
 * inside them, commas and newlines within quotes, and CRLF or LF line endings.
 * @param {string} text
 * @returns {string[][]} rows of string cells
 */
export function parseCSV(text) {
  /** @type {string[][]} */
  const rows = [];
  /** @type {string[]} */
  let row = [];
  let field = '';
  let inQuotes = false;
  // Strip a UTF-8 BOM if a spreadsheet added one on export.
  const s = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;

  for (let i = 0; i < s.length; i++) {
    const c = s[i];

    if (inQuotes) {
      if (c === '"') {
        if (s[i + 1] === '"') {
          field += '"';
          i++; // skip the escaped quote
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
      continue;
    }

    if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      // close the field/row on a line break; swallow the \n of a \r\n pair
      if (c === '\r' && s[i + 1] === '\n') i++;
      row.push(field);
      field = '';
      rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }
  // flush the last field/row if the file doesn't end with a newline
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

/**
 * Turn parsed CSV rows into the project objects the UI expects.
 * Rebuilds the `specs` array (Rôle / Stack / Données / Année) from the flat columns.
 * @param {string[][]} rows
 */
function rowsToProjects(rows) {
  if (rows.length < 2) return [];
  const header = rows[0].map((h) => h.trim());
  /** @param {string} name */
  const idx = (name) => header.indexOf(name);

  const col = {
    slug: idx('slug'),
    title: idx('title'),
    type: idx('type'),
    cats: idx('cats'),
    featured: idx('featured'),
    url: idx('url'),
    image: idx('image'),
    image2: idx('image2'),
    caption: idx('caption'),
    date: idx('date'),
    desc: idx('desc'),
    lede: idx('lede'),
    role: idx('role'),
    stack: idx('stack'),
    data: idx('data'),
    related: idx('related')
  };

  // "warmaps.jpg" -> "/images/warmaps.jpg" ; laisse intacts les chemins absolus / URLs / vides
  /** @param {string} v */
  const img = (v) => (!v || /^(\/|https?:)/.test(v) ? v : `/images/${v}`);

  return rows
    .slice(1)
    .filter((r) => r.some((cell) => cell.trim() !== '')) // skip blank lines
    .map((r) => {
      /** @param {number} i */
      const get = (i) => (i >= 0 && i < r.length ? r[i].trim() : '');
      return {
        slug: get(col.slug),
        title: typo(get(col.title)),
        type: typo(get(col.type)),
        cats: get(col.cats)
          .split('|')
          .map((c) => c.trim())
          .filter(Boolean),
        featured: get(col.featured).toLowerCase() === 'true',
        url: get(col.url),
        image: img(get(col.image)),
        image2: img(get(col.image2)),
        caption: typo(get(col.caption)),
        related: get(col.related),
        date: get(col.date),
        desc: typo(get(col.desc)),
        lede: typo(get(col.lede)),
        // année dérivée de la date (4 chiffres) pour la fiche specs
        year: (get(col.date).match(/\d{4}/) || [''])[0],
        specs: [
          { k: 'Rôle', v: typo(get(col.role)) },
          { k: 'Stack', v: typo(get(col.stack)) },
          { k: 'Données', v: typo(get(col.data)) }
        ].filter((s) => s.v !== '')
      };
    });
}

/**
 * Fetch and parse static/projects.csv. Pass SvelteKit's `fetch` from a load
 * function, or omit it to use the global `fetch` in the browser.
 * @param {typeof fetch} [fetchFn]
 * @returns {Promise<ReturnType<typeof rowsToProjects>>}
 */
export async function loadProjects(fetchFn = fetch) {
  const res = await fetchFn('/projects.csv');
  if (!res.ok) throw new Error(`Impossible de charger projects.csv (${res.status})`);
  const text = await res.text();
  return rowsToProjects(parseCSV(text));
}
