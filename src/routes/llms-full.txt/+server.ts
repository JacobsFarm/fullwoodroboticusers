import { base } from '$app/paths';
import { absoluteUrl } from '$lib/config';
import { repairs, categories, type Locale } from '$lib/data/repairs';

export const prerender = true;
// De layout zet trailingSlash op 'always'; voor losse bestanden moet dat uit.
export const trailingSlash = 'never';

const difficulty: Record<string, Record<Locale, string>> = {
	easy: { nl: 'Basis', en: 'Basic', de: 'Basis' },
	medium: { nl: 'Gevorderd', en: 'Advanced', de: 'Fortgeschritten' },
	hard: { nl: 'Specialist', en: 'Specialist', de: 'Fachkraft' }
};

const headings: Record<Locale, Record<string, string>> = {
	nl: {
		symptoms: 'Symptomen',
		causes: 'Mogelijke oorzaken',
		steps: 'Controlestappen',
		parts: 'Onderdelen',
		models: 'Modellen',
		level: 'Niveau',
		category: 'Categorie',
		unverified: 'Nog niet geverifieerd.'
	},
	en: {
		symptoms: 'Symptoms',
		causes: 'Possible causes',
		steps: 'Checking steps',
		parts: 'Parts',
		models: 'Models',
		level: 'Level',
		category: 'Category',
		unverified: 'Not yet verified.'
	},
	de: {
		symptoms: 'Symptome',
		causes: 'Mögliche Ursachen',
		steps: 'Prüfschritte',
		parts: 'Ersatzteile',
		models: 'Modelle',
		level: 'Niveau',
		category: 'Kategorie',
		unverified: 'Noch nicht geprüft.'
	}
};

const locales: Locale[] = ['nl', 'en', 'de'];

/**
 * De volledige reparatie-inhoud als platte tekst, in alle talen.
 * Bedoeld voor taalmodellen en crawlers die liever tekst dan HTML lezen.
 */
export function GET() {
	const sections = locales.map((locale) => {
		const h = headings[locale];

		const items = repairs.map((repair) => {
			const category = categories.find((c) => c.id === repair.category);

			return [
				`### ${repair.title[locale]}`,
				'',
				repair.summary[locale],
				'',
				`- ${h.category}: ${category ? category.label[locale] : repair.category}`,
				`- ${h.models}: ${repair.models.join(', ')}`,
				`- ${h.level}: ${difficulty[repair.difficulty][locale]}`,
				`- URL: ${absoluteUrl(`${base}/reparaties/#${repair.id}`)}`,
				'',
				`#### ${h.symptoms}`,
				'',
				repair.symptoms[locale].map((line) => `- ${line}`).join('\n'),
				'',
				`#### ${h.causes}`,
				'',
				repair.causes[locale].map((line) => `- ${line}`).join('\n'),
				'',
				`#### ${h.steps}`,
				'',
				repair.steps[locale].map((line, i) => `${i + 1}. ${line}`).join('\n'),
				'',
				`#### ${h.parts}`,
				'',
				repair.parts[locale].map((line) => `- ${line}`).join('\n'),
				repair.verified ? '' : `\n> ${h.unverified}`
			].join('\n');
		});

		return `## ${locale}\n\n${items.join('\n\n')}`;
	});

	const body = `# Fullwood Robotic Users — volledige reparatie-inhoud

Onafhankelijke, door gebruikers bijgehouden informatie over Fullwood melkrobots
(Merlin M2 en ouder). Niet gelieerd aan Fullwood JOZ. Deze informatie vervangt de
officiële documentatie en de servicedienst niet.

Veiligheid: schakel de hoofdschakelaar uit en laat de perslucht af voordat er aan
de robot wordt gewerkt.

${sections.join('\n\n')}
`;

	return new Response(body, {
		headers: { 'content-type': 'text/plain; charset=utf-8' }
	});
}
