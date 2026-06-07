// Profil + catégories. Les PROJETS vivent désormais dans static/projects.csv
// (chargés au runtime via src/routes/+layout.js — éditez le CSV puis rafraîchissez,
// aucun rebuild nécessaire).

export const PROFILE = {
  name: 'Ambroise Carton',
  role: 'Datajournaliste à la RTBF qui code',
  // lede rendu en {@html} dans la home — contient un lien vers Décrypte.
  lede: "Je travaille pour <a href=\"https://www.rtbf.be/dossier/decrypte\" target=\"_blank\" rel=\"noreferrer\">Décrypte</a>, la cellule data et fact-checking de la rédaction Info de la RTBF. Je vérifie l'information, j'explore des bases de données et je code les cartes, les graphiques et les petits outils qui aident le public à se retrouver dans l'actualité."
};

// Formulaire de contact : on poste vers Formspree, qui relaie le message vers
// l'adresse configurée DANS le compte Formspree (jamais écrite ici, donc jamais
// exposée dans le code public). Crée un formulaire sur https://formspree.io,
// mets ambc@rtbf.be comme destinataire, et colle l'ID du form ci-dessous.
export const CONTACT = {
  formspreeId: 'xojzezvq'
};

export const CATEGORIES = ['Tout', 'Cartes', 'Data viz', 'Interactif', 'Scrollytelling'];
