import { base } from '$app/paths';
import { absoluteUrl, channels, site } from '$lib/config';
import { repairs, categories } from '$lib/data/repairs';
import { models } from '$lib/data/models';

export const prerender = true;
// De layout zet trailingSlash op 'always'; voor losse bestanden moet dat uit.
export const trailingSlash = 'never';

/**
 * llms.txt: een korte, machine-leesbare beschrijving van de site voor
 * taalmodellen en AI-crawlers. Zie https://llmstxt.org/
 * De volledige inhoud staat in /llms-full.txt.
 */
export function GET() {
	const url = (path: string) => absoluteUrl(`${base}${path}`);

	const body = `# Fullwood Robotic Users

> Onafhankelijke, door gebruikers bijgehouden verzameling informatie over Fullwood
> melkrobots: de Merlin M2 en de generaties daarvoor. De site is niet gelieerd aan
> Fullwood JOZ. Beschikbaar in het Nederlands, Engels en Duits.

De site bestaat uit vier onderdelen: een overzicht van veelvoorkomende storingen met
symptomen, mogelijke oorzaken en controlestappen; een kostenoverzicht met een algemene jaarbegroting en een
boerderijvoorbeeld uit de praktijk; een marktplaats waar gebruikers melkrobots, onderdelen en randapparatuur
aanbieden of zoeken; en een pagina met de publieke kanalen van Fullwood JOZ en de
Facebookgroep Fullwood Merlin M2 enthusiasts.

## Pagina's

- [Home](${url('/')}): introductie en modeloverzicht
- [Reparaties](${url('/reparaties/')}): ${repairs.length} storingen, verdeeld over ${categories.length} categorieën
- [Kosten](${url('/kosten/')}): algemene jaarbegroting van een Merlin M2 (ca. € 11.500 per jaar) met prijsontwikkeling
- [Boerderijvoorbeeld](${url('/kosten/boerderij/')}): dertien jaar facturen van een Merlin en vier jaar Merlin M2, per jaar en per liter melk
- [Marktplaats](${url('/marktplaats/')}): aangeboden en gevraagd, geplaatst door gebruikers
- [Socials](${url('/socials/')}): kanalen en berichten

## Volledige inhoud

- [llms-full.txt](${url('/llms-full.txt')}): alle reparatie-inhoud als platte tekst
- [sitemap.xml](${url('/sitemap.xml')}): alle URL's

## Modellen

${models.map((model) => `- ${model.name}: ${model.blurb.nl}`).join('\n')}

## Kanalen van Fullwood JOZ en de community

${channels
	.map(
		(group) =>
			`### ${group.platform}\n\n` +
			group.links.map((link) => `- [${link.label}](${link.href})`).join('\n')
	)
	.join('\n\n')}

## Bijdragen

Dit is een gezamenlijk project van de community rond Fullwood: boeren, dealers en
anderen met belangstelling. Het is geen reclamekanaal. De broncode is volledig open
source; iedereen kan bijdragen via een issue of een pull request, die voor het
samenvoegen wordt beoordeeld.

- Issues: ${site.repo}/issues
- Pull requests: ${site.repo}/pulls

## Over

- Broncode: ${site.repo}
- Licentie: zie de repository
- Status: de reparatie-inhoud is deels nog niet geverifieerd; items met
  \`verified: false\` staan op de site gemarkeerd als voorbeeldinhoud.
`;

	return new Response(body, {
		headers: { 'content-type': 'text/plain; charset=utf-8' }
	});
}
