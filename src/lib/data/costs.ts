/**
 * Kostendata voor de pagina's /kosten en /kosten/boerderij.
 *
 * Bron: twee spreadsheets van een melkveehouder met een Merlin (sinds 2009) en
 * een Merlin M2 (sinds augustus 2022). Alle bedragen zijn in euro. Teksten staan
 * per taal, net als in repairs.ts.
 *
 * Nieuwe boerderij toevoegen: voeg een object toe aan `farms` met dezelfde vorm.
 * Totalen worden altijd uit de regels berekend, niet handmatig ingevuld, zodat
 * een regel wijzigen of toevoegen overal doorwerkt.
 */

import type { Locale, Localized } from './repairs';

export type { Locale, Localized };

const L = (nl: string, en: string, de: string): Localized => ({ nl, en, de });

/* ------------------------------------------------------------------ */
/* Categorieën en kleuren                                              */
/* ------------------------------------------------------------------ */

export type CostCategory =
	| 'supplies'
	| 'service'
	| 'repairs'
	| 'licenses'
	| 'installation'
	| 'utilities'
	| 'other';

/**
 * Eén kleur per categorie, op beide pagina's hetzelfde (kleur volgt de categorie).
 * Palet is gevalideerd (validate_palette.js, light): CVD ΔE 9,1 / normaal ΔE 19,6.
 * Drie tinten liggen onder 3:1 contrast op wit; daarom staan de bedragen ook altijd
 * als tekst in legenda, tooltip en tabel.
 */
export const categories: Record<CostCategory, { label: Localized; color: string }> = {
	supplies: {
		label: L(
			'Chemicaliën & verbruiksmiddelen',
			'Chemicals & consumables',
			'Chemikalien & Verbrauchsmaterial'
		),
		color: '#2a78d6'
	},
	service: {
		label: L('Onderhoudsbeurten', 'Service visits', 'Wartungen'),
		color: '#eb6834'
	},
	repairs: {
		label: L('Reparaties', 'Repairs', 'Reparaturen'),
		color: '#1baf7a'
	},
	licenses: {
		label: L('Licenties & updates', 'Licences & updates', 'Lizenzen & Updates'),
		color: '#eda100'
	},
	installation: {
		label: L(
			'Melktank, koeling & overige installatie',
			'Milk tank, cooling & other installation',
			'Milchtank, Kühlung & übrige Anlage'
		),
		color: '#e87ba4'
	},
	utilities: {
		label: L('Water & stroom', 'Water & electricity', 'Wasser & Strom'),
		color: '#008300'
	},
	other: {
		label: L('Overig', 'Other', 'Sonstiges'),
		color: '#8a949c'
	}
};

/* ------------------------------------------------------------------ */
/* Algemene begroting                                                  */
/* ------------------------------------------------------------------ */

export const generalBasis = {
	milkingsPerDay: 180,
	hotCleanings: 3,
	rinses: 10,
	milkingsPerYear: 65_700
};

export type GeneralGroup = 'supplies' | 'utilities' | 'service';

export type GeneralLine = {
	id: string;
	group: GeneralGroup;
	/** Categorie voor de verdeling in de grafiek. */
	category: CostCategory;
	label: Localized;
	/** Aantal en eenheid, voor de regel "20 × € 62,25". */
	qty: number | null;
	unit: Localized | null;
	price: number | null;
	/** Jaarbedrag. `null` = niet te schatten (onvoorzien). */
	total: number | null;
	/** Subtype binnen gebruiksmiddelen, voor de tussentelling. */
	kind?: 'chemical' | 'consumable';
	note: Localized;
};

