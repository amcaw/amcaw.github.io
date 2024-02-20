<script>
    import { onMount, onDestroy } from 'svelte';
  
    // Accept stepsData as an array of objects
    export let stepsData = [];
  
    let activeStepIndex = 0;
    let observer;
    let scrollyRef;
  
    onMount(() => {
      observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const { target, isIntersecting } = entry;
          // Use stepsData for finding the index
          const index = stepsData.findIndex(step => step.id.toString() === target.getAttribute('data-step'));
          if (isIntersecting) {
            activeStepIndex = index;
          }
        });
      }, { threshold: 0.6 });
  
      const stepElements = scrollyRef.querySelectorAll('[data-step]');
      stepElements.forEach(el => observer.observe(el));
    });
  
    onDestroy(() => {
      observer.disconnect();
    });
  </script>
  
  <section bind:this={scrollyRef}>
    <div class="sticky-background">
      {#each stepsData as { id, text, desktopImage, mobileImage }, index}
        <div class="image-wrapper" style="z-index: {index + 1}; opacity: {index <= activeStepIndex ? 1 : 0}; transition: opacity 1s ease;">
          <picture>
            <source media="(min-width: 768px)" srcset={desktopImage}>
            <source media="(max-width: 767px)" srcset={mobileImage}>
            <img src={desktopImage} alt={`Image ${id}`} />
          </picture>
        </div>
      {/each}
    </div>
  
    <div class="foreground">
      {#each stepsData as { id, text }}
        <div class="step" data-step={id}>
          <div class="step-content">
            <p>{text}</p>
          </div>
        </div>
      {/each}
    </div>
  </section>
<style>

.sticky-background {
    position: sticky;
    top: 0;
    height: 100vh;
    width: 100%;
    overflow: hidden;
    z-index: 1;
  }
  .image-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: opacity 1s ease;
  }
  .image-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .foreground {
    position: relative;
    z-index: 100; /* Ensure foreground content is always on top */
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
