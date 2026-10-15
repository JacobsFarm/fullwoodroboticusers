<script lang="ts">
	import { base } from '$app/paths';
	import * as m from '$lib/paraglide/messages';
	import { getLocale } from '$lib/paraglide/runtime';
	import { feeds } from '$lib/config';
	import { eur, num, pct, cents, monthYear } from '$lib/format';
	import {
		categories,
		generalBasis,
		generalLines,
		generalGroups,
		priceHistory,
		lifetime,
		farmFacts,
		depreciation,
		farmerValue,
		type CostCategory,
		type Locale
	} from '$lib/data/costs';
	import Seo from '$lib/components/Seo.svelte';
	import ShareBar from '$lib/components/ShareBar.svelte';
	import LineChart, { type LineSeries } from '$lib/components/LineChart.svelte';

	const locale = $derived(getLocale() as Locale);
	const money = (v: number, digits = 2) => eur(v, locale, digits);

	/* ---------- begroting ---------- */

	const total = generalLines.reduce((sum, line) => sum + (line.total ?? 0), 0);
	const perMilking = total / generalBasis.milkingsPerYear;

	const shares = $derived.by(() => {
		const sums = new Map<CostCategory, number>();
		for (const line of generalLines) {
			if (line.total === null) continue;
			sums.set(line.category, (sums.get(line.category) ?? 0) + line.total);
		}
		return [...sums.entries()]
			.map(([id, value]) => ({
				id,
				label: categories[id].label[locale],
				value,
				color: categories[id].color
			}))
			.sort((a, b) => b.value - a.value);
	});

	const biggest = $derived(shares[0]);

	const groups = $derived(
		generalGroups.map((group) => {
			const lines = generalLines.filter((l) => l.group === group.id);
			return {
				id: group.id,
				label: group.label[locale],
				lines,
				subtotal: lines.reduce((s, l) => s + (l.total ?? 0), 0)
			};
		})
	);

	function detail(line: (typeof generalLines)[number]): string {
		if (line.qty === null || line.unit === null) return '';
		const qty = Number.isInteger(line.qty) ? num(line.qty, locale) : num(line.qty, locale, 1);
		const unit = line.unit[locale];
		if (line.price === null) return `${qty} ${unit}`;
		return `${qty} ${unit} × ${money(line.price)}`;
	}

	/* ---------- prijzen ---------- */

	const prices = $derived(
		priceHistory
			.map((p) => {
				const oldest = p.before[0];
				return { ...p, oldest, change: p.now / oldest.price - 1 };
			})
			.sort((a, b) => b.change - a.change)
	);
	const maxChange = $derived(Math.max(...prices.map((p) => p.change)));
	const acidChange = $derived(prices.find((p) => p.id === 'acid')?.change ?? 0);

	function when(date: string | null): string {
		return date ? monthYear(date, locale) : m.costs_prices_unknown_date();
	}

	/* ---------- waardevermindering ---------- */

	const premium = $derived(pct(depreciation.farmerPremium, locale));
	const ageLabel = (age: number) =>
		age === 0 ? m.costs_value_new() : m.costs_value_years({ years: age });

	const valueSeries = $derived<LineSeries[]>([
		{
			id: 'farmer',
			label: m.costs_value_series_farmer({ premium }),
			color: '#eb6834',
			dashed: true,
			points: depreciation.points.map((p) => ({ x: p.age, y: farmerValue(p) }))
		},
		{
			id: 'base',
			label: m.costs_value_series_base(),
			color: 'var(--fw-blue)',
			points: depreciation.points.map((p) => ({ x: p.age, y: p.value }))
		}
	]);

	const valueRows = $derived(
		depreciation.points.map((p) => ({
			age: p.age,
			label: ageLabel(p.age),
			base: p.value,
			farmer: farmerValue(p),
			share: p.value / depreciation.newPrice
		}))
	);

	const centsPerLiter = $derived(
		cents((lifetime.purchase + lifetime.maintenance) / lifetime.liters, locale)
	);

	const jsonld = $derived([
		{
			'@context': 'https://schema.org',
			'@type': 'ItemList',
			name: m.costs_budget_title(),
			description: m.costs_budget_lede(),
			itemListElement: generalLines
				.filter((l) => l.total !== null)
				.map((line, index) => ({
					'@type': 'ListItem',
					position: index + 1,
					name: line.label[locale],
					description: `${money(line.total ?? 0)} / ${locale === 'nl' ? 'jaar' : locale === 'de' ? 'Jahr' : 'year'}`
				}))
		}
	]);
</script>

<Seo title={m.costs_title()} description={m.costs_intro()} {jsonld} />

<section class="page-head">
	<div class="fw-wrap">
		<p class="fw-kicker">{m.site_name()}</p>
		<h1>{m.costs_title()}</h1>
		<p class="fw-lede">{m.costs_intro()}</p>
	</div>
