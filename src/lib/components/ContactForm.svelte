<script>
  import { CONTACT } from '$lib/data.js';

  // L'adresse de destination vit chez Formspree, pas ici : on poste juste vers l'endpoint.
  const configured = CONTACT.formspreeId && CONTACT.formspreeId !== 'VOTRE_ID_FORMSPREE';
  const endpoint = `https://formspree.io/f/${CONTACT.formspreeId}`;

  let status = $state('idle'); // 'idle' | 'sending' | 'success' | 'error'
  let errorMsg = $state('');

  /** @param {SubmitEvent} e */
  async function handleSubmit(e) {
    e.preventDefault();
    const form = /** @type {HTMLFormElement} */ (e.currentTarget);
    // honeypot : si ce champ caché est rempli, c'est un bot — on fait semblant d'avoir réussi
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
        errorMsg = data?.errors?.[0]?.message || 'Une erreur est survenue. Réessayez plus tard.';
        status = 'error';
      }
    } catch {
      errorMsg = 'Impossible d’envoyer le message (connexion ?). Réessayez plus tard.';
      status = 'error';
    }
  }
</script>

<div class="contact">
  <h2 class="contact__head">Me contacter</h2>
  <p class="contact__intro">N'hésitez pas à me laisser un message.</p>

  {#if !configured}
    <p class="contact__notice">
      Formulaire à configurer : créez un formulaire sur
      <a href="https://formspree.io" target="_blank" rel="noreferrer">Formspree</a>
      et renseignez son identifiant dans <code>src/lib/data.js</code>.
    </p>
  {:else if status === 'success'}
    <p class="contact__success">Merci, votre message a bien été envoyé. Je reviendrai vers vous rapidement.</p>
  {:else}
    <form class="contact__form" onsubmit={handleSubmit}>
      <div class="contact__row">
        <label class="contact__field">
          <span>Nom</span>
          <input type="text" name="name" autocomplete="name" required />
        </label>
        <label class="contact__field">
          <span>E-mail</span>
          <input type="email" name="email" autocomplete="email" required />
        </label>
      </div>
      <label class="contact__field">
        <span>Message</span>
        <textarea name="message" rows="5" required></textarea>
      </label>
      <!-- honeypot anti-spam, caché aux humains -->
      <input type="text" name="_gotcha" tabindex="-1" autocomplete="off" aria-hidden="true" class="contact__hp" />

      {#if status === 'error'}
        <p class="contact__error">{errorMsg}</p>
      {/if}

      <button type="submit" class="contact__btn" disabled={status === 'sending'}>
        {status === 'sending' ? 'Envoi…' : 'Envoyer'}
      </button>
    </form>
  {/if}
</div>
