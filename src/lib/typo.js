// Typographie française : espaces insécables et guillemets.
// Le CSV reste en texte simple (espaces normales) ; on applique ces règles au rendu.
const nbsp = ' ';

/**
 * Applique les espaces insécables FR à du TEXTE BRUT (pas de HTML) :
 * - insécable avant : ; ? !
 * - insécable après « et avant »
 * Sûr pour un rendu Svelte normal `{typo(x)}` (n'introduit aucune balise).
 * @param {string} [text]
 * @returns {string}
 */
export function typo(text) {
  if (!text) return text ?? '';
  return text
    .replace(/\s*([?!:])/g, `${nbsp}$1`)
    .replace(/\s+(;)/g, `${nbsp}$1`)
    .replace(/«\s*/g, `«${nbsp}`)
    .replace(/\s*»/g, `${nbsp}»`);
}

/**
 * Variante pour du HTML riche (articles) : en plus des insécables, enveloppe les
 * citations «…» dans <em> et sort les attributions inline (« , précise X. ») du <em>.
 * À n'utiliser que via {@html} sur du contenu de confiance.
 * @param {string} html
 * @returns {string}
 */
export function typoHtml(html) {
  // Traite uniquement le texte hors balises HTML
  let result = html.replace(/([^<]*)(<[^>]*>)?/g, (_, text, tag) => {
    if (text) {
      text = text
        .replace(/\s*([?!:])/g, `${nbsp}$1`)
        .replace(/\s+(;)/g, `${nbsp}$1`)
        .replace(/«\s*/g, `«${nbsp}`)
        .replace(/\s*»/g, `${nbsp}»`);
    }
    return (text || '') + (tag || '');
  });
  // Enveloppe le contenu entre « » dans <em> — saute si déjà enveloppé
  result = result.replace(/« (?!<em>)([\s\S]*?) »/g, `«${nbsp}<em>$1</em>${nbsp}»`);
  // Sort les attributions inline (« , précise X. ») du <em>
  const verbs =
    'précise|décrit|réagit|détaille|continue|explique|ajoute|souligne|indique|affirme|estime|conclut|rappelle|confirme|insiste|analyse|commente|constate|note';
  const attrRe = new RegExp(`,\\s(?:${verbs})\\s.*?\\.`);
  result = result.replace(/<em>([\s\S]*?)<\/em>/g, (match, content) => {
    const m = content.match(attrRe);
    if (!m) return match;
    const idx = m.index;
    const before = content.substring(0, idx);
    const attr = m[0];
    const after = content.substring(idx + attr.length).trim();
    if (after) return `<em>${before}</em>${attr} <em>${after}</em>`;
    return `<em>${before}</em>${attr}`;
  });
  return result;
}

/**
 * Action Svelte : applique la typo FR (variante HTML) au contenu d'un élément.
 * Usage : <div use:typoAction>…</div>
 * @param {HTMLElement} node
 */
export function typoAction(node) {
  node.innerHTML = typoHtml(node.innerHTML);
}