export const generalLines: GeneralLine[] = [
	{
		id: 'dip',
		group: 'supplies',
		category: 'supplies',
		kind: 'chemical',
		label: L('Dipmiddel', 'Teat dip', 'Dippmittel'),
		qty: 20,
		unit: L('jerrycans', 'jerrycans', 'Kanister'),
		price: 62.25,
		total: 1245,
		note: L(
			'Omgerekend naar 180 melkingen per dag is het eigen verbruik 20 jerrycans van 20 liter. Volgens de gebruikshandleiding zouden het er 65 zijn.',
			'Converted to 180 milkings a day, actual use is 20 jerrycans of 20 litres. According to the user manual it would be 65.',
			'Umgerechnet auf 180 Melkungen pro Tag liegt der tatsächliche Verbrauch bei 20 Kanistern à 20 Liter. Laut Betriebsanleitung wären es 65.'
		)
	},
	{
		id: 'desinfect',
		group: 'supplies',
		category: 'supplies',
		kind: 'chemical',
		label: L('Desinfectiemiddel', 'Disinfectant', 'Desinfektionsmittel'),
		qty: 16,
		unit: L('jerrycans', 'jerrycans', 'Kanister'),
		price: 85.74,
		total: 1371.84,
		note: L(
			'Omgerekend naar 180 melkingen per dag is het eigen verbruik 16 jerrycans van 20 liter. Volgens de gebruikshandleiding zouden het er 65 zijn.',
			'Converted to 180 milkings a day, actual use is 16 jerrycans of 20 litres. According to the user manual it would be 65.',
			'Umgerechnet auf 180 Melkungen pro Tag liegt der tatsächliche Verbrauch bei 16 Kanistern à 20 Liter. Laut Betriebsanleitung wären es 65.'
		)
	},
	{
		id: 'alkaline',
		group: 'supplies',
		category: 'supplies',
		kind: 'chemical',
		label: L('Alkalisch reinigingsmiddel', 'Alkaline cleaner', 'Alkalischer Reiniger'),
		qty: 14,
		unit: L('jerrycans', 'jerrycans', 'Kanister'),
		price: 69.54,
		total: 973.56,
		note: L(
			'Volgens de handleiding gebruikt de robot 711 liter zuur-alkalisch combinatie per jaar. Gedeeld door 25 liter per vat zijn dat 28 vaten: 14 alkalisch en 14 zuur.',
			'According to the manual the robot uses 711 litres of acid and alkaline combined per year. Divided by 25 litres per drum that is 28 drums: 14 alkaline and 14 acid.',
			'Laut Anleitung verbraucht der Roboter 711 Liter Säure und Lauge zusammen pro Jahr. Geteilt durch 25 Liter pro Fass sind das 28 Fässer: 14 Lauge und 14 Säure.'
		)
	},
	{
		id: 'acid',
		group: 'supplies',
		category: 'supplies',
		kind: 'chemical',
		label: L('Zuur reinigingsmiddel', 'Acid cleaner', 'Saurer Reiniger'),
		qty: 14,
		unit: L('jerrycans', 'jerrycans', 'Kanister'),
		price: 80.32,
		total: 1124.48,
		note: L(
			'Zelfde berekening als bij het alkalische middel: 14 vaten zuur per jaar.',
			'Same calculation as for the alkaline cleaner: 14 drums of acid per year.',
			'Gleiche Berechnung wie beim alkalischen Reiniger: 14 Fässer Säure pro Jahr.'
		)
	},
	{
		id: 'oil',
		group: 'supplies',
		category: 'supplies',
		kind: 'consumable',
		label: L('Olie vacuümpomp', 'Vacuum pump oil', 'Vakuumpumpenöl'),
		qty: 3,
		unit: L('vaatjes van 5 liter', 'drums of 5 litres', 'Fässchen à 5 Liter'),
		price: 56.24,
		total: 168.72,
		note: L(
			'De vacuümpomp verbruikt zo’n 3 vaatjes olie van 5 liter per jaar.',
			'The vacuum pump uses roughly 3 drums of 5 litres of oil per year.',
			'Die Vakuumpumpe verbraucht etwa 3 Fässchen Öl à 5 Liter pro Jahr.'
		)
	},
	{
		id: 'liners',
		group: 'supplies',
		category: 'supplies',
		kind: 'consumable',
		label: L('Tepelvoeringen', 'Teat liners', 'Zitzengummis'),
		qty: 104,
		unit: L('stuks', 'pieces', 'Stück'),
		price: 10.81,
		total: 1124.24,
		note: L(
			'Tepelvoeringen worden na 2.500 melkingen vervangen: 365 dagen × 180 melkingen ÷ 2.500 = 26 sets van 4, dus 104 stuks.',
			'Liners are replaced after 2,500 milkings: 365 days × 180 milkings ÷ 2,500 = 26 sets of 4, so 104 pieces.',
			'Zitzengummis werden nach 2.500 Melkungen getauscht: 365 Tage × 180 Melkungen ÷ 2.500 = 26 Sätze à 4, also 104 Stück.'
		)
	},
	{
		id: 'filters',
		group: 'supplies',
		category: 'supplies',
		kind: 'consumable',
		label: L('Melkfilters', 'Milk filters', 'Milchfilter'),
		qty: 8,
		unit: L('dozen van 100', 'boxes of 100', 'Packungen à 100'),
		price: 23.5,
		total: 188,
		note: L(
			'Tweemaal daags het filter verwisselen is 730 filters per jaar, afgerond 8 dozen van 100.',
			'Changing the filter twice a day is 730 filters a year, rounded to 8 boxes of 100.',
			'Zweimal täglich den Filter wechseln sind 730 Filter pro Jahr, aufgerundet 8 Packungen à 100.'
		)
	},
	{
		id: 'water-cold',
		group: 'utilities',
		category: 'utilities',
		label: L('Koud water', 'Cold water', 'Kaltwasser'),
		qty: 430.7,
		unit: L('m³', 'm³', 'm³'),
		price: 1.03,
		total: 443.62,
		note: L(
			'De Merlin M2 gebruikt zo’n 430.700 liter koud water per jaar. De prijs in Nederland is ongeveer € 1,03 per 1.000 liter.',
			'The Merlin M2 uses about 430,700 litres of cold water per year. The price in the Netherlands is roughly €1.03 per 1,000 litres.',
			'Der Merlin M2 verbraucht etwa 430.700 Liter Kaltwasser pro Jahr. Der Preis in den Niederlanden liegt bei rund 1,03 € pro 1.000 Liter.'
		)
	},
	{
		id: 'water-hot',
		group: 'utilities',
		category: 'utilities',
		label: L('Warm water', 'Hot water', 'Warmwasser'),
		qty: 70,
		unit: L('m³', 'm³', 'm³'),
		price: 1.03,
		total: 72.1,
		note: L(
			'Zo’n 70.080 liter heet water per jaar, tegen dezelfde waterprijs. De energie om het water op te warmen is niet meegerekend.',
			'About 70,080 litres of hot water per year at the same water price. The energy used to heat the water is not included.',
			'Rund 70.080 Liter Heißwasser pro Jahr zum gleichen Wasserpreis. Die Energie zum Erhitzen des Wassers ist nicht enthalten.'
		)
	},
	{
		id: 'electricity',
		group: 'utilities',
		category: 'utilities',
		label: L('Stroom, alleen de robot', 'Electricity, robot only', 'Strom, nur der Roboter'),
		qty: 1314,
		unit: L('kWh', 'kWh', 'kWh'),
		price: 0.36,
		total: 473.04,
		note: L(
			'1.314 kWh per jaar tegen € 0,36 per kWh. Exclusief compressor, vacuümpomp en overige apparatuur.',
			'1,314 kWh per year at €0.36 per kWh. Excluding the compressor, vacuum pump and other equipment.',
			'1.314 kWh pro Jahr zu 0,36 € pro kWh. Ohne Kompressor, Vakuumpumpe und übrige Geräte.'
		)
	},
	{
		id: 'service',
		group: 'service',
		category: 'service',
		label: L('Onderhoudsbeurten, 3 keer per jaar', 'Service visits, 3 times a year', 'Wartungen, 3 × pro Jahr'),
		qty: 3,
		unit: L('beurten', 'visits', 'Wartungen'),
		price: null,
		total: 3500,
		note: L(
			'De robot krijgt om de 4 maanden een servicebeurt. Gerekend is met 2 × € 1.000 en 1 × € 1.500. Veruit de grootste kostenpost is het vervangen van onderdelen; dit kan veel hoger uitvallen.',
			'The robot is serviced every 4 months. The calculation uses 2 × €1,000 and 1 × €1,500. By far the largest cost is replacing parts, which can come out much higher.',
			'Der Roboter wird alle 4 Monate gewartet. Gerechnet wurde mit 2 × 1.000 € und 1 × 1.500 €. Mit Abstand der größte Posten ist der Teiletausch; er kann deutlich höher ausfallen.'
		)
	},
	{
		id: 'software',
		group: 'service',
		category: 'licenses',
		label: L('Software-updates, 2 keer per jaar', 'Software updates, twice a year', 'Software-Updates, 2 × pro Jahr'),
		qty: 2,
		unit: L('halfjaren', 'half-years', 'Halbjahre'),
		price: 412.5,
		total: 825,
		note: L(
			'De licentiekosten voor Crystal en MerlinView, inclusief updates, zijn € 412,50 per halfjaar, ongeacht het aantal koeien.',
			'Licence costs for Crystal and MerlinView, including updates, are €412.50 per half-year regardless of the number of cows.',
			'Die Lizenzkosten für Crystal und MerlinView inklusive Updates betragen 412,50 € pro Halbjahr, unabhängig von der Kuhzahl.'
		)
	},
	{
		id: 'unforeseen',
		group: 'service',
		category: 'repairs',
		label: L('Onvoorziene reparaties', 'Unforeseen repairs', 'Unvorhergesehene Reparaturen'),
		qty: null,
		unit: null,
		price: null,
		total: null,
		note: L(
			'Houd altijd rekening met onvoorziene reparaties en de kosten die die met zich meebrengen. Dit bedrag is niet te begroten en zit niet in het totaal.',
			'Always allow for unforeseen repairs and the costs they bring. This amount cannot be budgeted and is not part of the total.',
			'Rechnen Sie immer mit unvorhergesehenen Reparaturen und den damit verbundenen Kosten. Dieser Betrag lässt sich nicht planen und ist nicht im Gesamtbetrag enthalten.'
		)
	}
];

