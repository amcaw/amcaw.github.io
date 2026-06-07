<script>
  import '../app.css';
  import favicon from '$lib/assets/favicon.svg';
  import TopBar from '$lib/components/TopBar.svelte';
  import { theme } from '$lib/theme.js';

  let { children } = $props();

  // touch the store so it initialises (sets data-theme on <html>) on every page
  $theme;
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<TopBar />
{@render children()}
