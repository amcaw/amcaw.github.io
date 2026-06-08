<script>
  import '../app.css';
  import favicon from '$lib/assets/favicon.svg';
  import TopBar from '$lib/components/TopBar.svelte';
  import SocialLinks from '$lib/components/SocialLinks.svelte';
  import BackToTop from '$lib/components/BackToTop.svelte';
  import { PROFILE } from '$lib/data.js';
  import { theme } from '$lib/theme.js';
  import { lang } from '$lib/i18n.js';

  let { children } = $props();

  $theme;
  $lang;
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<TopBar />
{@render children()}

<footer class="footer wrap">
  <span class="label">© {new Date().getFullYear()} {PROFILE.name}</span>
  <span class="footer__socials"><SocialLinks /></span>
</footer>

<BackToTop />
