# fullwoodroboticusers

Community-kennisbank voor gebruikers van Fullwood melkrobots (Merlin M2 en ouder).
Een aanvulling op de Facebookgroep: reparaties, kosten en socials op één plek.

SvelteKit · Paraglide (NL/EN/DE) · statische build voor GitHub Pages.

---

## Draaien vanuit Anaconda

Node zit al in je Anaconda base-omgeving (`C:\ProgramData\anaconda3\node.exe`, v25).
Open een **Anaconda Prompt** en ga naar de projectmap:

```bash
cd "F:\side_projecten\fullwood website\fullwoodroboticusers"
```

Eenmalig de afhankelijkheden installeren:

```bash
npm install
```

Ontwikkelserver starten op http://localhost:5173 :

```bash
npm run dev
```

Andere commando's:

```bash
npm run check
```

```bash
npm run build
```

```bash
npm run preview
```

Liever een aparte conda-omgeving in plaats van base:

```bash
conda create -n fullwood nodejs=22 -y
```

---

## Structuur

| Pad | Wat |
| --- | --- |
| `src/routes/+page.svelte` | Home |
| `src/routes/reparaties/` | Reparatie-overzicht met zoeken en filters |
| `src/routes/kosten/` | Kostenoverzicht: algemene jaarbegroting, prijsontwikkeling en doorklik naar voorbeelden |
| `src/routes/kosten/boerderij/` | Boerderijvoorbeeld: kosten per jaar 2009–2023 en per gebruiksjaar van de Merlin M2 |
| `src/lib/data/costs.ts` | **De kostencijfers.** Totalen worden uit de regels berekend |
| `src/routes/marktplaats/` | Marktplaats met filters en aanmeldformulier |
| `src/routes/socials/` | Facebook-tijdlijnen en uitgelichte berichten |
| `src/lib/data/repairs.ts` | **De reparatie-inhoud.** Hier voeg je storingen toe |
| `src/lib/data/models.ts` | Modellen op de homepage |
| `src/lib/data/listings.ts` | **De aanbiedingen op de marktplaats** |
| `src/lib/data/highlights.ts` | Handmatig uitgelichte berichten |
| `src/lib/config.ts` | Alle kanaal-URL's (Facebook, LinkedIn, YouTube, Instagram) |
| `messages/{nl,en,de}.json` | Alle vaste teksten, per taal |
| `src/app.css` | Kleuren en huisstijl (alle tokens bovenaan) |
| `src/lib/components/Seo.svelte` | Titel, canonical, OG-tags en JSON-LD per pagina |
| `src/routes/sitemap.xml/` | Sitemap, gegenereerd bij de build |
| `src/routes/robots.txt/` | Crawl-regels, inclusief AI-bots |
| `src/routes/llms.txt/` | Korte sitebeschrijving voor taalmodellen |
| `src/routes/llms-full.txt/` | Alle reparatie-inhoud als platte tekst, in drie talen |

## Inhoud toevoegen

**Nieuwe reparatie**: zet een object bij in `src/lib/data/repairs.ts`. Vul `nl`, `en`
en `de` in; de pagina, de zoekfunctie en de filters pakken het automatisch op.
Zet `verified: true` zodra iemand met praktijkervaring het item heeft nagelopen —
dan verdwijnt de melding "voorbeeldinhoud".

**Nieuwe tekst op een pagina**: voeg dezelfde sleutel toe in alle drie de bestanden
in `messages/` en gebruik hem als `m.mijn_sleutel()`.

**Taal toevoegen**: zet de code bij in `project.inlang/settings.json` onder `locales`,
maak `messages/<code>.json`, en vul de vertaalvelden in de `data/`-bestanden aan.

## Kleuren

De huisstijl volgt fullwood.com: blauw `#0069AA`, donkerblauw `#003D63`, wit en grijs.
Alles staat als CSS-variabele bovenaan `src/app.css`; wil je exact de merkkleuren van
Fullwood JOZ, dan pas je alleen die tokens aan.

## Kanalen

Alle kanaal-URL's staan in `src/lib/config.ts`. Wat waar vandaan komt:

