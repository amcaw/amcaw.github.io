<script>
  import Icon from './Icon.svelte';
  import { reveal } from '$lib/reveal.js';
  let { projects = [] } = $props();
</script>

<div class="list">
  {#each projects as p (p.slug)}
    <a class="row reveal" href={`/work/${p.slug}`} use:reveal>
      <div class="row__thumb">
        {#if p.image}
          <img class="thumb-img" src={p.image} alt={`Aperçu — ${p.title}`} loading="lazy" />
        {:else}
          <div class="ph"></div>
        {/if}
      </div>
      <div class="row__main">
        <div class="row__title">{p.title}</div>
        {#if p.date}<div class="row__date">{p.date}</div>{/if}
        <div class="row__desc">{p.desc}</div>
      </div>
      <div class="row__right">
        <span class="chip row__type">{p.type}</span>
        <span class="row__arrow"><Icon name="arrow" size={16} /></span>
      </div>
    </a>
  {/each}
</div>