export const generalGroups: { id: GeneralGroup; label: Localized }[] = [
	{ id: 'supplies', label: L('Gebruiksmiddelen', 'Supplies', 'Betriebsmittel') },
	{ id: 'utilities', label: L('Water en elektriciteit', 'Water and electricity', 'Wasser und Strom') },
	{ id: 'service', label: L('Onderhoud, licenties en reparaties', 'Service, licences and repairs', 'Wartung, Lizenzen und Reparaturen') }
];

/* ------------------------------------------------------------------ */
/* Prijsontwikkeling                                                   */
/* ------------------------------------------------------------------ */

export type PricePoint = { price: number; date: string | null };

export type PriceHistory = {
	id: string;
	label: Localized;
	/** Prijspeil 2023, zoals in de begroting. */
	now: number;
	/** Oudste eerst. */
	before: PricePoint[];
	unit: Localized;
};

const perPiece = L('per stuk', 'per piece', 'pro Stück');

export const priceHistory: PriceHistory[] = [
	{
		id: 'acid',
		label: L('Zuur reinigingsmiddel', 'Acid cleaner', 'Saurer Reiniger'),
		unit: perPiece,
		now: 80.32,
		before: [
			{ price: 42.22, date: '2019-06-13' },
			{ price: 48.5, date: '2021-12-23' }
		]
	},
	{
		id: 'alkaline',
		label: L('Alkalisch reinigingsmiddel', 'Alkaline cleaner', 'Alkalischer Reiniger'),
		unit: perPiece,
		now: 69.54,
		before: [
			{ price: 40.23, date: '2019-06-13' },
			{ price: 55.46, date: '2022-08-23' }
		]
	},
	{
		id: 'oil',
		label: L('Olie vacuümpomp (5 L)', 'Vacuum pump oil (5 L)', 'Vakuumpumpenöl (5 L)'),
		unit: perPiece,
		now: 56.24,
		before: [
			{ price: 35.98, date: '2019-06-13' },
			{ price: 35.98, date: '2021-12-31' }
		]
	},
	{
		id: 'desinfect',
		label: L('Desinfectiemiddel', 'Disinfectant', 'Desinfektionsmittel'),
		unit: perPiece,
		now: 85.74,
		before: [
			{ price: 64.77, date: '2019-09-27' },
			{ price: 74.42, date: '2021-12-24' }
		]
	},
	{
		id: 'liners',
		label: L('Tepelvoering', 'Teat liner', 'Zitzengummi'),
		unit: perPiece,
		now: 10.81,
		before: [
			{ price: 9.22, date: '2019-06-13' },
			{ price: 9.54, date: '2021-10-18' }
		]
	},
	{
		id: 'filters',
		label: L('Melkfilters (100 stuks)', 'Milk filters (100 pieces)', 'Milchfilter (100 Stück)'),
		unit: L('per doos', 'per box', 'pro Packung'),
		now: 23.5,
		before: [
			{ price: 22, date: '2020-08-17' },
			{ price: 23.5, date: '2021-12-23' }
		]
	},
	{
		id: 'water',
		label: L('Water', 'Water', 'Wasser'),
		unit: L('per m³', 'per m³', 'pro m³'),
		now: 1.03,
		before: [{ price: 0.6, date: null }]
	},
	{
		id: 'electricity',
		label: L('Stroom', 'Electricity', 'Strom'),
		unit: L('per kWh', 'per kWh', 'pro kWh'),
		now: 0.36,
		before: [{ price: 0.16, date: null }]
	},
	{
		id: 'software',
		label: L('Software-update (halfjaar)', 'Software update (half-year)', 'Software-Update (Halbjahr)'),
		unit: L('per halfjaar', 'per half-year', 'pro Halbjahr'),
		now: 412.5,
		before: [{ price: 375, date: '2022-07-07' }]
	}
];