| Kanaal | Hoe het op de site komt |
| --- | --- |
| Fullwood JOZ (Facebook-pagina) | Tijdlijn via de Facebook Page Plugin |
| Fullwood Merlin M2 enthusiasts (Facebookgroep) | Groepskaart plus link; Facebook biedt geen embed voor groepsberichten |
| Fullwood JOZ (YouTube) | Speler met de uploads-playlist van het kanaal, dus altijd de laatste video's |
| LinkedIn, Instagram, fullwood.com | Alleen links; LinkedIn heeft geen publieke feed-embed |

De YouTube-playlist is het kanaal-id met `UC` vervangen door `UU`. Wisselt het kanaal,
dan pas je alleen `feeds.youtube.embedRef` aan.

Embeds laden pas nadat de bezoeker op **Laden** klikt, zodat Facebook en YouTube niet
ongevraagd cookies plaatsen. De keuze wordt onthouden in localStorage.

Losse berichten die je wilt bewaren zet je in `src/lib/data/highlights.ts`.

## Marktplaats

De site is statisch, dus er is geen server die een aanbieding kan opslaan. De route
loopt daarom via de repository:

1. Een bezoeker vult het formulier op `/marktplaats/` in.
2. Het formulier stelt een bericht op en opent een **vooringevuld GitHub-issue** met
   het label `marktplaats`.
3. Jij zet de aanbieding bij in `src/lib/data/listings.ts` en sluit het issue.
4. De push naar `main` publiceert hem.

Wie liever niet via GitHub werkt, ziet een link naar de Facebookgroep.
Er is ook een issue-template (`.github/ISSUE_TEMPLATE/marktplaats.yml`) voor mensen
die rechtstreeks op GitHub beginnen.

Liever e-mail dan GitHub? In `src/lib/config.ts`:

```ts
export const marketplace = {
	submit: 'mailto',
	email: 'jouw@adres.nl',
	issueLabel: 'marktplaats'
};
```

De drie aanbiedingen in `listings.ts` zijn voorbeelden. Ze hebben `example: true`,
krijgen daardoor een zichtbaar label **Voorbeeld** en blijven buiten de structured
data — zoekmachines zien ze dus nooit als echt aanbod. Verwijder ze zodra er echte
aanbiedingen zijn.

Elke aanbieding heeft een `status`: `beschikbaar`, `gereserveerd` of `verkocht`.
Verkochte aanbiedingen blijven staan maar worden grijs weergegeven; in de structured
data staan ze als `SoldOut`.

## Toon

De teksten zijn bewust neutraal: beschrijvend, zonder oordeel, aanbeveling of
reclame. Bij nieuwe inhoud is dat de norm — beschrijf wat er gebeurt en wat je kunt
controleren, niet of iets goed of slecht is.

## Crawlen door zoekmachines en AI

- Alle pagina's worden vooraf gerenderd; de volledige tekst staat in de HTML.
- De reparatie-items zijn `<details>`-elementen, dus ook ingeklapt staat alle inhoud
  in de broncode. Zoeken en filteren zijn een extra laag, geen voorwaarde.
- Elke pagina heeft titel, beschrijving, canonical, Open Graph en JSON-LD
  (`WebPage`, plus `ItemList` en `HowTo` voor de reparaties).
- `robots.txt` staat alles toe en noemt de bekende AI-crawlers apart.
- `llms.txt` beschrijft de site kort; `llms-full.txt` bevat de volledige
  reparatie-inhoud als platte tekst in alle drie de talen.

**Let op:** `robots.txt` wordt alleen gelezen op de root van een domein. Op de
GitHub Pages project-URL staat het bestand onder `/fullwoodroboticusers/robots.txt`
en doet het dus niets. De meta-tags en JSON-LD in de pagina's werken wel gewoon.
Met een eigen domein of een `jacobsfarm.github.io`-repo komt `robots.txt` wel goed
te staan.

## Deploy naar GitHub Pages

`.github/workflows/deploy.yml` bouwt en publiceert bij elke push naar `main`.
Eenmalig instellen: **Settings → Pages → Source: GitHub Actions**.

De site komt dan op https://jacobsfarm.github.io/fullwoodroboticusers/

De workflow zet `BASE_PATH` op de repo-naam; lokaal blijft de base leeg.

## Disclaimer

Onafhankelijk initiatief van gebruikers. Fullwood en JOZ zijn handelsmerken van hun
respectieve eigenaren; deze site is niet gelieerd aan Fullwood JOZ.