</section>

<!-- ============ Waarom ============ -->
<section class="fw-section">
	<div class="fw-wrap why">
		<div class="why__text">
			<h2>{m.costs_why_title()}</h2>
			<p>{m.costs_why_1()}</p>
			<p>{m.costs_why_2()}</p>
			<p>{m.costs_why_3()}</p>
			<p>{m.costs_why_4({ acid: pct(acidChange, locale) })}</p>
		</div>

		<aside class="why__side">
			<div class="fw-note">
				<p><strong>{m.costs_why_note_title()}</strong></p>
				<p>{m.costs_why_note_body()}</p>
			</div>
			<div class="fw-card basis">
				<h3>{m.costs_basis_title()}</h3>
				<p>
					{m.costs_basis_body({
						milkings: num(generalBasis.milkingsPerDay, locale),
						hot: num(generalBasis.hotCleanings, locale),
						rinses: num(generalBasis.rinses, locale),
						perYear: num(generalBasis.milkingsPerYear, locale)
					})}
				</p>
			</div>
		</aside>
	</div>
</section>

<!-- ============ Begroting ============ -->
<section class="fw-section fw-section--alt" id="begroting">
	<div class="fw-wrap">
		<h2>{m.costs_budget_title()}</h2>
		<p class="fw-lede">{m.costs_budget_lede()}</p>

		<div class="stats">
			<div class="stat stat--hero">
				<span class="stat__label">{m.costs_total_label()}</span>
				<span class="stat__value">{money(total)}</span>
				<span class="stat__hint">{m.costs_total_hint()}</span>
			</div>
			<div class="stat">
				<span class="stat__label">{m.costs_per_milking_label()}</span>
				<span class="stat__value">{money(perMilking, 3)}</span>
				<span class="stat__hint">{m.costs_per_milking_hint()}</span>
			</div>
			<div class="stat">
				<span class="stat__label">{m.costs_biggest_label()}</span>
				<span class="stat__value stat__value--text">{biggest.label}</span>
				<span class="stat__hint">{m.costs_biggest_hint({ share: pct(biggest.value / total, locale) })}</span>
			</div>
		</div>

		<div class="fw-card block">
			<h3>{m.costs_share_title()}</h3>
			<ShareBar
				{shares}
				format={(v) => money(v)}
				formatShare={(f) => pct(f, locale)}
				ariaLabel={m.costs_share_aria()}
				unknown={{
					label: generalLines.find((l) => l.id === 'unforeseen')?.label[locale] ?? '',
					value: m.costs_unforeseen_value()
				}}
			/>
		</div>

		<div class="fw-card block">
			<h3>{m.costs_detail_title()}</h3>
			<table class="lines">
				<thead>
					<tr>
						<th scope="col">{m.costs_col_item()}</th>
						<th scope="col" class="num">{m.costs_col_year()}</th>
					</tr>
				</thead>
				{#each groups as group (group.id)}
					<tbody>
						<tr class="group">
							<th scope="rowgroup">{group.label}</th>
							<td class="num">{money(group.subtotal)}</td>
						</tr>
						{#each group.lines as line (line.id)}
							<tr>
								<th scope="row">
									<span class="line__name">{line.label[locale]}</span>
									{#if detail(line)}<span class="line__detail">{detail(line)}</span>{/if}
									<span class="line__note">{line.note[locale]}</span>
								</th>
								<td class="num" class:muted={line.total === null}>
									{line.total === null ? m.costs_unforeseen_value() : money(line.total)}
								</td>
							</tr>
						{/each}
					</tbody>
				{/each}
				<tfoot>
					<tr>
						<th scope="row">{m.costs_grand_total()}</th>
						<td class="num">{money(total)}</td>
					</tr>
				</tfoot>
			</table>
		</div>
	</div>
</section>

<!-- ============ Prijzen ============ -->
<section class="fw-section">
	<div class="fw-wrap">
		<h2>{m.costs_prices_title()}</h2>
		<p class="fw-lede">{m.costs_prices_lede()}</p>

		<div class="fw-card block table-wrap">
			<table class="prices">
				<thead>
					<tr>
						<th scope="col">{m.costs_prices_item()}</th>
						<th scope="col" class="num">{m.costs_prices_earlier()}</th>
						<th scope="col" class="num">{m.costs_prices_now()}</th>
						<th scope="col" class="change-col">{m.costs_prices_change()}</th>
					</tr>
				</thead>
				<tbody>
					{#each prices as p (p.id)}
						<tr>
							<th scope="row">
								<span class="line__name">{p.label[locale]}</span>
								<span class="line__detail">{p.unit[locale]}</span>
							</th>
							<td class="num">
								{money(p.oldest.price)}
								<span class="line__detail">{when(p.oldest.date)}</span>
							</td>
							<td class="num">{money(p.now)}</td>
							<td class="change-col">
								<span class="change">
									<span class="change__bar" style="width: {Math.max((p.change / maxChange) * 100, 1.5)}%"></span>
									<span class="change__value">{p.change > 0 ? '+' : ''}{pct(p.change, locale)}</span>
								</span>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		<p class="small">{m.costs_prices_note()}</p>
	</div>
</section>

<!-- ============ Waardevermindering ============ -->
<section class="fw-section fw-section--alt" id="waardevermindering">
	<div class="fw-wrap">
		<h2>{m.costs_value_title()}</h2>
		<p class="fw-lede">{m.costs_value_lede({ price: money(depreciation.newPrice, 0) })}</p>

		<div class="fw-card block">
			<LineChart
				series={valueSeries}
				xTicks={depreciation.points.map((p) => p.age)}
				formatX={ageLabel}
				formatY={(v) => money(v, 0)}
				ariaLabel={m.costs_value_chart_aria()}
				xTitle={m.costs_value_x_title()}
			/>
		</div>

		<div class="fw-card block table-wrap">
			<table class="prices value">
				<thead>
					<tr>
						<th scope="col">{m.costs_value_col_age()}</th>
						<th scope="col" class="num">{m.costs_value_col_base()}</th>
						<th scope="col" class="num">{m.costs_value_col_farmer()}</th>
						<th scope="col" class="num">{m.costs_value_col_share()}</th>
					</tr>
				</thead>
				<tbody>
					{#each valueRows as row (row.age)}
						<tr>
							<th scope="row"><span class="line__name">{row.label}</span></th>
							<td class="num">{money(row.base, 0)}</td>
							<td class="num">{money(row.farmer, 0)}</td>
							<td class="num">{pct(row.share, locale)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<div class="fw-note value__note">
			<p><strong>{m.costs_value_note_title()}</strong></p>
			<ul>
				<li>{m.costs_value_note_1()}</li>
				<li>{m.costs_value_note_2()}</li>
				<li>{m.costs_value_note_3()}</li>
				<li>
					{m.costs_value_note_4({
						premium,
						end: money(depreciation.points[depreciation.points.length - 1].value, 0)
					})}
				</li>
			</ul>
		</div>
	</div>
</section>

<!-- ============ Boerderijvoorbeelden ============ -->
<section class="fw-section" id="voorbeelden">
	<div class="fw-wrap">
		<h2>{m.costs_farms_title()}</h2>
		<p class="fw-lede">{m.costs_farms_lede()}</p>

		<div class="farms">
			<a class="fw-card farm" href="{base}/kosten/boerderij/">
				<span class="fw-tag">{m.costs_farm1_meta({ milkings: farmFacts.milkingsPerDay })}</span>
				<h3>{m.costs_farm1_title()}</h3>
				<p>{m.costs_farm1_body()}</p>
				<p class="farm__stat">
					{m.costs_farm1_stat({ cents: centsPerLiter })}
				</p>
				<span class="fw-btn farm__cta">{m.costs_farm_open()}<span aria-hidden="true">→</span></span>
			</a>

			<aside class="fw-card contribute">
				<h3>{m.costs_contribute_title()}</h3>
				<p>{m.costs_contribute_body()}</p>
				<a class="fw-btn fw-btn--ghost" href={feeds.group.href} target="_blank" rel="noopener">
					Fullwood Merlin M2 enthusiasts
				</a>
			</aside>
		</div>
	</div>
</section>

<style>
	.page-head {
		background: var(--fw-surface-alt);
		border-bottom: 1px solid var(--fw-line);
		padding-block: clamp(2.5rem, 6vw, 4rem);
	}

	/* ---------- waarom ---------- */

	.why {
		display: grid;
		gap: 2.5rem;
		align-items: start;
	}

	.why__text p {
		max-width: 62ch;
	}

	.why__side {
		display: grid;
		gap: 1.25rem;
	}

	.basis h3 {
		font-size: 1.05rem;
	}

	.basis p {
		margin: 0;
		font-size: 0.95rem;
	}

	/* ---------- stat tiles ---------- */

	.stats {
		display: grid;
		gap: 1rem;
		margin-block: 2rem 1.5rem;
	}

	.stat {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: 1.25rem 1.5rem;
		background: var(--fw-surface);
		border: 1px solid var(--fw-line);
		border-radius: var(--fw-radius-lg);
	}

	.stat--hero {
		background: var(--fw-blue-dark);
		border-color: var(--fw-blue-dark);
		color: #fff;
	}

	.stat__label {
		font-size: 0.8rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--fw-muted);
	}

	.stat--hero .stat__label,
	.stat--hero .stat__hint {
		color: rgb(255 255 255 / 75%);
	}

	.stat__value {
		font-size: clamp(2rem, 1.4rem + 2vw, 3rem);
		font-weight: 700;
		line-height: 1.1;
		letter-spacing: -0.02em;
		color: var(--fw-ink);
		font-variant-numeric: tabular-nums;
	}

	.stat--hero .stat__value {
		color: #fff;
	}

	.stat__value--text {
		font-size: 1.35rem;
		letter-spacing: -0.01em;
		line-height: 1.25;
		padding-block: 0.4rem;
	}

	.stat__hint {
		font-size: 0.85rem;
		color: var(--fw-muted);
	}

	.block {
		margin-top: 1.5rem;
		padding: clamp(1.25rem, 3vw, 2rem);
	}

	.block h3 {
		margin-bottom: 1rem;
	}

	/* ---------- tabellen ---------- */

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th,
	td {
		text-align: left;
		vertical-align: top;
		font-weight: 400;
	}

	.num {
		text-align: right;
		white-space: nowrap;
		font-variant-numeric: tabular-nums;
		color: var(--fw-ink);
	}

	.muted {
		color: var(--fw-muted);
	}

	thead th {
		padding: 0 0 0.6rem;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--fw-muted);
		border-bottom: 1px solid var(--fw-line);
	}

	.lines tbody th,
	.lines tbody td,
	.prices tbody th,
	.prices tbody td {
		padding: 0.85rem 0;
		border-bottom: 1px solid var(--fw-line);
	}

	.lines .group th,
	.lines .group td {
		padding-top: 1.5rem;
		font-weight: 700;
		color: var(--fw-ink);
		border-bottom: 2px solid var(--fw-line);
	}

	.lines tbody:first-of-type .group th,
	.lines tbody:first-of-type .group td {
		padding-top: 1rem;
	}

	.lines tbody th[scope='row'] {
		padding-right: 1.5rem;
	}

	.line__name {
		display: block;
		color: var(--fw-ink);
		font-weight: 600;
	}

	.line__detail {
		display: block;
		font-size: 0.85rem;
		color: var(--fw-muted);
		font-variant-numeric: tabular-nums;
	}

	.line__note {
		display: block;
		margin-top: 0.35rem;
		max-width: 62ch;
		font-size: 0.85rem;
		line-height: 1.5;
		color: var(--fw-text);
	}

	.lines tfoot th,
	.lines tfoot td {
		padding-top: 1rem;
		font-size: 1.1rem;
		font-weight: 700;
		color: var(--fw-ink);
	}

	/* ---------- prijzen ---------- */

	.table-wrap {
		overflow-x: auto;
	}

	.prices {
		min-width: 34rem;
	}

	.prices tbody .num {
		padding-left: 1rem;
	}

	.change-col {
		width: 36%;
	}

	.prices .change-col {
		padding-left: 1.5rem;
	}

	.change {
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}

	.change__bar {
		display: block;
		height: 12px;
		border-radius: 0 4px 4px 0;
		background: var(--fw-blue);
		flex: none;
		max-width: calc(100% - 4rem);
	}

	.change__value {
		font-size: 0.9rem;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		color: var(--fw-ink);
	}

	.value {
		min-width: 28rem;
	}

	.value__note {
		margin-top: 1.5rem;
	}

	.value__note ul {
		margin: 0.5rem 0 0;
		padding-left: 1.2rem;
		display: grid;
		gap: 0.5rem;
		font-size: 0.95rem;
	}

	.small {
		margin-top: 0.75rem;
		font-size: 0.85rem;
		color: var(--fw-muted);
		max-width: 70ch;
	}

	/* ---------- voorbeelden ---------- */

	.farms {
		display: grid;
		gap: 1.25rem;
		margin-top: 2rem;
	}

	.farm {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.75rem;
		text-decoration: none;
		color: var(--fw-text);
		transition: border-color 0.15s ease, box-shadow 0.15s ease;
	}

	.farm:hover {
		border-color: var(--fw-blue);
		box-shadow: var(--fw-shadow);
		color: var(--fw-text);
	}

	.farm h3 {
		margin: 0;
		font-size: 1.35rem;
	}

	.farm p {
		margin: 0;
	}

	.farm__stat {
		font-weight: 600;
		color: var(--fw-ink);
	}

	.farm__cta {
		margin-top: auto;
	}

	.farm:hover .farm__cta {
		background: var(--fw-blue-dark);
	}

	.contribute h3 {
		font-size: 1.05rem;
	}

	.contribute p {
		font-size: 0.95rem;
	}

	@media (min-width: 700px) {
		.stats {
			grid-template-columns: 1.3fr 1fr 1fr;
		}

		.farms {
			grid-template-columns: 1.6fr 1fr;
		}
	}

	@media (min-width: 900px) {
		.why {
			grid-template-columns: 1fr 340px;
			gap: 3.5rem;
		}
	}
</style>
