/**
 * Centrale instellingen. Alles wat je waarschijnlijk wilt wijzigen staat hier.
 */

export const site = {
	repo: 'https://github.com/JacobsFarm/fullwoodroboticusers',
	/**
	 * Alleen het domein, zonder pad. Het pad komt van `base` uit SvelteKit,
	 * zodat canonical, sitemap en og:url ook kloppen bij een eigen domein.
	 */
	origin: 'https://jacobsfarm.github.io'
};

/** Maakt van een pad (inclusief base) een volledige URL. */
export function absoluteUrl(pathname: string): string {
	return new URL(pathname, site.origin).href;
}

export type SocialFeed = {
	id: string;
	/** Publieke URL, gebruikt voor de link naar het kanaal. */
	href: string;
	/** Bepaalt welke embed wordt gebruikt. */
	kind: 'facebook-page' | 'facebook-group' | 'youtube';
	/**
	 * Alleen nodig als de embed een andere URL of id verlangt dan de gewone link.
	 * Facebook Page Plugin: de canonieke pagina-URL.
	 * YouTube: de id van de uploads-playlist (kanaal-id met UC vervangen door UU).
	 */
	embedRef?: string;
};

export const feeds = {
	/** Officiële Fullwood JOZ Facebook-pagina. */
	official: {
		id: 'fullwood-joz',
		href: 'https://www.facebook.com/profile.php?id=100086217441848',
		embedRef: 'https://www.facebook.com/100086217441848',
		kind: 'facebook-page'
	} satisfies SocialFeed,

	/** Facebookgroep Fullwood Merlin M2 enthusiasts. */
	group: {
		id: 'merlin-m2-enthusiasts',
		href: 'https://www.facebook.com/groups/593535949346927',
		kind: 'facebook-group'
	} satisfies SocialFeed,

	/** YouTube-kanaal Fullwood JOZ. UC3TB0... wordt UU3TB0... voor de uploads-playlist. */
	youtube: {
		id: 'fullwood-joz-youtube',
		href: 'https://www.youtube.com/@fullwoodjozgroup',
		embedRef: 'UU3TB0josNb8VOccoRpqmSuw',
		kind: 'youtube'
	} satisfies SocialFeed
};

export type ChannelGroup = {
	id: string;
	platform: string;
	links: { label: string; href: string }[];
};

/** Overige kanalen, gegroepeerd per platform. */
export const channels: ChannelGroup[] = [
	{
		id: 'facebook',
		platform: 'Facebook',
		links: [
			{ label: 'Fullwood JOZ', href: 'https://www.facebook.com/profile.php?id=100086217441848' },
			{ label: 'Fullwood JOZ Nederland', href: 'https://www.facebook.com/FullwoodJOZNederland/' },
			{ label: 'Fullwood JOZ Belgium', href: 'https://www.facebook.com/FullwoodJOZBelgium/' },
			{ label: 'Fullwood JOZ France', href: 'https://www.facebook.com/FullwoodJOZFrance/' },
			{
				label: 'Fullwood Merlin M2 enthusiasts',
				href: 'https://www.facebook.com/groups/593535949346927'
			}
		]
	},
	{
		id: 'linkedin',
		platform: 'LinkedIn',
		links: [
			{ label: 'Fullwood JOZ Group', href: 'https://www.linkedin.com/company/fullwoodjozgroup/' },
			{
				label: 'Fullwood JOZ Nederland',
				href: 'https://www.linkedin.com/company/fullwood-joz-nederland/'
			},
			{ label: 'Fullwood JOZ Belgium', href: 'https://www.linkedin.com/company/fullwood-joz-nv' },
			{ label: 'Fullwood JOZ UK', href: 'https://www.linkedin.com/company/fullwoodjozuk' },
			{
				label: 'Fullwood JOZ France',
				href: 'https://www.linkedin.com/company/fullwood-joz-france/'
			}
		]
	},
	{
		id: 'youtube',
		platform: 'YouTube',
		links: [{ label: 'Fullwood JOZ', href: 'https://www.youtube.com/@fullwoodjozgroup' }]
	},
	{
		id: 'overig',
		platform: 'Instagram & web',
		links: [
			{ label: 'Instagram @fullwoodjoz', href: 'https://www.instagram.com/fullwoodjoz/' },
			{ label: 'fullwood.com', href: 'https://www.fullwood.com/' }
		]
	}
];

/** Alle kanaal-URL's plat, voor sameAs in de structured data. */
export const allChannelUrls = channels.flatMap((group) => group.links.map((link) => link.href));

/**
 * Marktplaats. De site is statisch, dus een aanbieding kan niet worden opgeslagen.
 * Het formulier bouwt daarom een bericht en opent dat op de gekozen manier:
 *
 *   'github' — vooringevuld issue in de repository (standaard, geen extra dienst)
 *   'mailto' — mailprogramma van de bezoeker, naar `email` hieronder
 *
 * Vul bij 'mailto' een adres in dat je publiek wilt tonen.
 */
export const marketplace = {
	submit: 'github' as 'github' | 'mailto',
	email: '',
	issueLabel: 'marktplaats'
};
