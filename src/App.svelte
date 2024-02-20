<script>
  import { onMount, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import Hero from './Hero.svelte';

  const steps = [
    { id: 1, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', image: 'https://rtbfmedia.be/rtbfinfo/the_line_2024/pics/2021.webp' },
    { id: 2, text: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', image: 'https://rtbfmedia.be/rtbfinfo/the_line_2024/pics/2024_1.webp' },
    { id: 3, text: 'This is the Hero.', image: 'https://rtbfmedia.be/rtbfinfo/the_line_2024/pics/2024_2.webp' },
  ];

  let activeStepIndex = 0;
  let observer;

  onMount(() => {
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const { target, isIntersecting } = entry;
        const index = steps.findIndex(step => step.id.toString() === target.getAttribute('data-step'));
        if (isIntersecting) {
          activeStepIndex = index;
        }
      });
    }, { threshold: 0.6 });

    document.querySelectorAll('[data-step]').forEach(el => observer.observe(el));
  });

  onDestroy(() => {
    if (observer) observer.disconnect();
  });
</script>

<svelte:head>
  {#each steps as { image }}
    <link rel="preload" href="{image}" as="image">
  {/each}
</svelte:head>

<section>
  <div class="sticky-background">
    {#each steps as step, index (step.id)}
      {#if index === activeStepIndex}
        <img src={step.image} alt={`Image ${step.id}`} in:fade={{ duration: 300 }} out:fade={{ duration: 300, delay: 250 }} />
      {/if}
    {/each}
  </div>

  <div class="foreground">
    {#each steps as step (step.id)}
      <div class="step" data-step={step.id}>
          <div class="step-content">
            <p>{step.text}</p>
          </div>
      </div>
    {/each}
  </div>
</section>


	<p>Lorem ipsum</p>
	<p>Lorem ipsum</p>
	<p>Lorem ipsum</p>
	<p>Lorem ipsum</p>
	<p>Lorem ipsum</p>
	<p>Lorem ipsum</p>

<style>

  .sticky-background {
      position: sticky;
      top: 0;
      height: 100vh;
      width: 100%;
      overflow: hidden;
      z-index: 1;
  }
  .sticky-background img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
  }
  .foreground {
      position: relative;
      z-index: 2;

		margin-top: -100vh;
  }
  .step {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      position: relative;
      z-index: 2;
  }

 .step-content {
	background-color: rgba(245, 245, 245, 0.8);
			color: black;
			border-radius: 10px;
			padding: 0.5rem 1rem;
			display: flex;
			flex-direction: column;
			justify-content: center;
			transition: background 500ms ease;
			box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.2);
			z-index: 10;
			font-size: 1rem;
		  text-align: left;
			  width: 75%;
			  margin: auto;
			  max-width: 500px;
  }



</style>
