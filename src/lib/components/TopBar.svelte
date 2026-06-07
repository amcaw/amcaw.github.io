<script>
  import Icon from './Icon.svelte';
  import { theme, toggleTheme } from '$lib/theme.js';
</script>

<header class="topbar">
  <div class="wrap topbar__inner">
    <div class="topsocials">
      <a class="topcontact" href="/#contact">Contact</a>
      <span class="topsocials__sep" aria-hidden="true"></span>
      <a href="https://www.linkedin.com/in/ambroise-c-623703229/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Icon name="linkedin" /></a>
      <a href="https://github.com/amcaw" target="_blank" rel="noreferrer" aria-label="GitHub"><Icon name="github" /></a>
      <a href="https://bsky.app/profile/amcaw.bsky.social" target="_blank" rel="noreferrer" aria-label="Bluesky"><Icon name="bluesky" /></a>
      <span class="topsocials__sep" aria-hidden="true"></span>
      <a href="https://www.rtbf.be/auteur/ambroise-carton-197" target="_blank" rel="noreferrer" aria-label="Articles RTBF"><Icon name="rtbf" /></a>
      <button class="themebtn" onclick={toggleTheme}
              aria-label={$theme === 'dark' ? 'Passer au thème clair' : 'Passer au thème sombre'}>
        {#if $theme === 'dark'}<Icon name="sun" />{:else}<Icon name="moon" />{/if}
      </button>
    </div>
  </div>
</header>
