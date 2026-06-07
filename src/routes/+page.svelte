<script>
  import { PROFILE, CATEGORIES } from '$lib/data.js';
  import IndexList from '$lib/components/IndexList.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import ContactForm from '$lib/components/ContactForm.svelte';
  import { reveal } from '$lib/reveal.js';

  // Projects come from static/projects.csv via +layout.js — edit the CSV, refresh.
  let { data } = $props();
  let projects = $derived(data.projects);

  let cat = $state('Tout');
  let filtered = $derived(cat === 'Tout' ? projects : projects.filter((p) => p.cats.includes(cat)));

  // Featured cards only headline the unfiltered "Tout" view; once a category is
  // chosen we drop to a single clean index list so nothing shows twice.
  let showFeatured = $derived(cat === 'Tout');
  let featured = $derived(projects.filter((p) => p.featured));
  let listProjects = $derived(showFeatured ? filtered.filter((p) => !p.featured) : filtered);

  // "Charger plus" : on n'affiche d'abord que PAGE_SIZE projets dans la liste index,
  // puis on en révèle un lot de plus à chaque clic. Le compteur se réinitialise quand
  // on change de catégorie (sinon on garderait une longue liste après un filtre).
  const PAGE_SIZE = 7;
  let shown = $state(PAGE_SIZE);
  $effect(() => {
    cat; // dépendance : tout changement de filtre remet la liste à PAGE_SIZE
    shown = PAGE_SIZE;
  });
  let visibleProjects = $derived(listProjects.slice(0, shown));
  let remaining = $derived(Math.max(0, listProjects.length - shown));

  // Bouton "haut de page" : apparaît dès qu'on a défilé de ~la moitié d'un écran.
  let showTop = $state(false);
  $effect(() => {
    const onScroll = () => (showTop = window.scrollY > window.innerHeight * 0.5);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  });
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
</script>

<svelte:head>
  <title>{PROFILE.name} · Datajournalisme</title>
</svelte:head>

<main>
  <!-- hero -->
  <section class="hero wrap">
    <div class="hero__name">{PROFILE.name}</div>
    <h1 class="hero__title display">
      Datajournaliste <span class="alt">qui code</span> l'info.
    </h1>
    <!-- eslint-disable-next-line svelte/no-at-html-tags -- contenu de confiance (data.js) -->
    <p class="hero__lede">{@html PROFILE.lede}</p>
  </section>

  <!-- work -->
  <section class="section wrap" id="work">
    <div class="section__head">
      <h2>Travaux sélectionnés</h2>
    </div>
    <div class="filters">
      {#each CATEGORIES as c}
        <button class="filter" class:is-active={c === cat} onclick={() => (cat = c)}>{c}</button>
      {/each}
    </div>

    {#if data.error}
      <p class="loaderr">Impossible de charger les projets ({data.error}). Vérifiez <code>static/projects.csv</code>.</p>
    {/if}

    {#if showFeatured && featured.length}
      <div class="featured">
        {#each featured as p (p.slug)}
          <a class="fcard reveal" href={`/work/${p.slug}`} use:reveal>
            <div class="fcard__media">
              <span class="fcard__tag">{p.type}</span>
              {#if p.image}
                <img class="thumb-img" src={p.image} alt={`Aperçu — ${p.title}`} loading="lazy" />
              {:else}
                <div class="ph"></div>
              {/if}
            </div>
            <div class="fcard__body">
              <div>
                <div class="fcard__title">{p.title}</div>
                <div class="fcard__desc">{p.desc}</div>
              </div>
              <span class="fcard__arrow"><Icon name="arrow" size={18} /></span>
            </div>
          </a>
        {/each}
      </div>
    {/if}

    <IndexList projects={visibleProjects} />

    {#if remaining > 0}
      <div class="loadmore">
        <button class="loadmore__btn" onclick={() => (shown += PAGE_SIZE)}>
          Charger plus <span class="loadmore__count">({remaining})</span>
        </button>
      </div>
    {/if}
  </section>

  <section class="section wrap" id="contact">
    <ContactForm />
  </section>

  <footer class="footer wrap">
    <span class="label">© {new Date().getFullYear()} {PROFILE.name}</span>
  </footer>
</main>

<button class="totop" class:is-visible={showTop} onclick={scrollToTop} aria-label="Revenir en haut de la page">
  <Icon name="arrow-up" size={18} />
</button>
