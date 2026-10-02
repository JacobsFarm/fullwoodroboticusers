import type { Localized } from './repairs';

/**
 * Marktplaats-aanbiedingen.
 *
 * De site is statisch: er is geen server die aanbiedingen opslaat. Nieuwe
 * aanbiedingen komen binnen als GitHub-issue (zie het formulier op de pagina)
 * en worden hier bijgezet.
 *
 * `example: true` markeert de voorbeelden hieronder. Die krijgen op de pagina een
 * duidelijk label en blijven buiten de structured data, zodat zoekmachines ze
 * nooit als echte aanbieding oppikken. Verwijder ze zodra er echte aanbiedingen zijn.
 */

export type ListingKind = 'aangeboden' | 'gevraagd';
export type ListingStatus = 'beschikbaar' | 'gereserveerd' | 'verkocht';
export type ListingCategory = 'robot' | 'onderdelen' | 'randapparatuur' | 'overig';

export type Listing = {
	id: string;
	kind: ListingKind;
	category: ListingCategory;
	status: ListingStatus;
	title: Localized;
	description: Localized;
	/** Vrije tekst, bijv. ['Merlin M2']. Leeg laten als het niet modelgebonden is. */
	models: string[];
	/** Vrije tekst: '€ 12.500', 'n.o.t.k.', 'in overleg'. Leeg laten mag. */
	price?: string;
	/** Plaats en land, bijv. 'Middenmeer, NL'. */
	location?: string;
	/** ISO-datum waarop de aanbieding is geplaatst. */
	date: string;
	/** Waar de geïnteresseerde terechtkan: Facebook-post, e-mail, telefoonnummer. */
	contact: { label: string; href: string };
	example?: boolean;
};

export const categoryLabels: Record<ListingCategory, Localized> = {
	robot: { nl: 'Melkrobot', en: 'Milking robot', de: 'Melkroboter' },
	onderdelen: { nl: 'Onderdelen', en: 'Parts', de: 'Ersatzteile' },
	randapparatuur: { nl: 'Randapparatuur', en: 'Peripherals', de: 'Peripherie' },
	overig: { nl: 'Overig', en: 'Other', de: 'Sonstiges' }
};

export const listings: Listing[] = [
	{
		id: 'voorbeeld-robot',
		kind: 'aangeboden',
		category: 'robot',
		status: 'beschikbaar',
		example: true,
		models: ['Merlin M2'],
		price: 'n.o.t.k.',
		location: 'Noord-Holland, NL',
		date: '2026-09-01',
		title: {
			nl: 'Merlin M2, bouwjaar onbekend',
			en: 'Merlin M2, year of manufacture unknown',
			de: 'Merlin M2, Baujahr unbekannt'
		},
		description: {
			nl: 'Voorbeeldaanbieding om de opmaak te tonen. Vervang of verwijder dit item.',
			en: 'Example listing to show the layout. Replace or remove this item.',
			de: 'Beispielanzeige zur Darstellung des Layouts. Ersetzen oder entfernen.'
		},
		contact: { label: 'Facebookgroep', href: 'https://www.facebook.com/groups/593535949346927' }
	},
	{
		id: 'voorbeeld-onderdelen',
		kind: 'aangeboden',
		category: 'onderdelen',
		status: 'beschikbaar',
		example: true,
		models: ['Merlin M2', 'M²erlin'],
		price: '',
		location: '',
		date: '2026-09-01',
		title: {
			nl: 'Partij gebruikte onderdelen',
			en: 'Batch of used parts',
			de: 'Posten gebrauchter Teile'
		},
		description: {
			nl: 'Voorbeeldaanbieding om de opmaak te tonen. Vervang of verwijder dit item.',
			en: 'Example listing to show the layout. Replace or remove this item.',
			de: 'Beispielanzeige zur Darstellung des Layouts. Ersetzen oder entfernen.'
		},
		contact: { label: 'Facebookgroep', href: 'https://www.facebook.com/groups/593535949346927' }
	},
	{
		id: 'voorbeeld-gevraagd',
		kind: 'gevraagd',
		category: 'onderdelen',
		status: 'beschikbaar',
		example: true,
		models: ['Merlin'],
		date: '2026-09-01',
		title: {
			nl: 'Gezocht: onderdelen eerste generatie Merlin',
			en: 'Wanted: parts for the first generation Merlin',
			de: 'Gesucht: Teile für den Merlin der ersten Generation'
		},
		description: {
			nl: 'Voorbeeldoproep om de opmaak te tonen. Vervang of verwijder dit item.',
			en: 'Example request to show the layout. Replace or remove this item.',
			de: 'Beispielgesuch zur Darstellung des Layouts. Ersetzen oder entfernen.'
		},
		contact: { label: 'Facebookgroep', href: 'https://www.facebook.com/groups/593535949346927' }
	}
];
