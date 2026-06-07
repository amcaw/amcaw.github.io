

/**
 * @param {HTMLElement} node
 * @param {{ threshold?: number, once?: boolean }} [options]
 * @returns {import('svelte/action').ActionReturn}
 */
export function reveal(node, { threshold = 0.15, once = true } = {}) {
  if (typeof IntersectionObserver === 'undefined') {
    node.classList.add('in');
    return {};
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          node.classList.add('in');
          if (once) observer.unobserve(node);
        } else if (!once) {
          node.classList.remove('in');
        }
      }
    },
    { threshold }
  );

  observer.observe(node);

  return {
    destroy() {
      observer.disconnect();
    }
  };
}
