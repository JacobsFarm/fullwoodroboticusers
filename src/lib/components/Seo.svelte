<script lang="ts">
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { absoluteUrl } from '$lib/config';
	import { getLocale } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';

	type Props = {
		title: string;
		description: string;
		/** Extra JSON-LD blokken voor deze pagina. */
		jsonld?: Record<string, unknown>[];
	};

	let { title, description, jsonld = [] }: Props = $props();

	const canonical = $derived(absoluteUrl(page.url.pathname));
	const fullTitle = $derived(`${title} — ${m.site_name()}`);

	// Eén WebPage-blok staat op elke pagina, zodat crawlers per URL weten
	// waar ze naar kijken en hoe de pagina in de site past.
	const webPage = $derived({
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: title,
		description,
		url: canonical,
		inLanguage: getLocale(),
		isPartOf: {
			'@type': 'WebSite',
			name: m.site_name(),
			url: absoluteUrl(`${base}/`)
		}
	});

	const blocks = $derived([webPage, ...jsonld]);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />

	<!-- Expliciet toestemming voor crawlers, inclusief volledige snippets -->
	<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={m.site_name()} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />

	{#each blocks as block, i (i)}
		{@html `<script type="application/ld+json">${JSON.stringify(block)}<\/script>`}
	{/each}
</svelte:head>
