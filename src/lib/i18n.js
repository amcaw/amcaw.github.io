

import { writable } from 'svelte/store';
import { browser } from '$app/environment';

/** @type {'fr'|'en'} */
const initial = browser ? /** @type {'fr'|'en'} */ (localStorage.getItem('lang')) || 'fr' : 'fr';

/** @type {import('svelte/store').Writable<'fr'|'en'>} */
export const lang = writable(initial);

if (browser) {
  lang.subscribe((value) => {
    localStorage.setItem('lang', value);
    document.documentElement.setAttribute('lang', value);
  });
}

/** @param {'fr'|'en'} value */
export function setLang(value) {
  lang.set(value);
}

export const CATEGORY_KEYS = ['Tout', 'Cartes', 'Data viz', 'Interactif', 'Scrollytelling'];

/** @type {Record<'fr'|'en', Record<string,string>>} */
export const CATEGORY_LABELS = {
  fr: {
    Tout: 'Tout',
    Cartes: 'Cartes',
    'Data viz': 'Data viz',
    Interactif: 'Interactif',
    Scrollytelling: 'Scrollytelling'
  },
  en: {
    Tout: 'All',
    Cartes: 'Maps',
    'Data viz': 'Data viz',
    Interactif: 'Interactive',
    Scrollytelling: 'Scrollytelling'
  }
};

/** @type {Record<'fr'|'en', Record<string,string>>} */
export const UI = {
  fr: {
    docTitleSuffix: 'Datajournalisme',
    heroBefore: 'Datajournaliste',
    heroAlt: 'qui code',
    heroAfter: "l'info.",
    heroLede:
      "Je travaille pour <a href=\"https://www.rtbf.be/dossier/decrypte\" target=\"_blank\" rel=\"noreferrer\">Décrypte</a>, la cellule data et fact-checking de la rédaction Info de la RTBF. Je vérifie l'information, j'explore des bases de données et je code les cartes, les graphiques et les petits outils qui aident le public à se retrouver dans l'actualité.",
    selectedWork: 'Travaux sélectionnés',
    loadMore: 'Charger plus',
    loadError: 'Impossible de charger les projets',
    checkFile: 'Vérifiez',

    back: 'Retour',
    notFound: 'Page introuvable',
    projectNotFound: 'Projet introuvable',
    notFoundBody: "Ce projet n'existe pas (ou plus) à cette adresse.",
    backToList: 'Revenir à la liste des travaux',
    viewLive: 'Voir le projet en ligne',
    publication: 'Publication',
    underHood: 'Sous le capot',
    seeAlso: 'Voir aussi',
    captureAlt: 'Capture',
    previewAlt: 'Aperçu',

    contactHead: 'Me contacter',
    contactIntro: "N'hésitez pas à me laisser un message.",
    fieldName: 'Nom',
    fieldEmail: 'E-mail',
    fieldMessage: 'Message',
    send: 'Envoyer',
    sending: 'Envoi…',
    contactSuccess: 'Merci, votre message a bien été envoyé. Je reviendrai vers vous rapidement.',
    contactErrorGeneric: 'Une erreur est survenue. Réessayez plus tard.',
    contactErrorNetwork: 'Impossible d’envoyer le message (connexion ?). Réessayez plus tard.',
    contactTodo: 'Formulaire à configurer : créez un formulaire sur',
    and: 'et renseignez son identifiant dans',

    toTop: 'Revenir en haut de la page',
    toLight: 'Passer au thème clair',
    toDark: 'Passer au thème sombre',
    contactNav: 'Contact'
  },
  en: {
    docTitleSuffix: 'Data journalism',
    heroBefore: 'Data journalist',
    heroAlt: 'who codes',
    heroAfter: 'the news.',
    heroLede:
      "I work for <a href=\"https://www.rtbf.be/dossier/decrypte\" target=\"_blank\" rel=\"noreferrer\">Décrypte</a>, the data and fact-checking desk of RTBF's newsroom. I check the facts, dig into databases and code the maps, charts and small tools that help audiences find their way through the news.",
    selectedWork: 'Selected work',
    loadMore: 'Load more',
    loadError: 'Could not load the projects',
    checkFile: 'Check',
    back: 'Back',
    notFound: 'Page not found',
    projectNotFound: 'Project not found',
    notFoundBody: 'This project does not exist (or no longer does) at this address.',
    backToList: 'Back to the work list',
    viewLive: 'View the live project',
    publication: 'Published',
    underHood: 'Under the hood',
    seeAlso: 'See also',
    captureAlt: 'Screenshot',
    previewAlt: 'Preview',
    contactHead: 'Get in touch',
    contactIntro: 'Feel free to drop me a message.',
    fieldName: 'Name',
    fieldEmail: 'Email',
    fieldMessage: 'Message',
    send: 'Send',
    sending: 'Sending…',
    contactSuccess: 'Thanks, your message has been sent. I will get back to you shortly.',
    contactErrorGeneric: 'Something went wrong. Please try again later.',
    contactErrorNetwork: 'Could not send the message (connection?). Please try again later.',
    contactTodo: 'Form to configure: create a form on',
    and: 'and set its ID in',
    toTop: 'Back to top',
    toLight: 'Switch to light theme',
    toDark: 'Switch to dark theme',
    contactNav: 'Contact'
  }
};
