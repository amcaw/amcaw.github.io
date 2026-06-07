<script>
  import { page } from '$app/state';
  import Icon from '$lib/components/Icon.svelte';
  import { reveal } from '$lib/reveal.js';

  // Same source as the home page: projects from static/projects.csv via +layout.js.
  let { data } = $props();

  // Anciens slugs -> nouveaux, pour ne pas casser les liens déjà partagés.
  /** @type {Record<string, string>} */
  const ALIASES = {
    warmaps: 'warmaps-ukraine',
    'warmaps-middle-east': 'warmaps-ukraine',
    'warmaps-moyen-orient': 'warmaps-ukraine',
    '20km-bruxelles-2026': '20km-recap',
    '20km-scrolly': '20km-zones'
  };
  let raw = $derived(page.params.slug ?? '');
  let slug = $derived(ALIASES[raw] ?? raw);
  let project = $derived(data.projects.find((p) => p.slug === slug));

  // Les captures qui illustrent le projet (1 ou 2). Remplace l'ancien embed iframe,
  // qui s'affichait mal sur les sites bloquant l'intégration.
  let shots = $derived([project?.image, project?.image2].filter(Boolean));

  // Projet lié (colonne `related` du CSV) — ex. WarMaps Ukraine ↔ Moyen-Orient.
  let related = $derived(
    project?.related ? data.projects.find((p) => p.slug === project.related) : undefined
  );

  // Test d'enrichissement : "making-of" détaillé pour certains projets (par slug).
  // Pipeline réel de WarMaps, tiré du repo iran_auto_maps.
  /** @type {Record<string, { intro: string, steps: {t: string, d: string}[], stack: string[], credits?: string, award?: string }>} */
  const MAKINGOF = {
    'warmaps-ukraine': {
      intro:
        "Le défi : publier chaque jour une carte fiable du front sans y toucher à la main. La source (les shapefiles de l'Institute for the Study of War) arrive par mail, dans un format SIG brut. Tout le reste est automatisé, du courriel jusqu'au pixel.",
      steps: [
        {
          t: 'Réception par mail',
          d: "Un script Google Apps Script déclenché chaque jour interroge Gmail, repère le dernier courriel ISW (le plus récent par date de sujet, jamais une version périmée) et en extrait les pièces jointes .zip."
        },
        {
          t: 'Normalisation & commit',
          d: "Chaque archive est décompressée, renommée vers un identifiant de couche stable, puis poussée sur GitHub via l'API Git (blobs + tree + commit). Les couches absentes sont supprimées pour ne jamais afficher de données obsolètes."
        },
        {
          t: 'Conversion SIG → web',
          d: "Un workflow GitHub Actions convertit les shapefiles en GeoJSON avec shpjs, reprojette de l'EPSG:3857 vers l'EPSG:4326 et arrondit les coordonnées pour alléger les fichiers."
        },
        {
          t: 'Rendu cartographique',
          d: "L'app SvelteKit dessine les polygones (contrôle territorial, avancées, contre-offensives) avec MapLibre GL, dans une palette et des libellés FR pensés pour la lecture éditoriale."
        },
        {
          t: 'Build & déploiement',
          d: "Le même workflow rebâtit le site et le déploie sur GitHub Pages. L'article RTBF l'intègre via pym.js (iframe responsive). Zéro intervention humaine entre le mail et la carte publiée."
        }
      ],
      stack: ['Google Apps Script', 'GitHub Actions', 'shpjs', 'SvelteKit', 'MapLibre GL', 'pym.js']
    },
    reddeviz: {
      intro:
        "Plus d'un siècle de matchs des deux équipes nationales belges, réunis sur un même globe. L'idée de représentation n'est pas née de rien : elle reprend et adapte un format existant, appliqué cette fois aux sélections belges, à partir des données officielles de l'Union belge de football (RBFA).",
      steps: [
        {
          t: 'Genèse & inspiration',
          d: 'Le principe de cartographie chronologique (un globe où chaque match se dépose dans le temps et l\'espace) est directement inspiré du travail de <a href="https://www.chroniquesbleues.fr/cartographie-chronologique-des-matchs-des-Bleus" target="_blank" rel="noreferrer">Chroniques Bleues</a> sur l\'équipe de France, repéré via <a href="https://www.linkedin.com/posts/danielbreton_bleus-football-fff-ugcPost-7467863100411674624--hIG/" target="_blank" rel="noreferrer">Daniel Breton</a> (Visual Data Flow). RedDeviz en est une relecture pour les Diables Rouges et les Red Flames.'
        },
        {
          t: 'Source officielle',
          d: "Les matchs des Diables Rouges et des Red Flames proviennent des données officielles de la RBFA (adversaires, dates, lieux, résultats), sur toute l'histoire des sélections."
        },
        {
          t: 'Géocodage automatique',
          d: "Chaque ville hôte est convertie en coordonnées via Nominatim (OpenStreetMap). Aucune coordonnée n'est tapée à la main : un cache évite de re-géocoder, et les lieux ambigus sont corrigés via une table de désambiguïsation."
        },
        {
          t: 'Terrain neutre & cas limites',
          d: "Le pays hôte est déduit de la ville géocodée, ce qui place correctement les matchs sur terrain neutre (JO, Coupe du monde, Euro féminin). Quand la ville manque ou est illisible, le repère retombe sur la capitale du pays et est marqué comme approximatif (jamais présenté comme exact)."
        },
        {
          t: 'Traitement & build des données',
          d: "Des scripts Node.js consolident le tout en fichiers JSON compacts (matchs + détails), avec les noms de stades en français quand ils existent, prêts à être consommés par l'app."
        },
        {
          t: 'Rendu & intégration',
          d: "L'app SvelteKit projette les matchs sur un globe en D3 / d3-geo (fonds TopoJSON), avec filtres par compétition, résultat et séries marquantes. Elle s'intègre aux articles RTBF via pym.js."
        }
      ],
      stack: ['RBFA (données officielles)', 'Nominatim / OSM', 'Node.js', 'SvelteKit', 'D3 · d3-geo', 'TopoJSON', 'pym.js']
    },
    'svelte-gas-price': {
      intro:
        "Deux widgets pensés pour répondre, chiffres à l'appui, à une question très concrète : faut-il faire le plein aujourd'hui ou attendre demain ? Le tout actualisé tout seul, plusieurs fois par jour, et prêt à être glissé dans un article.",
      steps: [
        {
          t: 'Sources officielles',
          d: "Les tarifs du jour viennent du SPF Économie, l'historique de Statbel (be.STAT, licence ouverte) et les meilleurs prix à la pompe de carbu.com (avec autorisation), par province et par carburant."
        },
        {
          t: 'Mise à jour automatique',
          d: "Des workflows GitHub Actions programmés plusieurs fois par jour rafraîchissent les données et écrivent des fichiers JSON compacts, publiés directement sur GitHub Pages sans reconstruire le site."
        },
        {
          t: 'Continuité des données',
          d: "Le pipeline gère les pièges de la donnée publique : par exemple le changement de nomenclature du mazout (H0/H7 depuis avril 2024) est réconcilié avec l'ancien libellé pour garder un historique continu."
        },
        {
          t: 'Deux widgets, un socle',
          d: "Un calculateur (coût d'un plein aujourd'hui face à une date passée) et un classement des meilleurs prix par province partagent le même socle Svelte, avec une palette et des libellés FR soignés."
        },
        {
          t: 'Intégration éditoriale',
          d: "Chaque widget s'embarque dans les articles du site RTBF Actus via pym.js (iframe responsive qui s'adapte à la hauteur du contenu)."
        }
      ],
      stack: ['SPF Économie', 'Statbel', 'carbu.com', 'GitHub Actions', 'Svelte 5', 'D3', 'pym.js']
    },
    '20km-recap': {
      intro:
        "Des dizaines de milliers de coureurs, et une promesse : permettre à chacun de se situer dans la course en quelques secondes. Tout le travail consiste à transformer une longue liste de temps en une lecture personnelle et lisible.",
      steps: [
        {
          t: 'Des résultats bruts aux distributions',
          d: "À partir des résultats officiels de la course, des scripts Node.js calculent les distributions par catégorie (médianes, quantiles, histogrammes) ainsi que les temps de passage intermédiaires (5,5 km, 10 km, 15 km, arrivée)."
        },
        {
          t: 'Se situer dans la foule',
          d: "Ces distributions permettent de répondre à la vraie question du coureur : où est-ce que je me place ? On compare un temps (ou un dossard) à l'ensemble des participants, par sexe et par catégorie d'âge."
        },
        {
          t: 'Tous les profils',
          d: "Le para-athlétisme, classé séparément, est traité dans son propre jeu de données pour ne pas être noyé dans le classement général."
        },
        {
          t: 'Rendu & multilingue',
          d: "L'app SvelteKit met tout en graphiques avec D3 (échelles, interpolations), dans une interface disponible en plusieurs langues (à l'image d'un public bruxellois)."
        },
        {
          t: 'Diffusion',
          d: "Le site est généré en statique et déployé sur GitHub Pages, prêt à être partagé et intégré aux contenus RTBF."
        }
      ],
      stack: ['Résultats officiels', 'Node.js', 'D3 (scale · array · interpolate)', 'SvelteKit', 'i18n']
    },
    '20km-zones': {
      intro:
        "Un scrollytelling personnalisé : le lecteur indique son sexe, son âge et son objectif de temps, puis descend le parcours zone de souffrance par zone de souffrance. La question éditoriale est simple : où votre groupe ralentit-il vraiment ?",
      steps: [
        {
          t: 'Des traces GPS aux cohortes',
          d: "Le point de départ, ce sont des milliers de traces GPS de coureurs. Elles sont regroupées en cohortes (cinq niveaux de chrono × deux sexes), de quoi raisonner sur des groupes comparables plutôt que sur des individus."
        },
        {
          t: 'Détection des zones de souffrance',
          d: "Pour chaque cohorte, une courbe d'allure lissée est calculée le long du parcours. Une zone de souffrance est repérée automatiquement là où l'allure dépasse de façon marquée la moyenne de la cohorte (au moins 10 s/km sur 400 m ou plus). Chaque groupe a donc ses propres zones, et la longueur du récit s'adapte."
        },
        {
          t: 'Allure × dénivelé',
          d: "Chaque zone est croisée avec le profil d'élévation du parcours (ça monte, c'est plat, ça descend) et accompagnée d'un écart d'allure signé par rapport à la moyenne de course du groupe, plus un commentaire de coach ciblé."
        },
        {
          t: 'La bonne maille pour chacun',
          d: "Les chiffres affichés respectent la cellule d'âge du lecteur quand elle est assez fournie, et retombent proprement sur une maille plus large sinon. Un badge indique toujours sur quel échantillon repose la réponse."
        },
        {
          t: 'Rendu & scrollytelling',
          d: "Le tout est rendu en SvelteKit avec D3 : bandes d'élévation, overlays de progression et graphiques d'allure, orchestrés par le défilement pour une lecture guidée."
        }
      ],
      stack: ['Traces GPS de coureurs', 'Node.js', 'D3', 'SvelteKit', 'scrollytelling']
    },
    'orthophotos-wallonie': {
      intro:
        "Cinquante ans de photographies aériennes superposables sur une même carte, pour voir un territoire changer. L'enjeu : rendre une masse d'imagerie officielle aussi simple à explorer qu'un curseur que l'on fait glisser.",
      steps: [
        {
          t: 'Imagerie officielle',
          d: "Les fonds proviennent des géoservices de la Région wallonne : une couche par millésime d'orthophotos, de 1971 à 2023, complétée par des cartes anciennes (Ferraris 1770, Vandermaelen 1850). Une déclinaison couvre aussi Bruxelles."
        },
        {
          t: 'Trois façons de comparer',
          d: "Un mode loupe (qui révèle une autre année sous un disque), un mode avant/après dans le temps et un mode timelapse animé : trois entrées pour la même question, comment ce lieu a-t-il évolué ?"
        },
        {
          t: 'Aller droit à son quartier',
          d: "Un champ de recherche d'adresse (geocoder) recentre instantanément la carte sur l'endroit qui intéresse le lecteur, plutôt que de le laisser naviguer à la main."
        },
        {
          t: 'Rendu cartographique',
          d: "L'app SvelteKit s'appuie sur MapLibre GL pour afficher et synchroniser les couches, avec un sélecteur d'année, un tutoriel d'accueil et des boutons de partage."
        },
        {
          t: 'Intégration éditoriale',
          d: "Le tout s'embarque dans les articles via pym.js (iframe responsive qui s'ajuste à la hauteur du contenu)."
        }
      ],
      stack: ['Géoservices Wallonie', 'MapLibre GL', 'MapLibre Geocoder', 'SvelteKit', 'pym.js']
    },
    'detroit-ormuz': {
      intro:
        "Un scrollytelling qui suit un cargo, le Giacometti, pour raconter comment l'Iran ouvre et ferme l'un des passages maritimes les plus stratégiques du monde. L'enjeu : rendre lisible une situation maritime complexe, étape par étape.",
      steps: [
        {
          t: 'Suivre un navire',
          d: "Le récit s'accroche à la trajectoire d'un cargo réel à travers le détroit, reconstituée à partir de sa position en temps quasi réel. Source des données de navires : Global Fishing Watch."
        },
        {
          t: 'Lire le trafic maritime',
          d: "Au-delà d'un seul bateau, l'article met en évidence l'engorgement du détroit et les routes alternatives empruntées quand l'Iran resserre l'étau."
        },
        {
          t: 'Imagerie satellite annotée',
          d: "Les images radar Sentinel-1 (SAR, qui voit de jour comme de nuit et à travers les nuages) sont récupérées et assemblées via des scripts Python sur le Copernicus Data Space, puis annotées à la main pour pointer les regroupements de navires, cercles et libellés posés au pixel près."
        },
        {
          t: 'Récit sectionné',
          d: "L'histoire est découpée en sections qui s'enchaînent au défilement (le navire, les « navires non hostiles », les bateaux bloqués), chacune avec sa carte et ses graphiques en D3."
        },
        {
          t: 'Sur un socle réutilisable',
          d: "Le tout est construit sur un template d'article maison (composants titre, intro, carte, image annotée, encadrés, partage), ce qui permet de monter vite un grand format soigné et cohérent d'un sujet à l'autre."
        }
      ],
      stack: ['Global Fishing Watch', 'Python', 'Sentinel-1 / Copernicus', 'MapLibre GL', 'D3', 'SvelteKit', 'Template article maison']
    },
    'musk-mfp': {
      intro:
        "Une enquête sur la façon dont Elon Musk se sert de son réseau X pour amplifier l'extrême droite en Europe, racontée en scrollytelling. Le défi : donner à voir, publication par publication, une mécanique de viralité difficile à saisir à l'œil nu.",
      steps: [
        {
          t: 'Constituer le corpus',
          d: "Le point de départ : cinq mois de publications X d'Elon Musk, à partir de l'élection de Donald Trump. Le corpus est rassemblé puis nettoyé pour permettre une lecture chronologique et quantifiée."
        },
        {
          t: 'Classement assisté par IA',
          d: "Chaque publication est classée par thématique à l'aide de l'intelligence artificielle, puis les résultats de l'IA sont systématiquement vérifiés par les journalistes avant publication."
        },
        {
          t: 'Des données légères pour le web',
          d: "Le jeu de données est converti du CSV vers le format Parquet (via Apache Arrow), ce qui réduit fortement le poids chargé par le navigateur et fluidifie le défilement, même sur de gros volumes."
        },
        {
          t: 'Donner à voir l\'amplification',
          d: "Le récit alterne un mockup de téléphone qui montre les publications réelles et une frise de données : chaque pic d'activité devient lisible, animé en D3 (avec du morphing de formes via flubber)."
        },
        {
          t: 'Scrollytelling',
          d: "Les sections s'enchaînent au défilement, avec préchargement des images et gestion des états de chargement pour une lecture sans accroc."
        }
      ],
      stack: ['Données X', 'IA (classification)', 'CSV → Parquet (Apache Arrow)', 'D3', 'flubber', 'Svelte'],
      award: 'Prix du journalisme du Parlement de la Fédération Wallonie-Bruxelles',
      credits:
        'Lauréat du <strong>Prix du journalisme du Parlement de la Fédération Wallonie-Bruxelles</strong>. Réalisé dans le cadre des <strong>Médias Francophones Publics (MFP)</strong>, en collaboration notamment entre la <strong>RTBF</strong>, <strong>France 24</strong> et <strong>France Info</strong>.'
    },
    constellation: {
      intro:
        "Reconstituer en 3D une soirée qui a viré au drame : l'incendie du bar Le Constellation, à Crans-Montana, la nuit du Nouvel An. L'enjeu est de comprendre, espace par espace, comment un lieu festif est devenu un piège mortel.",
      steps: [
        {
          t: 'Enquête OSINT',
          d: "Les circonstances de l'incendie sont retracées par des techniques d'open source intelligence (OSINT) : recoupement de vidéos, photos et témoignages publics pour établir la chronologie et la disposition réelle des lieux."
        },
        {
          t: 'Modélisation des lieux',
          d: "Le bar et ses accès (salle, sous-sol, escaliers, portes, terrasses) sont reconstruits en modèles 3D distincts, fidèles à la configuration de la nuit des faits."
        },
        {
          t: 'Rendu 3D temps réel',
          d: "Les modèles sont affichés et éclairés dans le navigateur avec Three.js, ce qui permet de naviguer dans l'espace et de mettre en évidence le foyer de l'incendie et les issues."
        },
        {
          t: 'Récit guidé',
          d: "Le scrollytelling enchaîne les points de vue 3D au fil du texte, confronte la maquette aux images réelles de la soirée et fait apparaître, étape par étape, pourquoi les sorties sont devenues des pièges."
        }
      ],
      stack: ['OSINT', 'Modélisation 3D', 'Three.js', 'D3', 'SvelteKit'],
      credits: 'Modèle 3D : RTS. Récit et analyse : Décrypte (RTBF).'
    },
    minnesota: {
      intro:
        "Reconstituer, seconde par seconde, la mort de Renee Good, tuée par un agent de l'ICE au Minnesota. L'objectif : confronter les sources visuelles pour proposer la reconstitution la plus précise possible de la scène, sans trancher à la place de l'enquête.",
      steps: [
        {
          t: 'Enquête OSINT',
          d: "Le travail repose sur des techniques d'open source intelligence (OSINT) : collecte et vérification de vidéos de surveillance, de body-cam et de témoins, recoupées avec l'imagerie satellite du lieu."
        },
        {
          t: 'Synchroniser les sources',
          d: "Les différentes vidéos sont alignées sur une même horloge à partir d'indices visuels et de badges horaires, pour suivre l'enchaînement des événements à la seconde près."
        },
        {
          t: 'Du tableur au récit',
          d: "Le déroulé est piloté par un tableur (étapes, textes, médias, horodatage) converti en JSON par un script Python, puis les vidéos sont optimisées pour le web."
        },
        {
          t: 'Scrollytelling cartographié',
          d: "Le récit défilant combine une vue satellite (MapLibre) du lieu et les séquences vidéo, pour que le lecteur situe chaque moment dans l'espace comme dans le temps."
        }
      ],
      stack: ['OSINT', 'Python (pandas)', 'MapLibre GL', 'SvelteKit', 'scrollytelling']
    },
    'south-liban': {
      intro:
        "Documenter, preuves à l'appui, la destruction de villages du Sud-Liban le long de la frontière israélienne. Tout l'enjeu est de vérifier et de géolocaliser ce qui a été détruit, village par village.",
      steps: [
        {
          t: 'Imagerie satellite (Python + Sentinel)',
          d: "Des scripts Python interrogent le Copernicus Data Space pour récupérer l'imagerie Sentinel : vraie couleur (Sentinel-2) et radar (Sentinel-1, SAR). Une détection de changement de rétrodiffusion radar fait ressortir les bâtiments disparus entre deux dates."
        },
        {
          t: 'Vérifier et géolocaliser',
          d: 'Vidéos de drone et images sont confrontées et replacées précisément sur le terrain, et recoupées avec des relevés de dégâts par imagerie satellite comme ceux de l\'<a href="https://damage.conflict-ecology.org/" target="_blank" rel="noreferrer">université d\'État de l\'Oregon</a>, pour documenter les destructions dans la région.'
        },
        {
          t: 'Cartographier les frappes',
          d: "Une carte MapLibre superpose les couches de frappes géolocalisées (plus d'un millier d'événements datés) et la zone tampon, pour donner l'échelle et la géographie du phénomène."
        },
        {
          t: 'Récit & diffusion',
          d: "L'article est bâti sur un template maison (carte, images annotées, encadrés, grilles) et déployé en statique, prêt à être intégré aux contenus RTBF."
        }
      ],
      stack: ['Python', 'Sentinel-1 / Sentinel-2 (Copernicus)', 'MapLibre GL', 'SvelteKit', 'Template article maison'],
      credits: 'Sources : IDF, Reuters, ISW, CNRS (Liban), Oregon State University.'
    }
  };
  let makingof = $derived(MAKINGOF[slug]);
