<script>
  import Icon from './Icon.svelte';
  import { lang, UI } from '$lib/i18n.js';

  let t = $derived(UI[$lang]);
  let show = $state(false);
  $effect(() => {
    const onScroll = () => (show = window.scrollY > window.innerHeight * 0.5);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  });
  function toTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
</script>

<button class="totop" class:is-visible={show} onclick={toTop} aria-label={t.toTop}>
  <Icon name="arrow-up" size={18} />
</button>
