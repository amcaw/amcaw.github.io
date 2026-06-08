<script>
  import { page } from '$app/state';
  import Icon from '$lib/components/Icon.svelte';
  import { reveal } from '$lib/reveal.js';
  import { lang, UI } from '$lib/i18n.js';
  import { loadProjects } from '$lib/projects.js';

  let t = $derived(UI[$lang]);

  /** @type {any[]} */
  let projects = $state([]);
  $effect(() => {
    const current = $lang;
    loadProjects(current).then((p) => { projects = p; }).catch(() => { projects = []; });
  });

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
  let project = $derived(projects.find((p) => p.slug === slug));

  let shots = $derived([project?.image, project?.image2].filter(Boolean));

  let related = $derived(
    project?.related ? projects.find((p) => p.slug === project.related) : undefined
  );

  let makingof = $derived(project?.makingof);
</script>

<svelte:head>
  <title>{project ? project.title : t.notFound}</title>
</svelte:head>

{#if project}
  <main class="detail wrap">
    <a class="back" href="/"><Icon name="arrow-left" /> {t.back}</a>

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
        {#if project.stack}
          <div class="spec"><dt>Stack</dt><dd>{project.stack}</dd></div>
        {/if}
        {#if project.date}
          <div class="spec"><dt>{t.publication}</dt><dd>{project.date}</dd></div>
        {/if}
      </dl>
      {#if project.url}
        <div class="detail__cta">
          <a class="btn" href={project.url} target="_blank" rel="noreferrer">
            {t.viewLive} <Icon name="arrow" size={15} />
          </a>
        </div>
      {/if}
    </div>


    <figure class="detail__shots reveal" use:reveal>
      <div class="detail__shots-grid" class:is-pair={shots.length > 1}>
        {#if shots.length}
          {#each shots as src}
            <img class="detail__shot-img" {src} alt={`${t.captureAlt} — ${project.title}`} loading="lazy" />
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
        <h2 class="makingof__head label">{t.underHood}</h2>
        <p class="makingof__intro">{makingof.intro}</p>
        <ol class="makingof__steps">
          {#each makingof.steps as step, i}
            <li class="mstep">
              <span class="mstep__num">{String(i + 1).padStart(2, '0')}</span>
              <div class="mstep__body">
                <h3 class="mstep__title">{step.t}</h3>

                <p class="mstep__desc">{@html step.d}</p>
              </div>
            </li>
          {/each}
        </ol>
        {#if makingof.stack}
          <ul class="makingof__stack">
            {#each makingof.stack as tech}
              <li class="chip">{tech}</li>
            {/each}
          </ul>
        {/if}
        {#if makingof.credits}

          <p class="makingof__credits">{@html makingof.credits}</p>
        {/if}
      </section>
    {/if}

    {#if related}
      <aside class="related reveal" use:reveal>
        <p class="related__label label">{t.seeAlso}</p>
        <a class="related__card" href={`/work/${related.slug}`}>
          {#if related.image}
            <img class="related__img" src={related.thumb || related.image} alt={`${t.previewAlt} — ${related.title}`} width="400" height="250" loading="lazy" />
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
    <a class="back" href="/"><Icon name="arrow-left" /> {t.back}</a>
    <h1 class="detail__title display">{t.projectNotFound}</h1>
    <p class="detail__lede">
      {t.notFoundBody}
      <a href="/">{t.backToList}</a>.
    </p>
  </main>
{/if}
