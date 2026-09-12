/**
 * Reparatie-database.
 *
 * Elk item is per taal ingevuld. Nieuwe storing toevoegen = een object bijzetten;
 * de pagina, filters en zoekfunctie pakken het automatisch op.
 *
 * `verified: false` toont op de pagina de melding dat het nog om voorbeeldinhoud gaat.
 * Zet op `true` zodra iemand met praktijkervaring het item heeft nagelopen.
 */

export type Locale = 'nl' | 'en' | 'de';
export type Localized = Record<Locale, string>;
export type LocalizedList = Record<Locale, string[]>;

export type Difficulty = 'easy' | 'medium' | 'hard';

export type CategoryId =
	| 'melkstel'
	| 'vacuum'
	| 'arm'
	| 'reiniging'
	| 'perslucht'
	| 'elektrisch';

export type Category = {
	id: CategoryId;
	label: Localized;
};

export const categories: Category[] = [
	{
		id: 'melkstel',
		label: { nl: 'Melkstel', en: 'Cluster', de: 'Melkzeug' }
	},
	{
		id: 'vacuum',
		label: { nl: 'Vacuüm', en: 'Vacuum', de: 'Vakuum' }
	},
	{
		id: 'arm',
		label: { nl: 'Robotarm & detectie', en: 'Arm & detection', de: 'Arm & Erkennung' }
	},
	{
		id: 'reiniging',
		label: { nl: 'Reiniging', en: 'Cleaning', de: 'Reinigung' }
	},
	{
		id: 'perslucht',
		label: { nl: 'Perslucht', en: 'Compressed air', de: 'Druckluft' }
	},
	{
		id: 'elektrisch',
		label: { nl: 'Elektrisch & besturing', en: 'Electrics & control', de: 'Elektrik & Steuerung' }
	}
];

export type Repair = {
	id: string;
	category: CategoryId;
	difficulty: Difficulty;
	/** Vrije tekst, bijv. ['Merlin M2', 'M²erlin'] */
	models: string[];
	title: Localized;
	summary: Localized;
	symptoms: LocalizedList;
	causes: LocalizedList;
	steps: LocalizedList;
	parts: LocalizedList;
	verified: boolean;
};