/* ------------------------------------------------------------------ */
/* Boerderijvoorbeeld                                                  */
/* ------------------------------------------------------------------ */

export type Item = {
	cat: CostCategory;
	amount: number;
	label: Localized;
};

export type OneOff = {
	amount: number;
	label: Localized;
};

export type GebruiksJaar = {
	n: 1 | 2 | 3 | 4;
	/** ISO-maanden, voor de periode-weergave. */
	from: string;
	to: string;
	ongoing?: boolean;
	liters: number;
	/** Betaalde arbeidsuren binnen de dealerfacturen. Jaar 1 is niet bijgehouden. */
	labour: number | null;
	summary: Localized;
	items: Item[];
	/** Eenmalige aanschaffen en investeringen, niet in de jaarkosten. */
	oneOffs: OneOff[];
};

const i = (cat: CostCategory, amount: number, label: Localized): Item => ({ cat, amount, label });

export const m2Years: GebruiksJaar[] = [
	{
		n: 1,
		from: '2022-08',
		to: '2023-08',
		liters: 470_000,
		labour: null,
		summary: L(
			'Eerste jaar na installatie: drie onderhoudsbeurten en veel kleine posten rond tank, boiler en droger.',
			'First year after installation: three service visits and many small items around the tank, boiler and dryer.',
			'Erstes Jahr nach der Installation: drei Wartungen und viele kleine Posten rund um Tank, Boiler und Trockner.'
		),
		items: [
			i('supplies', 3115, L('Reinigingsmiddelen en onderdelen (7 facturen)', 'Cleaning agents and parts (7 invoices)', 'Reinigungsmittel und Ersatzteile (7 Rechnungen)')),
			i('supplies', 1147, L('Onderdelen bij 2e onderhoudsbeurt', 'Parts used at second service visit', 'Ersatzteile bei der zweiten Wartung')),
			i('supplies', 1100, L('Dipmiddel', 'Teat dip', 'Dippmittel')),
			i('supplies', 150, L('Melkfilters', 'Milk filters', 'Milchfilter')),
			i('service', 906, L('1e onderhoudsbeurt (om de 4 maanden)', '1st service visit (every 4 months)', '1. Wartung (alle 4 Monate)')),
			i('service', 1124, L('2e onderhoudsbeurt (excl. onderdelen)', '2nd service visit (excl. parts)', '2. Wartung (ohne Teile)')),
			i('service', 1444, L('3e onderhoudsbeurt', '3rd service visit', '3. Wartung')),
			i('licenses', 412, L('Software-updatecontract Merlin (halfjaar)', 'Merlin software update contract (half-year)', 'Software-Updatevertrag Merlin (Halbjahr)')),
			i('licenses', 412.5, L('Software-updatecontract Merlin (halfjaar)', 'Merlin software update contract (half-year)', 'Software-Updatevertrag Merlin (Halbjahr)')),
			i('repairs', 0, L('Pulsator vervangen (onder garantie)', 'Pulsator replaced (under warranty)', 'Pulsator ersetzt (Garantie)')),
			i('repairs', 135.22, L('HMI-touchscreen vervangen', 'HMI touchscreen replaced', 'HMI-Touchscreen ersetzt')),
			i('other', 125, L('Installatie Crystal-software', 'Crystal software installation', 'Installation der Crystal-Software')),
			i('installation', 188, L('Hittereiniger boiler defect', 'Boiler heat cleaner faulty', 'Boiler-Heißreiniger defekt')),
			i('installation', 178, L('Hittereiniger boiler defect, 2e keer', 'Boiler heat cleaner faulty, second time', 'Boiler-Heißreiniger defekt, zweites Mal')),
			i('installation', 996, L('Onderhoud absorptiedroger', 'Adsorption dryer maintenance', 'Wartung Adsorptionstrockner')),
			i('installation', 453, L('Abonnement melkkoeltank (heel jaar)', 'Milk cooling tank subscription (full year)', 'Abonnement Milchkühltank (ganzes Jahr)')),
			i('installation', 224, L('Tankkraan lekt (3 meldingen)', 'Tank tap leaking (3 call-outs)', 'Tankhahn undicht (3 Einsätze)')),
			i('installation', 221, L('Oog van de voervijzel kapot en vervangen', 'Feed auger eye broken and replaced', 'Auge der Futterschnecke defekt und ersetzt'))
		],
		oneOffs: [
			{ amount: 404, label: L('Stappentellers', 'Pedometers', 'Schrittzähler') }
		]
	},
	{
		n: 2,
		from: '2023-08',
		to: '2024-10',
		liters: 440_000,
		labour: 2219.44,
		summary: L(
			'Het goedkoopste jaar tot nu toe: twee onderhoudsbeurten en vooral kleine reparaties.',
			'The cheapest year so far: two service visits and mostly small repairs.',
			'Das bisher günstigste Jahr: zwei Wartungen und vor allem kleine Reparaturen.'
		),
		items: [
			i('supplies', 1064.46, L('Dipmiddel', 'Teat dip', 'Dippmittel')),
			i('supplies', 754.38, L('Desinfectiemiddel', 'Disinfectant', 'Desinfektionsmittel')),
			i('supplies', 555.54, L('Zuur reinigingsmiddel', 'Acid cleaner', 'Saurer Reiniger')),
			i('supplies', 664.21, L('Alkalisch reinigingsmiddel', 'Alkaline cleaner', 'Alkalischer Reiniger')),
			i('supplies', 399.35, L('Olie en tepelvoeringen', 'Oil and teat liners', 'Öl und Zitzengummis')),
			i('supplies', 168.44, L('Olie en bandjes stappentellers', 'Oil and pedometer straps', 'Öl und Bänder für Schrittzähler')),
			i('supplies', 350.51, L('Tepelvoeringen', 'Teat liners', 'Zitzengummis')),
			i('supplies', 183.89, L('Melkfilters (2 bestellingen)', 'Milk filters (2 orders)', 'Milchfilter (2 Bestellungen)')),
			i('service', 1410.33, L('Onderhoudsbeurt (na 4 maanden)', 'Service visit (after 4 months)', 'Wartung (nach 4 Monaten)')),
			i('service', 2101.21, L('Grote onderhoudsbeurt (na 8 maanden)', 'Major service visit (after 8 months)', 'Große Wartung (nach 8 Monaten)')),
			i('repairs', 266.96, L('Dipspraypomp lekt, vervangen', 'Dip spray pump leaking, replaced', 'Dippsprühpumpe undicht, ersetzt')),
			i('repairs', 291.94, L('Horizontaalband gebroken, vervangen', 'Horizontal belt broken, replaced', 'Horizontalband gerissen, ersetzt')),
			i('repairs', 348.66, L('1 verticaalband gebroken, beide vervangen', '1 vertical belt broken, both replaced', '1 Vertikalband gerissen, beide ersetzt')),
			i('repairs', 216.88, L('Kabelbreuk in printkaartenkast (UCC-arm)', 'Cable break in circuit board cabinet (UCC arm)', 'Kabelbruch im Platinenschrank (UCC-Arm)')),
			i('repairs', 110.47, L('Dippomp vervangen (onder garantie)', 'Dip pump replaced (under warranty)', 'Dipppumpe ersetzt (Garantie)')),
			i('licenses', 412.5, L('Support- en updatecontract Merlin M2', 'Merlin M2 support and update contract', 'Support- und Updatevertrag Merlin M2')),
			i('licenses', 412.5, L('Support- en updatecontract Merlin M2', 'Merlin M2 support and update contract', 'Support- und Updatevertrag Merlin M2')),
			i('installation', 289.28, L('Oculus-reparatie melktank', 'Oculus repair, milk tank', 'Oculus-Reparatur Milchtank')),
			i('installation', 25.5, L('Condensator vervangen melktank', 'Condenser replaced, milk tank', 'Kondensator Milchtank ersetzt')),
			i('installation', 453.2, L('Abonnement koeling', 'Cooling subscription', 'Kühlungs-Abonnement')),
			i('installation', 61, L('Condensatorzekering geslagen (onder contract)', 'Condenser fuse blown (under contract)', 'Kondensatorsicherung durchgebrannt (Vertrag)')),
			i('other', 93.12, L('Koevolger-coördinaten bijgesteld', 'Cow follower coordinates adjusted', 'Kuhfolger-Koordinaten angepasst')),
			i('other', 197.94, L('Melkkwaliteit gecontroleerd, vacuüm verlaagd', 'Milk quality checked, vacuum lowered', 'Milchqualität geprüft, Vakuum gesenkt'))
		],
		oneOffs: [
			{ amount: 780, label: L('Multidos-doseerunit incl. installatie', 'Multidos dosing unit incl. installation', 'Multidos-Dosiereinheit inkl. Installation') },
			{ amount: 75, label: L('3 gebruikte stappentellers', '3 used pedometers', '3 gebrauchte Schrittzähler') },
			{ amount: 160, label: L('8 gebruikte stappentellers (oud model)', '8 used pedometers (old model)', '8 gebrauchte Schrittzähler (altes Modell)') }
		]
	},
	{
		n: 3,
		from: '2024-11',
		to: '2025-12',
		liters: 480_000,
		labour: 3326.5,
		summary: L(
			'Jaar met drie onderhoudsbeurten, een grotere reparatie aan een servo en een nieuwe koelmachine (eenmalig, niet meegeteld).',
			'A year with three service visits, a larger servo repair and a new cooling machine (one-off, not counted).',
			'Jahr mit drei Wartungen, einer größeren Servo-Reparatur und einer neuen Kühlmaschine (einmalig, nicht mitgezählt).'
		),
		items: [
			i('supplies', 610.37, L('Dipmiddel', 'Teat dip', 'Dippmittel')),
			i('supplies', 754.38, L('Desinfectiemiddel', 'Disinfectant', 'Desinfektionsmittel')),
			i('supplies', 861.81, L('Zuur reinigingsmiddel', 'Acid cleaner', 'Saurer Reiniger')),
			i('supplies', 738.04, L('Alkalisch reinigingsmiddel', 'Alkaline cleaner', 'Alkalischer Reiniger')),
			i('supplies', 139.85, L('Onderdeel: oog voervijzel', 'Part: feed auger eye', 'Teil: Auge Futterschnecke')),
			i('supplies', 584.43, L('Onderdelen melkrobot', 'Milking robot parts', 'Ersatzteile Melkroboter')),
			i('supplies', 31.54, L('Kogelstangkop voor de losse voerbak', 'Ball joint for the loose feed bin', 'Kugelkopf für den losen Futtertrog')),
			i('supplies', 525.83, L('Onderdelen: tepelvoeringen, vacuümolie e.d.', 'Parts: teat liners, vacuum oil etc.', 'Teile: Zitzengummis, Vakuumöl usw.')),
			i('service', 2119.12, L('1e onderhoudsbeurt', '1st service visit', '1. Wartung')),
			i('service', 1287.83, L('2e onderhoudsbeurt', '2nd service visit', '2. Wartung')),
			i('service', 1358.03, L('3e onderhoudsbeurt', '3rd service visit', '3. Wartung')),
			i('repairs', 1974.75, L('Defecte servo en “defecte” magneetschakelaar gerepareerd', 'Faulty servo and “faulty” solenoid switch repaired', 'Defekten Servo und „defekten“ Magnetschalter repariert')),
			i('repairs', 465.75, L('Softwareprobleem: de oude computer nam het over', 'Software problem: the old computer took over', 'Softwareproblem: der alte Computer übernahm')),
			i('repairs', 203.25, L('Melkmeter geijkt, voerbak los', 'Milk meter calibrated, feed bin loose', 'Milchmengenmesser geeicht, Futtertrog lose')),
			i('licenses', 412.5, L('Support- en updatecontract Merlin M2', 'Merlin M2 support and update contract', 'Support- und Updatevertrag Merlin M2')),
			i('licenses', 412.5, L('Support- en updatecontract Merlin M2', 'Merlin M2 support and update contract', 'Support- und Updatevertrag Merlin M2')),
			i('installation', 498.52, L('Abonnement koeling', 'Cooling subscription', 'Kühlungs-Abonnement')),
			i('installation', 88.93, L('Waterklep defect (onder contract)', 'Water valve faulty (under contract)', 'Wasserventil defekt (Vertrag)')),
			i('installation', 12.18, L('Onderdelen melktank', 'Milk tank parts', 'Teile Milchtank'))
		],
		oneOffs: [
			{ amount: 6076, label: L('Nieuwe koelmachine 4,5 kW (incl. € 479,25 arbeid)', 'New cooling machine 4.5 kW (incl. €479.25 labour)', 'Neue Kühlmaschine 4,5 kW (inkl. 479,25 € Arbeit)') }
		]
	},
	{
		n: 4,
		from: '2025-12',
		to: '2026-10',
		ongoing: true,
		liters: 440_000,
		labour: 2645.25,
		summary: L(
			'Lopend jaar, nog niet compleet: vacuümpomp vervangen en een nieuwe borstel-unit.',
			'Year in progress, not complete yet: vacuum pump replaced and a new brush unit.',
			'Laufendes Jahr, noch nicht vollständig: Vakuumpumpe ersetzt und neue Bürsteneinheit.'
		),
		items: [
			i('supplies', 740.99, L('Dipmiddel', 'Teat dip', 'Dippmittel')),
			i('supplies', 737.95, L('Zuur reinigingsmiddel', 'Acid cleaner', 'Saurer Reiniger')),
			i('supplies', 629.97, L('Alkalisch reinigingsmiddel', 'Alkaline cleaner', 'Alkalischer Reiniger')),
			i('supplies', 46.55, L('Stappenteller: pootband en verzendkosten', 'Pedometer: leg strap and shipping', 'Schrittzähler: Beinband und Versand')),
			i('service', 3075.62, L('1e onderhoudsbeurt', '1st service visit', '1. Wartung')),
			i('service', 3184.3, L('2e onderhoudsbeurt', '2nd service visit', '2. Wartung')),
			i('repairs', 2000, L('Tweedehands Buschmann-vacuümpomp (1 jaar oud) met frequentieregelaar', 'Second-hand Buschmann vacuum pump (1 year old) with frequency controller', 'Gebrauchte Buschmann-Vakuumpumpe (1 Jahr alt) mit Frequenzumrichter')),
			i('repairs', 650, L('Vacuümpomp wisselen (8 uur)', 'Vacuum pump swap (8 hours)', 'Vakuumpumpe tauschen (8 Stunden)')),
			i('repairs', 800, L('Borstel: nieuwe unit (kapotte kabel)', 'Brush: new unit (broken cable)', 'Bürste: neue Einheit (defektes Kabel)')),
			i('repairs', 0, L('Borstel: draadbreuk, 2 keer zelf opgelost', 'Brush: wire break, fixed by the owner twice', 'Bürste: Drahtbruch, 2 × selbst behoben')),
			i('repairs', 0, L('Dipmiddelpomp lekt (nog te repareren)', 'Dip pump leaking (still to be repaired)', 'Dippmittelpumpe undicht (noch zu reparieren)')),
			i('licenses', 420.75, L('Fullsense-licentie', 'Fullsense licence', 'Fullsense-Lizenz')),
			i('licenses', 420.75, L('Softwarecontract Fullsense', 'Fullsense software contract', 'Softwarevertrag Fullsense')),
			i('installation', 508.49, L('Abonnement koeling', 'Cooling subscription', 'Kühlungs-Abonnement')),
			i('installation', 59.96, L('Magneetklepspoel vervangen (onder contract)', 'Solenoid valve coil replaced (under contract)', 'Magnetventilspule ersetzt (Vertrag)'))
		],
		oneOffs: []
	}
];

