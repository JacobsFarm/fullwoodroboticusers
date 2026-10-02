import type { Locale } from '$lib/data/repairs';

const tags: Record<Locale, string> = { nl: 'nl-NL', en: 'en-GB', de: 'de-DE' };

/** Bedrag in euro, bijv. € 11.509,60. Zonder decimalen bij `digits = 0`. */
export function eur(value: number, locale: Locale, digits = 2): string {
	return new Intl.NumberFormat(tags[locale], {
		style: 'currency',
		currency: 'EUR',
		minimumFractionDigits: digits,
		maximumFractionDigits: digits
	}).format(value);
}

/** Gewoon getal met duizendtallen, bijv. 6.500.000. */
export function num(value: number, locale: Locale, digits = 0): string {
	return new Intl.NumberFormat(tags[locale], {
		minimumFractionDigits: digits,
		maximumFractionDigits: digits
	}).format(value);
}

/** Percentage uit een fractie, bijv. 0,41 → 41%. */
export function pct(fraction: number, locale: Locale, digits = 0): string {
	return new Intl.NumberFormat(tags[locale], {
		style: 'percent',
		minimumFractionDigits: digits,
		maximumFractionDigits: digits
	}).format(fraction);
}

/** Euro-bedrag per liter melk uitgedrukt in cent, bijv. 4,69 ct. */
export function cents(valueEur: number, locale: Locale, digits = 2): string {
	return `${num(valueEur * 100, locale, digits)} ct`;
}

/** Korte maand + jaar, bijv. "aug 2022". */
export function monthYear(iso: string, locale: Locale): string {
	// UTC, anders kan 'YYYY-MM' in tijdzones achter UTC op de vorige maand uitkomen.
	return new Intl.DateTimeFormat(tags[locale], {
		month: 'short',
		year: 'numeric',
		timeZone: 'UTC'
	}).format(new Date(iso));
}
