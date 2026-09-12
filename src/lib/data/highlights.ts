/**
 * Handmatig uitgelichte berichten.
 *
 * Waarom handmatig: Facebook geeft de laatste berichten van een pagina of groep
 * die je niet zelf beheert niet vrij via een API. De tijdlijnen op de socials-pagina
 * komen daarom uit de officiële Facebook-embeds. Wil je een bericht vasthouden
 * zodat het niet in de tijdlijn verdwijnt, zet het dan hier neer.
 */

export type Highlight = {
	id: string;
	/** 'official' = Fullwood JOZ, 'group' = Merlin M2 enthusiast */
	source: 'official' | 'group';
	/** ISO-datum, bijv. '2026-09-01' */
	date: string;
	title: string;
	excerpt: string;
	href: string;
};

export const highlights: Highlight[] = [
	// Voorbeeld — verwijderen of vervangen:
	// {
	// 	id: 'voorbeeld',
	// 	source: 'group',
	// 	date: '2026-09-01',
	// 	title: 'Tepelvoeringen: welk interval houden jullie aan?',
	// 	excerpt: 'Lange draad met ervaringen over wisselintervallen en merken.',
	// 	href: 'https://www.facebook.com/groups/.../posts/.../'
	// }
];
