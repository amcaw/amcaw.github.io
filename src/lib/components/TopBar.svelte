<script>
  import Icon from './Icon.svelte';
  import SocialLinks from './SocialLinks.svelte';
  import { theme, toggleTheme } from '$lib/theme.js';
  import { lang, setLang, UI } from '$lib/i18n.js';

  let t = $derived(UI[$lang]);
</script>

<header class="topbar">
  <div class="wrap topbar__inner">
    <div class="topsocials">
      <a class="topcontact" href="/#contact">{t.contactNav}</a>

      <span class="topsocials__sep" aria-hidden="true"></span>
      <span class="langswitch" role="group" aria-label="Language">
        <button class="langswitch__btn" class:is-active={$lang === 'fr'} onclick={() => setLang('fr')} aria-pressed={$lang === 'fr'}>FR</button>
        <span class="langswitch__sep" aria-hidden="true">/</span>
        <button class="langswitch__btn" class:is-active={$lang === 'en'} onclick={() => setLang('en')} aria-pressed={$lang === 'en'}>EN</button>
      </span>

      <span class="topsocials__sep topsocials__links" aria-hidden="true"></span>
      <span class="topsocials__links topsocials__icons"><SocialLinks /></span>

      <span class="topsocials__sep" aria-hidden="true"></span>
      <button class="themebtn" onclick={toggleTheme}
              aria-label={$theme === 'dark' ? t.toLight : t.toDark}>
        {#if $theme === 'dark'}<Icon name="sun" />{:else}<Icon name="moon" />{/if}
      </button>
    </div>
  </div>
</header>