/** Som van de jaarkosten (zonder eenmalige posten). */
export function yearTotal(year: GebruiksJaar): number {
	return year.items.reduce((sum, item) => sum + item.amount, 0);
}

export function yearByCategory(year: GebruiksJaar): Record<CostCategory, number> {
	const out = Object.fromEntries(Object.keys(categories).map((key) => [key, 0])) as Record<
		CostCategory,
		number
	>;
	for (const item of year.items) out[item.cat] += item.amount;
	return out;
}

/* ------------------------------------------------------------------ */
/* Kalenderjaren 2009 t/m 2023                                         */
/* ------------------------------------------------------------------ */

export type CalendarYear = {
	year: number;
	/** Facturen van de dealer: service, onderdelen, licenties. `null` = geen gegevens. */
	dealer: number | null;
	/** Reinigingsmiddelen en overig bij derden, alleen waar de spreadsheet ze apart toont. */
	third?: number;
	/** Schatting voor jaren zonder gegevens. */
	estimate?: number;
	/** Wat bewust niet in het jaarbedrag zit. */
	excluded?: OneOff[];
	note?: Localized;
};

export const calendarYears: CalendarYear[] = [
	{
		year: 2009,
		dealer: 3483.66,
		excluded: [
			{ amount: 159223.5, label: L('Installatie robot, tank en toebehoren (incl. btw)', 'Robot, tank and accessories installation (incl. VAT)', 'Installation Roboter, Tank und Zubehör (inkl. MwSt.)') },
			{ amount: 12593.07, label: L('Stalinrichting (o.a. matrassen)', 'Barn fittings (incl. mattresses)', 'Stalleinrichtung (u. a. Matratzen)') }
		],
		note: L('Robot in de zomer geïnstalleerd, dus een gedeeltelijk jaar.', 'Robot installed in the summer, so a partial year.', 'Roboter im Sommer installiert, also ein Teiljahr.')
	},
	{
		year: 2010,
		dealer: 12167.94,
		excluded: [{ amount: 5041.96, label: L('Weidebox', 'Pasture box', 'Weidebox') }],
		note: L('Veel storingen en servicebeurten in de administratie.', 'Many faults and service visits in the records.', 'Viele Störungen und Wartungen in den Unterlagen.')
	},
	{
		year: 2011,
		dealer: 15891.95,
		note: L('Onder meer een printplaat (€ 1.800 excl. btw) en compressor (€ 1.876 excl. btw) vervangen.', 'Among other things a circuit board (€1,800 excl. VAT) and compressor (€1,876 excl. VAT) replaced.', 'Unter anderem Platine (1.800 € netto) und Kompressor (1.876 € netto) ersetzt.')
	},
	{
		year: 2012,
		dealer: null,
		estimate: 9000,
		note: L('Geen gegevens. Het bedrag is een schatting.', 'No data. The amount is an estimate.', 'Keine Daten. Der Betrag ist eine Schätzung.')
	},
	{
		year: 2013,
		dealer: null,
		estimate: 9000,
		note: L('Geen gegevens. Het bedrag is een schatting.', 'No data. The amount is an estimate.', 'Keine Daten. Der Betrag ist eine Schätzung.')
	},
	{ year: 2014, dealer: 7527 },
	{
		year: 2015,
		dealer: 8699,
		excluded: [{ amount: 6960, label: L('Extra vacuümpomp (installatie voor enkele melker)', 'Extra vacuum pump (installation for single milker)', 'Zusätzliche Vakuumpumpe (Installation für Einzelmelker)') }]
	},
	{ year: 2016, dealer: 11534 },
	{ year: 2017, dealer: 10265 },
	{ year: 2018, dealer: 9666 },
	{ year: 2019, dealer: 15738 },
	{ year: 2020, dealer: 13243, third: 1337 },
	{
		year: 2021,
		dealer: 13424,
		third: 2178,
		excluded: [{ amount: 4271, label: L('Warmteterugwinning', 'Heat recovery', 'Wärmerückgewinnung') }]
	},
	{
		year: 2022,
		dealer: 9299,
		third: 1277,
		excluded: [{ amount: 85000, label: L('Aankoop Merlin M2 (incl. btw)', 'Purchase of the Merlin M2 (incl. VAT)', 'Kauf des Merlin M2 (inkl. MwSt.)') }],
		note: L('Overgangsjaar: de M2 is in augustus geïnstalleerd.', 'Transition year: the M2 was installed in August.', 'Übergangsjahr: der M2 wurde im August installiert.')
	},
	{
		year: 2023,
		dealer: 9826.77,
		third: 1721.78,
		note: L('Eerste volledige kalenderjaar met de Merlin M2.', 'First full calendar year with the Merlin M2.', 'Erstes volles Kalenderjahr mit dem Merlin M2.')
	}
];