</script>

<svelte:head>
  <title>{project ? project.title : 'Page introuvable'}</title>
</svelte:head>

{#if project}
  <main class="detail wrap">
    <a class="back" href="/"><Icon name="arrow-left" /> Retour</a>

    <div class="detail__head">
      {#if project.date}
        <p class="detail__date label">{project.date}</p>
      {/if}
      <h1 class="detail__title display">{project.title}</h1>
      {#if makingof?.award}
        <p class="detail__award"><Icon name="award" size={15} /> {makingof.award}</p>
      {/if}
      <p class="detail__lede">{project.lede}</p>
      <dl class="detail__specs--slim">
        {#each project.specs.filter((s) => s.k === 'Stack') as s}
          <div class="spec"><dt>{s.k}</dt><dd>{s.v}</dd></div>
        {/each}
        {#if project.date}
          <div class="spec"><dt>Publication</dt><dd>{project.date}</dd></div>
        {/if}
      </dl>
      {#if project.url}
        <div class="detail__cta">
          <a class="btn" href={project.url} target="_blank" rel="noreferrer">
            Voir le projet en ligne <Icon name="arrow" size={15} />
          </a>
        </div>
      {/if}
    </div>

    <!-- Galerie : 1 ou 2 captures du projet, avec une légende qui en explique le contenu -->
    <figure class="detail__shots reveal" use:reveal>
      <div class="detail__shots-grid" class:is-pair={shots.length > 1}>
        {#if shots.length}
          {#each shots as src}
            <img class="detail__shot-img" {src} alt={`Capture — ${project.title}`} loading="lazy" />
          {/each}
        {:else}
          <div class="ph"></div>
        {/if}
      </div>
      {#if project.caption}
        <figcaption class="detail__shots-cap">{project.caption}</figcaption>
      {/if}
    </figure>

    {#if makingof}
      <section class="makingof reveal" use:reveal>
        <h2 class="makingof__head label">Sous le capot</h2>
        <p class="makingof__intro">{makingof.intro}</p>
        <ol class="makingof__steps">
          {#each makingof.steps as step, i}
            <li class="mstep">
              <span class="mstep__num">{String(i + 1).padStart(2, '0')}</span>
              <div class="mstep__body">
                <h3 class="mstep__title">{step.t}</h3>
                <!-- eslint-disable-next-line svelte/no-at-html-tags -- contenu de confiance (défini dans ce fichier) -->
                <p class="mstep__desc">{@html step.d}</p>
              </div>
            </li>
          {/each}
        </ol>
        <ul class="makingof__stack">
          {#each makingof.stack as tech}
            <li class="chip">{tech}</li>
          {/each}
        </ul>
        {#if makingof.credits}
          <!-- eslint-disable-next-line svelte/no-at-html-tags -- contenu de confiance (défini dans ce fichier) -->
          <p class="makingof__credits">{@html makingof.credits}</p>
        {/if}
      </section>
    {/if}

    {#if related}
      <aside class="related reveal" use:reveal>
        <p class="related__label label">Voir aussi</p>
        <a class="related__card" href={`/work/${related.slug}`}>
          {#if related.image}
            <img class="related__img" src={related.image} alt={`Aperçu — ${related.title}`} loading="lazy" />
          {:else}
            <div class="ph related__img"></div>
          {/if}
          <div class="related__body">
            <div class="related__title">{related.title}</div>
            <div class="related__desc">{related.desc}</div>
          </div>
          <span class="related__arrow"><Icon name="arrow" size={16} /></span>
        </a>
      </aside>
    {/if}
  </main>
{:else}
  <main class="detail wrap">
    <a class="back" href="/"><Icon name="arrow-left" /> Retour</a>
    <h1 class="detail__title display">Projet introuvable</h1>
    <p class="detail__lede">
      Ce projet n'existe pas (ou plus) à cette adresse.
      <a href="/">Revenir à la liste des travaux</a>.
    </p>
  </main>
{/if}
