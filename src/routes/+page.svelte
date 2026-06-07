<script>
  import { PROFILE } from '$lib/data.js';
  import IndexList from '$lib/components/IndexList.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import ContactForm from '$lib/components/ContactForm.svelte';
  import { reveal } from '$lib/reveal.js';
  import { lang, UI, CATEGORY_KEYS, CATEGORY_LABELS } from '$lib/i18n.js';
  import { loadProjects } from '$lib/projects.js';

  let t = $derived(UI[$lang]);

  /** @type {any[]} */
  let projects = $state([]);
  let loadErr = $state('');
  $effect(() => {
    const current = $lang;
    loadProjects(current)
      .then((p) => { projects = p; loadErr = ''; })
      .catch((e) => { projects = []; loadErr = e instanceof Error ? e.message : String(e); });
  });

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
        {#each featured as p (p.slug)}
          <a class="fcard reveal" href={`/work/${p.slug}`} use:reveal>
            <div class="fcard__media">
              <span class="fcard__tag">{p.type}</span>
              {#if p.image}
                <img class="thumb-img" src={p.thumb || p.image} alt={`${t.previewAlt} — ${p.title}`} loading="lazy" />
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

  <footer class="footer wrap">
    <span class="label">© {new Date().getFullYear()} {PROFILE.name}</span>
  </footer>
</main>

<button class="totop" class:is-visible={showTop} onclick={scrollToTop} aria-label={t.toTop}>
  <Icon name="arrow-up" size={18} />
</button>