export function calendarTotal(year: CalendarYear): number {
	return (year.dealer ?? 0) + (year.third ?? 0) + (year.estimate ?? 0);
}

/* ------------------------------------------------------------------ */
/* Totale kosten over 13 jaar Merlin                                   */
/* ------------------------------------------------------------------ */

export const lifetime = {
	years: 13,
	liters: 6_500_000,
	/** Complete installatie 2009 incl. btw (robot, tank, montage, stappentellers). */
	purchase: 159_223.5,
	/** Onderhoud en reparaties 2009–2022, incl. btw, zoals in de spreadsheet (na een correctie van −€ 3.000). */
	maintenance: 145_938.55,
	rule: { fromCents: 3, toCents: 5 }
};

export const purchases: { id: string; label: Localized; incl: number; excl: number; vat: number }[] = [
	{
		id: 'merlin-2009',
		label: L('Merlin melkrobot (2009)', 'Merlin milking robot (2009)', 'Merlin-Melkroboter (2009)'),
		incl: 122_570,
		excl: 103_000,
		vat: 0.19
	},
	{
		id: 'tank-2009',
		label: L('Melktank Packo Dolphin 6.000 L (2009)', 'Packo Dolphin 6,000 L milk tank (2009)', 'Milchtank Packo Dolphin 6.000 L (2009)'),
		incl: 21_981.54,
		excl: 19_528,
		vat: 0.19
	},
	{
		id: 'm2-2022',
		label: L('Merlin M2 (2022)', 'Merlin M2 (2022)', 'Merlin M2 (2022)'),
		incl: 85_002.5,
		excl: 70_250,
		vat: 0.21
	}
];

export const farmFacts = {
	milkingsPerDay: 120,
	m2Purchased: '2022-01-12',
	m2Installed: '2022-08-18'
};
