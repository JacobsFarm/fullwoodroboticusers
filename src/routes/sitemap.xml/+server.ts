import { base } from '$app/paths';
import { absoluteUrl } from '$lib/config';

export const prerender = true;
// De layout zet trailingSlash op 'always'; voor losse bestanden moet dat uit.
export const trailingSlash = 'never';

/** Alle pagina's van de site. Nieuwe route toevoegen = hier bijzetten. */
const routes = [
	{ path: '/', priority: '1.0' },
	{ path: '/reparaties/', priority: '0.9' },
	{ path: '/kosten/', priority: '0.7' },
	{ path: '/socials/', priority: '0.7' }
];

export function GET() {
	const lastmod = new Date().toISOString().slice(0, 10);

	const urls = routes
		.map(
			({ path, priority }) => `	<url>
		<loc>${absoluteUrl(`${base}${path}`)}</loc>
		<lastmod>${lastmod}</lastmod>
		<changefreq>weekly</changefreq>
		<priority>${priority}</priority>
	</url>`
		)
		.join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

	return new Response(xml, {
		headers: { 'content-type': 'application/xml' }
	});
}
