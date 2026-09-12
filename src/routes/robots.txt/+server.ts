import { base } from '$app/paths';
import { absoluteUrl } from '$lib/config';

export const prerender = true;
// De layout zet trailingSlash op 'always'; voor losse bestanden moet dat uit.
export const trailingSlash = 'never';

/**
 * Alles is expliciet toegestaan, ook voor AI-crawlers. De bekendste worden
 * apart genoemd zodat er geen twijfel is: sommige bots lezen alleen hun
 * eigen user-agent-blok en negeren de wildcard.
 *
 * Let op: robots.txt wordt alleen gelezen op de root van een domein. Op een
 * GitHub Pages project-URL staat dit bestand onder /<repo>/robots.txt en heeft
 * het dus geen effect; bij een eigen domein wel.
 */
const agents = [
	'*',
	'GPTBot',
	'OAI-SearchBot',
	'ChatGPT-User',
	'ClaudeBot',
	'Claude-User',
	'Claude-SearchBot',
	'anthropic-ai',
	'PerplexityBot',
	'Perplexity-User',
	'Google-Extended',
	'Googlebot',
	'Bingbot',
	'Applebot',
	'Applebot-Extended',
	'meta-externalagent',
	'Amazonbot',
	'DuckDuckBot',
	'CCBot',
	'cohere-ai',
	'MistralAI-User',
	'YouBot'
];

export function GET() {
	const body =
		agents.map((agent) => `User-agent: ${agent}\nAllow: /`).join('\n\n') +
		`\n\nSitemap: ${absoluteUrl(`${base}/sitemap.xml`)}\n`;

	return new Response(body, {
		headers: { 'content-type': 'text/plain; charset=utf-8' }
	});
}
