<script>
  import { CONTACT } from '$lib/data.js';
  import { lang, UI } from '$lib/i18n.js';

  let t = $derived(UI[$lang]);

  const configured = CONTACT.formspreeId && CONTACT.formspreeId !== 'VOTRE_ID_FORMSPREE';
  const endpoint = `https://formspree.io/f/${CONTACT.formspreeId}`;

  let status = $state('idle');
  let errorMsg = $state('');


  /** @param {SubmitEvent} e */
  async function handleSubmit(e) {
    e.preventDefault();
    const form = /** @type {HTMLFormElement} */ (e.currentTarget);

    const hp = /** @type {HTMLInputElement | null} */ (form.querySelector('input[name="_gotcha"]'));
    if (hp?.value) {
      status = 'success';
      return;
    }
    status = 'sending';
    errorMsg = '';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form)
      });
      if (res.ok) {
        status = 'success';
        form.reset();
      } else {
        const data = await res.json().catch(() => null);
        errorMsg = data?.errors?.[0]?.message || UI[$lang].contactErrorGeneric;
        status = 'error';
      }
    } catch {
      errorMsg = UI[$lang].contactErrorNetwork;
      status = 'error';
    }
  }
</script>

<div class="contact">
  <h2 class="contact__head">{t.contactHead}</h2>
  <p class="contact__intro">{t.contactIntro}</p>

  {#if !configured}
    <p class="contact__notice">
      {t.contactTodo}
      <a href="https://formspree.io" target="_blank" rel="noreferrer">Formspree</a>
      {t.and} <code>src/lib/data.js</code>.
    </p>
  {:else if status === 'success'}
    <p class="contact__success">{t.contactSuccess}</p>
  {:else}
    <form class="contact__form" onsubmit={handleSubmit}>
      <div class="contact__row">
        <label class="contact__field">
          <span>{t.fieldName}</span>
          <input type="text" name="name" autocomplete="name" required />
        </label>
        <label class="contact__field">
          <span>{t.fieldEmail}</span>
          <input type="email" name="email" autocomplete="email" required />
        </label>
      </div>
      <label class="contact__field">
        <span>{t.fieldMessage}</span>
        <textarea name="message" rows="5" required></textarea>
      </label>

      <input type="text" name="_gotcha" tabindex="-1" autocomplete="off" aria-hidden="true" class="contact__hp" />

      {#if status === 'error'}
        <p class="contact__error">{errorMsg}</p>
      {/if}

      <button type="submit" class="contact__btn" disabled={status === 'sending'}>
        {status === 'sending' ? t.sending : t.send}
      </button>
    </form>
  {/if}
</div>
