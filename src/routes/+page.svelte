<script>
  import { PROFILE } from '$lib/data.js';
  import IndexList from '$lib/components/IndexList.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import ContactForm from '$lib/components/ContactForm.svelte';
  import { reveal } from '$lib/reveal.js';
  import { lang, UI, CATEGORY_KEYS, CATEGORY_LABELS } from '$lib/i18n.js';
  import { loadProjects } from '$lib/projects.js';

  let { data } = $props();
  let t = $derived(UI[$lang]);

  // FR vient du prerender (déjà dans le HTML -> pas de décalage de mise en page) ;
  // EN est chargé à la demande lors du basculement de langue.
  /** @type {Record<string, any[]>} */
  let loaded = $state({});
  let loadErr = $state('');
  $effect(() => {
    const current = $lang;
    if (current === 'fr' || loaded[current]) return;
    loadProjects(current)
      .then((p) => { loaded = { ...loaded, [current]: p }; loadErr = ''; })
      .catch((e) => { loadErr = e instanceof Error ? e.message : String(e); });
  });
  let projects = $derived($lang === 'fr' ? data.projectsFr : (loaded[$lang] ?? data.projectsFr));

  let cat = $state('Tout');
  let filtered = $derived(cat === 'Tout' ? projects : projects.filter((p) => p.cats.includes(cat)));

  let showFeatured = $derived(cat === 'Tout');
  let featured = $derived(projects.filter((p) => p.featured));
  let listProjects = $derived(showFeatured ? filtered.filter((p) => !p.featured) : filtered);

  const PAGE_SIZE = 7;
  let shown = $state(PAGE_SIZE);
  $effect(() => {
    cat;
    shown = PAGE_SIZE;
  });
  let visibleProjects = $derived(listProjects.slice(0, shown));
  let remaining = $derived(Math.max(0, listProjects.length - shown));
</script>

<svelte:head>
  <title>{PROFILE.name} · {t.docTitleSuffix}</title>
</svelte:head>

<main>

  <section class="hero wrap">
    <div class="hero__name">{PROFILE.name}</div>
    <h1 class="hero__title display">
      {t.heroBefore} <span class="alt">{t.heroAlt}</span> {t.heroAfter}
    </h1>

    <p class="hero__lede">{@html t.heroLede}</p>
  </section>


  <section class="section wrap" id="work">
    <div class="section__head">
      <h2>{t.selectedWork}</h2>
    </div>
    <div class="filters">
      {#each CATEGORY_KEYS as c}
        <button class="filter" class:is-active={c === cat} onclick={() => (cat = c)}>
          {CATEGORY_LABELS[$lang][c]}
        </button>
      {/each}
    </div>

    {#if loadErr}
      <p class="loaderr">{t.loadError} ({loadErr}). {t.checkFile} <code>static/projects.{$lang}.json</code>.</p>
    {/if}

    {#if showFeatured && featured.length}
      <div class="featured">
        {#each featured as p, i (p.slug)}
          <a class="fcard reveal" href={`/work/${p.slug}`} use:reveal>
            <div class="fcard__media">
              <span class="fcard__tag">{p.type}</span>
              {#if p.image}
                <img class="thumb-img" src={p.thumb || p.image} alt={`${t.previewAlt} — ${p.title}`} width="400" height="250"
                     loading={i === 0 ? 'eager' : 'lazy'} fetchpriority={i === 0 ? 'high' : undefined} />
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
          {t.loadMore} <span class="loadmore__count">({remaining})</span>
        </button>
      </div>
    {/if}
  </section>

  <section class="section wrap" id="contact">
    <ContactForm />
  </section>
</main>
