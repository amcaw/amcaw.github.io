<script>
  import '../app.css';
  import favicon from '$lib/assets/favicon.svg';
  import TopBar from '$lib/components/TopBar.svelte';
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
