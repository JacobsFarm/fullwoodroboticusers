// Volledig statische site: alles vooraf renderen, geen server nodig.
export const prerender = true;
export const ssr = true;

// 'always' zorgt voor build/reparaties/index.html in plaats van build/reparaties.html.
// GitHub Pages serveert die variant zonder verrassingen.
export const trailingSlash = 'always';
