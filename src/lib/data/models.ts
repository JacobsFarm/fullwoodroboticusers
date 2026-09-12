import type { Localized } from './repairs';

/**
 * Modeloverzicht voor de homepage.
 * De specs zijn bewust leeg gelaten: vul ze aan zodra je de juiste gegevens hebt,
 * dan verdwijnt vanzelf de melding "gegevens nog aanvullen".
 */

export type RobotModel = {
	id: string;
	name: string;
	/** Bijvoorbeeld '2016 – heden'. Leeg laten als je het niet zeker weet. */
	period: string;
	blurb: Localized;
	/** Vrije specs, bijv. [{ label: 'Boxen', value: '1' }] */
	specs: { label: Localized; value: string }[];
};

export const models: RobotModel[] = [
	{
		id: 'merlin-m2',
		name: 'Merlin M2',
		period: '',
		blurb: {
			nl: 'De huidige generatie eenboxrobot. Het grootste deel van deze site gaat hierover.',
			en: 'The current single-box generation. Most of this site is about this machine.',
			de: 'Die aktuelle Einbox-Generation. Der größte Teil dieser Seite dreht sich darum.'
		},
		specs: []
	},
	{
		id: 'm2erlin',
		name: 'M²erlin',
		period: '',
		blurb: {
			nl: 'De generatie vóór de M2. Veel onderdelen en storingen komen overeen.',
			en: 'The generation before the M2. Many parts and faults are shared.',
			de: 'Die Generation vor dem M2. Viele Teile und Störungen sind identisch.'
		},
		specs: []
	},
	{
		id: 'merlin',
		name: 'Merlin',
		period: '',
		blurb: {
			nl: 'De eerste generatie Merlin.',
			en: 'The first generation Merlin.',
			de: 'Die erste Generation des Merlin.'
		},
		specs: []
	}
];