export const repairs: Repair[] = [
	{
		id: 'tepelvoeringen',
		category: 'melkstel',
		difficulty: 'easy',
		models: ['Merlin M2', 'M²erlin', 'Merlin'],
		verified: false,
		title: {
			nl: 'Versleten tepelvoeringen',
			en: 'Worn liners',
			de: 'Verschlissene Zitzengummis'
		},
		summary: {
			nl: 'Voeringen die het aantal melkingen uit het onderhoudsinterval hebben overschreden.',
			en: 'Liners that have exceeded the number of milkings in the service interval.',
			de: 'Zitzengummis, die die Melkungen des Wartungsintervalls überschritten haben.'
		},
		symptoms: {
			nl: [
				'Melkstel valt er tijdens het melken af',
				'Langere melktijden en hogere restmelk',
				'Meer speenpuntverhoorning of rode spenen',
				'Oplopend celgetal zonder duidelijke andere oorzaak'
			],
			en: [
				'Cluster falls off during milking',
				'Longer milking times and more residual milk',
				'More teat-end hyperkeratosis or red teats',
				'Rising cell count with no other obvious cause'
			],
			de: [
				'Melkzeug fällt während des Melkens ab',
				'Längere Melkzeiten und mehr Restmilch',
				'Mehr Hyperkeratose an der Zitzenspitze oder rote Zitzen',
				'Steigende Zellzahl ohne andere klare Ursache'
			]
		},
		causes: {
			nl: [
				'Aantal melkingen boven het advies van de fabrikant',
				'Scheurtjes of vervorming in de voering',
				'Verkeerd type voering voor de veestapel',
				'Lekkende kortmelkslang'
			],
			en: [
				'Milkings beyond the manufacturer interval',
				'Cracks or deformation in the liner',
				'Wrong liner type for the herd',
				'Leaking short milk tube'
			],
			de: [
				'Melkungen über dem Herstellerintervall',
				'Risse oder Verformung im Zitzengummi',
				'Falscher Gummityp für die Herde',
				'Undichter kurzer Milchschlauch'
			]
		},
		steps: {
			nl: [
				'Lees het aantal melkingen sinds de laatste wissel af in de software',
				'Draai de voering binnenstebuiten en controleer op scheurtjes en ruwe plekken',
				'Controleer of de kortmelkslangen soepel zijn en niet gescheurd',
				'Vervang per set, niet per stuk, en noteer de datum en de tellerstand',
				'Reset de teller zodat het interval blijft kloppen'
			],
			en: [
				'Read the milkings since the last change in the software',
				'Turn the liner inside out and check for cracks and rough patches',
				'Check the short milk tubes are supple and not split',
				'Replace as a set, not individually, and log the date and counter',
				'Reset the counter so the interval stays accurate'
			],
			de: [
				'Melkungen seit dem letzten Wechsel in der Software ablesen',
				'Zitzengummi umstülpen und auf Risse und raue Stellen prüfen',
				'Prüfen, ob die kurzen Milchschläuche geschmeidig und rissfrei sind',
				'Immer als Satz wechseln, nicht einzeln, Datum und Zählerstand notieren',
				'Zähler zurücksetzen, damit das Intervall stimmt'
			]
		},
		parts: {
			nl: ['Set tepelvoeringen', 'Kortmelkslangen'],
			en: ['Set of liners', 'Short milk tubes'],
			de: ['Satz Zitzengummis', 'Kurze Milchschläuche']
		}
	},
	{
		id: 'vacuum-verlies',
		category: 'vacuum',
		difficulty: 'medium',
		models: ['Merlin M2', 'M²erlin', 'Merlin'],
		verified: false,
		title: {
			nl: 'Te laag of instabiel vacuüm',
			en: 'Low or unstable vacuum',
			de: 'Zu niedriges oder instabiles Vakuum'
		},
		summary: {
			nl: 'Vacuümwaarde onder de ingestelde waarde, in rust of tijdens het melken.',
			en: 'Vacuum below the set value, at rest or during milking.',
			de: 'Vakuum unter dem eingestellten Wert, in Ruhe oder während des Melkens.'
		},
		symptoms: {
			nl: [
				'Vacuümalarm of afwijkende waarde op het display',
				'Melkstel zuigt slecht aan',
				'Pomp draait hoorbaar zwaarder of juist continu',
				'Onrustige koeien in de box'
			],
			en: [
				'Vacuum alarm or off-spec reading on the display',
				'Cluster attaches poorly',
				'Pump audibly working harder or running constantly',
				'Restless cows in the box'
			],
			de: [
				'Vakuumalarm oder abweichender Wert im Display',
				'Melkzeug saugt schlecht an',
				'Pumpe läuft hörbar schwerer oder dauerhaft',
				'Unruhige Kühe in der Box'
			]
		},
		causes: {
			nl: [
				'Lekkage in slangen, koppelingen of afsluiters',
				'Vervuild of verzadigd vacuümfilter',
				'Versleten lamellen of te weinig olie in de pomp',
				'Regelklep die niet meer sluit'
			],
			en: [
				'Leak in hoses, couplings or shut-off valves',
				'Blocked or saturated vacuum filter',
				'Worn vanes or low oil level in the pump',
				'Regulator valve no longer closing'
			],
			de: [
				'Leckage in Schläuchen, Kupplungen oder Absperrventilen',
				'Verschmutzter oder gesättigter Vakuumfilter',
				'Verschlissene Lamellen oder zu wenig Öl in der Pumpe',
				'Regelventil schließt nicht mehr'
			]
		},
		steps: {
			nl: [
				'Noteer de vacuümwaarde in rust en tijdens het melken',
				'Sluit de melkleiding af en kijk of het vacuüm wél op peil komt: zo isoleer je de lekkage',
				'Loop alle slangen en koppelingen na, luister naar sissen',
				'Controleer en vervang het vacuümfilter',
				'Controleer het oliepeil en de olietoevoer van de pomp',
				'Blijft het probleem: laat de regelklep en pompcapaciteit meten door de monteur'
			],
			en: [
				'Note the vacuum reading at rest and during milking',
				'Close off the milk line and see whether vacuum recovers: that isolates the leak',
				'Walk every hose and coupling, listen for hissing',
				'Check and replace the vacuum filter',
				'Check oil level and oil feed on the pump',
				'If it persists, have the regulator and pump capacity measured by an engineer'
			],
			de: [
				'Vakuumwert in Ruhe und während des Melkens notieren',
				'Milchleitung absperren und prüfen, ob das Vakuum steht: so grenzt man das Leck ein',
				'Alle Schläuche und Kupplungen abgehen, auf Zischen hören',
				'Vakuumfilter prüfen und ersetzen',
				'Ölstand und Ölzufuhr der Pumpe prüfen',
				'Bleibt es bestehen: Regelventil und Pumpenleistung vom Techniker messen lassen'
			]
		},
		parts: {
			nl: ['Vacuümfilter', 'Pompolie', 'Slangen en koppelingen'],
			en: ['Vacuum filter', 'Pump oil', 'Hoses and couplings'],
			de: ['Vakuumfilter', 'Pumpenöl', 'Schläuche und Kupplungen']
		}
	},
	{
		id: 'speendetectie',
		category: 'arm',
		difficulty: 'medium',
		models: ['Merlin M2', 'M²erlin'],
		verified: false,
		title: {
			nl: 'Arm vindt de spenen niet',
			en: 'Arm fails to find the teats',
			de: 'Arm findet die Zitzen nicht'
		},
		summary: {
			nl: 'De robot sluit niet of niet volledig aan; de detectie van de spenen mislukt.',
			en: 'The robot does not attach, or attaches partially; teat detection fails.',
			de: 'Der Roboter setzt nicht oder nur teilweise an; die Zitzenerkennung schlägt fehl.'
		},
		symptoms: {
			nl: [
				'Herhaalde aansluitpogingen op dezelfde koe',
				'Arm zoekt naast de speen of blijft hangen',
				'Vaker een onvolledige melking',
				'Vooral problemen bij koeien met afwijkende spenen'
			],
			en: [
				'Repeated attach attempts on the same cow',
				'Arm searches beside the teat or stalls',
				'More incomplete milkings',
				'Mostly cows with atypical teat placement'
			],
			de: [
				'Wiederholte Ansetzversuche bei derselben Kuh',
				'Arm sucht neben der Zitze oder bleibt hängen',
				'Häufiger unvollständige Melkungen',
				'Vor allem Kühe mit untypischer Zitzenstellung'
			]
		},
		causes: {
			nl: [
				'Vuil, melkaanslag of condens op de sensorlens',
				'Sensor uit afstelling na een botsing',
				'Speenposities in de software staan te ver van de werkelijkheid',
				'Slijtage of speling in de armgeleiding'
			],
			en: [
				'Dirt, milk film or condensation on the sensor lens',
				'Sensor knocked out of alignment',
				'Stored teat positions drifted from reality',
				'Wear or play in the arm guides'
			],
			de: [
				'Schmutz, Milchfilm oder Kondens auf der Sensorlinse',
				'Sensor durch Stoß dejustiert',
				'Gespeicherte Zitzenpositionen stimmen nicht mehr',
				'Verschleiß oder Spiel in der Armführung'
			]
		},
		steps: {
			nl: [
				'Maak de lens schoon met een zachte, niet-schurende doek',
				'Controleer of de sensor nog vastzit en recht staat',
				'Kijk of het probleem één koe of de hele stal betreft; is het één koe, corrigeer haar speenposities',
				'Controleer de arm op speling en op vuil in de geleiding',
				'Bij de hele stal: laat de sensor uitlijnen of kalibreren door de monteur'
			],
			en: [
				'Clean the lens with a soft, non-abrasive cloth',
				'Check the sensor is still tight and square',
				'Determine whether it is one cow or the whole herd; if one cow, correct her teat coordinates',
				'Check the arm for play and dirt in the guides',
				'If it is herd-wide, have the sensor aligned or calibrated by an engineer'
			],
			de: [
				'Linse mit weichem, nicht scheuerndem Tuch reinigen',
				'Prüfen, ob der Sensor fest und gerade sitzt',
				'Feststellen, ob es eine Kuh oder die ganze Herde betrifft; bei einer Kuh die Zitzenkoordinaten korrigieren',
				'Arm auf Spiel und Schmutz in der Führung prüfen',
				'Bei der ganzen Herde: Sensor vom Techniker ausrichten oder kalibrieren lassen'
			]
		},
		parts: {
			nl: ['Reinigingsdoek voor optiek', 'Geleidingsonderdelen bij speling'],
			en: ['Optical cleaning cloth', 'Guide components if there is play'],
			de: ['Optik-Reinigungstuch', 'Führungsteile bei Spiel']
		}
	},
	{
		id: 'reiniging-afgebroken',
		category: 'reiniging',
		difficulty: 'medium',
		models: ['Merlin M2', 'M²erlin', 'Merlin'],
		verified: false,
		title: {
			nl: 'Reiniging breekt af of haalt de temperatuur niet',
			en: 'Cleaning aborts or fails to reach temperature',
			de: 'Reinigung bricht ab oder erreicht die Temperatur nicht'
		},
		summary: {
			nl: 'De reinigingscyclus wordt niet voltooid of de ingestelde temperatuur wordt niet bereikt.',
			en: 'The cleaning cycle does not complete, or the set temperature is not reached.',
			de: 'Der Reinigungszyklus wird nicht abgeschlossen oder die eingestellte Temperatur nicht erreicht.'
		},
		symptoms: {
			nl: [
				'Melding reiniging mislukt of afgebroken',
				'Kiemgetal of celgetal loopt op',
				'Zichtbare melksteen of aanslag in de glazen delen',
				'Spoelwater voelt lauw aan'
			],
			en: [
				'Cleaning failed or aborted warning',
				'Rising bacteria or cell count',
				'Visible milkstone or film in the sight glasses',
				'Rinse water feels lukewarm'
			],
			de: [
				'Meldung Reinigung fehlgeschlagen oder abgebrochen',
				'Steigende Keim- oder Zellzahl',
				'Sichtbarer Milchstein oder Belag in den Schaugläsern',
				'Spülwasser fühlt sich lauwarm an'
			]
		},
		causes: {
			nl: [
				'Lege of niet-aanzuigende middelenjerrycan',
				'Verstopt aanzuigfilter of gescheurd doseerslangetje',
				'Boiler haalt de temperatuur niet of herstelt te traag',
				'Te weinig water of een klemmende klep'
			],
			en: [
				'Empty drum or a chemical line that is not drawing',
				'Blocked suction filter or split dosing tube',
				'Boiler not reaching temperature or recovering too slowly',
				'Insufficient water or a sticking valve'
			],
			de: [
				'Leerer Kanister oder nicht ansaugende Chemieleitung',
				'Verstopfter Ansaugfilter oder gerissener Dosierschlauch',
				'Boiler erreicht die Temperatur nicht oder erholt sich zu langsam',
				'Zu wenig Wasser oder klemmendes Ventil'
			]
		},
		steps: {
			nl: [
				'Controleer het niveau van zuur en loog en of de zuigslangen echt in de vloeistof hangen',
				'Kijk of er lucht in de doseerslangetjes zit; scheurtjes zitten meestal bij de aansluiting',
				'Meet de watertemperatuur aan het einde van de leiding, niet alleen bij de boiler',
				'Controleer de boilerthermostaat en de hersteltijd tussen twee reinigingen',
				'Draai een handmatige reiniging en kijk bij elke fase mee waar hij afhaakt'
			],
			en: [
				'Check acid and alkaline levels and that the pickup tubes really sit in the liquid',
				'Look for air in the dosing tubes; splits are usually at the connector',
				'Measure water temperature at the end of the line, not just at the boiler',
				'Check the boiler thermostat and the recovery time between cleans',
				'Run a manual clean and watch which phase it drops out at'
			],
			de: [
				'Füllstand von Säure und Lauge prüfen und ob die Saugschläuche wirklich in der Flüssigkeit hängen',
				'Auf Luft in den Dosierschläuchen achten; Risse sitzen meist am Anschluss',
				'Wassertemperatur am Leitungsende messen, nicht nur am Boiler',
				'Boilerthermostat und Erholzeit zwischen zwei Reinigungen prüfen',
				'Manuelle Reinigung starten und beobachten, in welcher Phase sie abbricht'
			]
		},
		parts: {
			nl: ['Doseerslangetjes', 'Aanzuigfilters', 'Reinigingsmiddel zuur en loog'],
			en: ['Dosing tubes', 'Suction filters', 'Acid and alkaline detergent'],
			de: ['Dosierschläuche', 'Ansaugfilter', 'Saure und alkalische Reiniger']
		}
	},
	{
		id: 'perslucht',
		category: 'perslucht',
		difficulty: 'easy',
		models: ['Merlin M2', 'M²erlin'],
		verified: false,
		title: {
			nl: 'Te weinig perslucht of natte lucht',
			en: 'Insufficient or wet compressed air',
			de: 'Zu wenig oder feuchte Druckluft'
		},
		summary: {
			nl: 'Luchtdruk onder de ingestelde waarde, of water in het luchtsysteem.',
			en: 'Air pressure below the set value, or water in the air system.',
			de: 'Luftdruck unter dem eingestellten Wert oder Wasser im Luftsystem.'
		},
		symptoms: {
			nl: [
				'Arm of cilinders bewegen traag of schokkend',
				'Compressor draait vaker of blijft doorlopen',
				'Water uit het aftappunt of uit de waterafscheider',
				'Storingen die vooral in vochtige of koude perioden opduiken'
			],
			en: [
				'Arm or cylinders move slowly or jerkily',
				'Compressor cycles more often or runs continuously',
				'Water at the drain point or in the separator',
				'Faults that cluster in damp or cold spells'
			],
			de: [
				'Arm oder Zylinder bewegen sich langsam oder ruckartig',
				'Kompressor schaltet häufiger oder läuft durch',
				'Wasser am Ablasspunkt oder im Abscheider',
				'Störungen, die vor allem bei Feuchte oder Kälte auftreten'
			]
		},
		causes: {
			nl: [
				'Condens in ketel en leidingen',
				'Vervuild luchtfilter of verzadigde droger',
				'Lekkage in luchtslangen of snelkoppelingen',
				'Versleten compressor die de druk niet meer haalt'
			],
			en: [
				'Condensate in the receiver and pipework',
				'Dirty air filter or saturated dryer',
				'Leaks in air lines or quick couplers',
				'Worn compressor no longer making pressure'
			],
			de: [
				'Kondensat in Kessel und Leitungen',
				'Verschmutzter Luftfilter oder gesättigter Trockner',
				'Leckagen in Luftleitungen oder Schnellkupplungen',
				'Verschlissener Kompressor erreicht den Druck nicht mehr'
			]
		},
		steps: {
			nl: [
				'Tap de ketel af en noteer hoeveel water eruit komt',
				'Vervang het luchtfilter en controleer de droger',
				'Zet het systeem onder druk, schakel de compressor uit en kijk hoe snel de druk zakt',
				'Spuit koppelingen in met zeepsop om lekkages te vinden',
				'Stel de aftap automatisch in als dat nog niet zo is'
			],
			en: [
				'Drain the receiver and note how much water comes out',
				'Replace the air filter and check the dryer',
				'Pressurise the system, switch the compressor off and watch how fast pressure falls',
				'Spray couplings with soapy water to find leaks',
				'Fit or enable an automatic drain if there is none'
			],
			de: [
				'Kessel ablassen und notieren, wie viel Wasser herauskommt',
				'Luftfilter ersetzen und Trockner prüfen',
				'System unter Druck setzen, Kompressor ausschalten und den Druckabfall beobachten',
				'Kupplungen mit Seifenwasser einsprühen, um Leckagen zu finden',
				'Automatische Entwässerung nachrüsten oder aktivieren'
			]
		},
		parts: {
			nl: ['Luchtfilter', 'Waterafscheider', 'Snelkoppelingen'],
			en: ['Air filter', 'Water separator', 'Quick couplers'],
			de: ['Luftfilter', 'Wasserabscheider', 'Schnellkupplungen']
		}
	},
	{
		id: 'sensor-storingen',
		category: 'elektrisch',
		difficulty: 'hard',
		models: ['Merlin M2', 'M²erlin', 'Merlin'],
		verified: false,
		title: {
			nl: 'Terugkerende sensor- of communicatiestoringen',
			en: 'Recurring sensor or communication faults',
			de: 'Wiederkehrende Sensor- oder Kommunikationsstörungen'
		},
		summary: {
			nl: 'Foutmeldingen die niet reproduceerbaar zijn en na een herstart verdwijnen.',
			en: 'Error messages that are not reproducible and clear after a restart.',
			de: 'Fehlermeldungen, die nicht reproduzierbar sind und nach einem Neustart verschwinden.'
		},
		symptoms: {
			nl: [
				'Wisselende foutmeldingen zonder vast patroon',
				'Sensor valt weg en komt na een herstart terug',
				'Storing treedt op bij beweging van de arm',
				'Meerdere onderdelen op dezelfde kabelboom geven problemen'
			],
			en: [
				'Intermittent error messages with no fixed pattern',
				'Sensor drops out and returns after a restart',
				'Fault appears when the arm moves',
				'Several components on the same loom misbehave'
			],
			de: [
				'Wechselnde Fehlermeldungen ohne festes Muster',
				'Sensor fällt aus und kehrt nach Neustart zurück',
				'Störung tritt bei Armbewegung auf',
				'Mehrere Bauteile am selben Kabelbaum fallen auf'
			]
		},
		causes: {
			nl: [
				'Corrosie of vocht in een connector',
				'Kabelbreuk in een meebewegende kabelbundel',
				'Slechte massa-aansluiting',
				'Storing van een frequentieregelaar op signaalkabels'
			],
			en: [
				'Corrosion or moisture in a connector',
				'Broken core in a flexing cable loom',
				'Poor earth connection',
				'Interference from a variable-speed drive on signal cables'
			],
			de: [
				'Korrosion oder Feuchtigkeit in einem Steckverbinder',
				'Kabelbruch in einem mitbewegten Kabelbaum',
				'Schlechte Masseverbindung',
				'Störung eines Frequenzumrichters auf Signalleitungen'
			]
		},
		steps: {
			nl: [
				'Noteer nauwkeurig wanneer de storing optreedt: tijdstip, koe, armpositie',
				'Schakel spanningsloos en controleer de connectoren op groenslag en vocht',
				'Beweeg de kabelbundel met de hand terwijl je meet; een wegvallend signaal wijst de plek aan',
				'Controleer de massa-aansluitingen in de kast',
				'Leg de logging voor aan de servicedienst voordat je onderdelen vervangt'
			],
			en: [
				'Record exactly when the fault occurs: time, cow, arm position',
				'Isolate the power and inspect connectors for verdigris and moisture',
				'Flex the loom by hand while measuring; a signal that drops points to the spot',
				'Check the earth connections in the cabinet',
				'Show the logs to the service desk before replacing parts'
			],
			de: [
				'Genau notieren, wann die Störung auftritt: Zeit, Kuh, Armposition',
				'Spannungsfrei schalten und Steckverbinder auf Grünspan und Feuchte prüfen',
				'Kabelbaum von Hand bewegen und dabei messen; ein wegfallendes Signal zeigt die Stelle',
				'Masseverbindungen im Schaltschrank prüfen',
				'Logdaten dem Service vorlegen, bevor Teile getauscht werden'
			]
		},
		parts: {
			nl: ['Connectoren', 'Kabelbundel', 'Contactspray'],
			en: ['Connectors', 'Cable loom', 'Contact cleaner'],
			de: ['Steckverbinder', 'Kabelbaum', 'Kontaktspray']
		}
	}
];
