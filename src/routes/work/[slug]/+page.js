// Les slugs de projet viennent du CSV au runtime : on ne prerend pas cette route,
// elle est servie via le fallback SPA (200.html) puis hydratée côté client.
export const prerender = false;
