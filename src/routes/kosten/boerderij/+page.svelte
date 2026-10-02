<script lang="ts">
	import { base } from '$app/paths';
	import * as m from '$lib/paraglide/messages';
	import { getLocale } from '$lib/paraglide/runtime';
	import { absoluteUrl, feeds } from '$lib/config';
	import { eur, num, pct, cents, monthYear } from '$lib/format';
	import {
		categories,
		calendarYears,
		calendarTotal,
		generalLines,
		lifetime,
		m2Years,
		purchases,
		farmFacts,
		yearTotal,
		yearByCategory,
		type CostCategory,
		type Locale
	} from '$lib/data/costs';
	import Seo from '$lib/components/Seo.svelte';
	import ShareBar from '$lib/components/ShareBar.svelte';
	import ColumnChart, { type ChartColumn, type ChartSeries } from '$lib/components/ColumnChart.svelte';

	const locale = $derived(getLocale() as Locale);
	const money = (v: number, digits = 2) => eur(v, locale, digits);
	const whole = (v: number) => eur(v, locale, 0);

	/* ---------- kalenderjaren ---------- */

	const calendarSeries = $derived<ChartSeries[]>([
		{ id: 'dealer', label: m.farm_series_dealer(), color: '#0069aa' },
		{ id: 'third', label: m.farm_series_third(), color: '#9ec5f4' },
		{ id: 'estimate', label: m.farm_series_estimate(), color: '#6b7780', hatch: true }
	]);

	const calendarColumns = $derived<ChartColumn[]>(
		calendarYears.map((y) => ({
			id: String(y.year),
			label: String(y.year),
			segments: [
				{ series: 'dealer', value: y.dealer ?? 0 },
				{ series: 'third', value: y.third ?? 0 },
				{ series: 'estimate', value: y.estimate ?? 0 }
			]
		}))
	);

	// 2022 is kolom 13 (0-gebaseerd); de M2 kwam in augustus, ruim halverwege dat jaar.
	const m2Marker = (13 + 7.6 / 12) - 1;
	const markers = $derived([{ afterIndex: m2Marker, label: m.farm_marker_m2() }]);

	const avgPerYear = lifetime.maintenance / lifetime.years;
	const estimateAmount = calendarYears.find((y) => y.estimate)?.estimate ?? 0;
	const roundTo = (v: number) => Math.round(v);

	/* ---------- Merlin M2 ---------- */

	const m2Categories: CostCategory[] = ['supplies', 'service', 'repairs', 'licenses', 'installation', 'other'];

	const m2Series = $derived<ChartSeries[]>(
		m2Categories.map((id) => ({ id, label: categories[id].label[locale], color: categories[id].color }))
	);

	function period(year: (typeof m2Years)[number]): string {
		return `${monthYear(`${year.from}-01`, locale)} – ${monthYear(`${year.to}-01`, locale)}`;
	}

	const m2Columns = $derived<ChartColumn[]>(
		m2Years.map((y) => {
			const byCat = yearByCategory(y);
			return {
				id: `y${y.n}`,
				label: m.farm_year({ n: y.n }),
				sub: y.ongoing ? m.farm_year_ongoing() : undefined,
				segments: m2Categories.map((id) => ({ series: id, value: byCat[id] }))
			};
		})
	);

	const yearData = $derived(
		m2Years.map((y) => {
			const byCat = yearByCategory(y);
			return {
				year: y,
				total: yearTotal(y),
				perLiter: yearTotal(y) / y.liters,
				byCat,
				groups: m2Categories
					.map((id) => ({
						id,
						label: categories[id].label[locale],
						color: categories[id].color,
						items: y.items.filter((item) => item.cat === id),
						subtotal: byCat[id]
					}))
					.filter((g) => g.items.length > 0)
			};
		})
	);

	const m2Sum = $derived(yearData.reduce((s, y) => s + y.total, 0));
	const m2Avg = $derived(m2Sum / yearData.length);

	const categoryAvg = (id: CostCategory) =>
		yearData.reduce((s, y) => s + y.byCat[id], 0) / yearData.length;

	/* ---------- begroting vs praktijk ---------- */

	const budgetByCategory = (id: CostCategory) =>
		generalLines.filter((l) => l.category === id && l.total !== null).reduce((s, l) => s + (l.total ?? 0), 0);

	const compareRows = $derived(
		m2Categories.map((id) => ({
			id,
			label: categories[id].label[locale],
			color: categories[id].color,
			budget: budgetByCategory(id),
			practice: categoryAvg(id)
		}))
	);
	const compareBudget = $derived(compareRows.reduce((s, r) => s + r.budget, 0));

	/* ---------- aanschaf ---------- */

	const purchasePerLiter = lifetime.purchase / lifetime.liters;
	const maintenancePerLiter = lifetime.maintenance / lifetime.liters;
	const totalPerLiter = purchasePerLiter + maintenancePerLiter;

	const lifeShares = $derived([
		{ id: 'purchase', label: m.farm_life_purchase(), value: lifetime.purchase, color: '#0069aa' },
		{ id: 'maintenance', label: m.farm_life_maintenance(), value: lifetime.maintenance, color: '#9ec5f4' }
	]);

	const jsonld = $derived([
		{
			'@context': 'https://schema.org',
			'@type': 'Dataset',
			name: m.farm_title(),
			description: m.farm_intro({ milkings: farmFacts.milkingsPerDay }),
			inLanguage: locale,
			url: absoluteUrl(`${base}/kosten/boerderij/`),
			measurementTechnique: 'Invoices',
			variableMeasured: [
				'Yearly cost per calendar year 2009–2023 (EUR)',
				'Yearly cost per usage year of the Merlin M2 (EUR)',
				'Cost per litre of milk (EUR)'
			]
		}
	]);
</script>

<Seo title={m.farm_title()} description={m.farm_intro({ milkings: farmFacts.milkingsPerDay })} {jsonld} />

<section class="page-head">
	<div class="fw-wrap">
		<a class="back" href="{base}/kosten/"><span aria-hidden="true">←</span> {m.farm_back()}</a>
		<p class="fw-kicker">{m.farm_kicker()}</p>
		<h1>{m.farm_title()}</h1>
		<p class="fw-lede">{m.farm_intro({ milkings: farmFacts.milkingsPerDay })}</p>

		<dl class="stats">
			<div class="stat">
				<dt>{m.farm_stat_years_label()}</dt>
				<dd>{m.farm_stat_years()}</dd>
			</div>
			<div class="stat">
				<dt>{m.farm_stat_total_label()}</dt>
				<dd>{whole(lifetime.purchase + lifetime.maintenance)}</dd>
			</div>
			<div class="stat">
				<dt>{m.farm_stat_cents_label()}</dt>
				<dd>{cents(totalPerLiter, locale)}</dd>
			</div>
			<div class="stat">
				<dt>{m.farm_stat_m2_label()}</dt>
				<dd>{whole(m2Avg)}</dd>
			</div>
		</dl>
	</div>
</section>

<!-- ============ Waarom ============ -->
<section class="fw-section">
	<div class="fw-wrap why">
		<div class="why__text">
			<h2>{m.farm_why_title()}</h2>
			<p>{m.farm_why_1()}</p>
			<p>{m.farm_why_2()}</p>
			<p class="rule">{m.farm_why_3()}</p>
		</div>

		<aside class="fw-card method">
			<h3>{m.farm_method_title()}</h3>
			<ul>
				<li>{m.farm_method_1()}</li>
				<li>{m.farm_method_2()}</li>
				<li>{m.farm_method_3()}</li>
				<li>{m.farm_method_4()}</li>
			</ul>
		</aside>
	</div>
</section>

<!-- ============ Kalenderjaren ============ -->
<section class="fw-section fw-section--alt" id="jaren">
	<div class="fw-wrap">
		<h2>{m.farm_years_title()}</h2>
		<p class="fw-lede">{m.farm_years_lede()}</p>

		<div class="fw-card block">
			<ColumnChart
				columns={calendarColumns}
				series={calendarSeries}
				format={whole}
				totalLabel={m.farm_total()}
				ariaLabel={m.farm_years_aria()}
				height={300}
				{markers}
			/>
		</div>

		<p class="avg">
			{m.farm_years_avg({ avg: whole(roundTo(avgPerYear)), estimate: whole(estimateAmount) })}
			<span class="avg__note">
				{m.farm_years_avg_note({ total: whole(lifetime.maintenance), adjustment: whole(3000) })}
			</span>
		</p>

		<details class="fw-card table-toggle">
			<summary>{m.farm_table_toggle()}</summary>
			<div class="table-wrap">
				<table class="data">
					<thead>
						<tr>
							<th scope="col">{m.farm_table_year()}</th>
							<th scope="col" class="num">{m.farm_table_cost()}</th>
							<th scope="col">{m.farm_table_excluded()}</th>
							<th scope="col">{m.farm_table_note()}</th>
						</tr>
					</thead>
					<tbody>
						{#each calendarYears as y (y.year)}
							<tr>
								<th scope="row">{y.year}</th>
								<td class="num">
									{whole(calendarTotal(y))}
									{#if y.estimate}<span class="tag">{m.farm_estimate_tag()}</span>{/if}
								</td>
								<td>
									{#if y.excluded}
										<ul class="plain">
											{#each y.excluded as ex, n (n)}
												<li>{ex.label[locale]}: <span class="nowrap">{whole(ex.amount)}</span></li>
											{/each}
										</ul>
									{/if}
								</td>
								<td class="small-cell">{y.note?.[locale] ?? ''}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</details>
	</div>
</section>

<!-- ============ Merlin M2 ============ -->
<section class="fw-section" id="m2">
	<div class="fw-wrap">
		<h2>{m.farm_m2_title()}</h2>
		<p class="fw-lede">{m.farm_m2_lede()}</p>

		<div class="fw-card block">
			<ColumnChart
				columns={m2Columns}
				series={m2Series}
				format={whole}
				totalLabel={m.farm_total()}
				ariaLabel={m.farm_m2_aria()}
				height={320}
				showTotals
				minColumn={90}
				barWidth={56}
			/>
		</div>
		<p class="small">{m.farm_ongoing_note()}</p>

		<div class="years">
			{#each yearData as y (y.year.n)}
				<article class="fw-card year">
					<header class="year__head">
						<div>
							<h3>
								{m.farm_year({ n: y.year.n })}
								{#if y.year.ongoing}<span class="fw-tag">{m.farm_year_ongoing()}</span>{/if}
							</h3>
							<p class="year__period">{period(y.year)}</p>
						</div>
						<p class="year__total">{money(y.total)}</p>
					</header>

					<p class="year__summary">{y.year.summary[locale]}</p>

					<dl class="mini">
						<div>
							<dt>{m.farm_per_liter()}</dt>
							<dd>{cents(y.perLiter, locale)}</dd>
						</div>
						<div>
							<dt>{m.farm_liters()}</dt>
							<dd>{num(y.year.liters, locale)}</dd>
						</div>
						<div>
							<dt>{m.farm_labour()}</dt>
							<dd>
								{#if y.year.labour === null}
									<span class="muted">{m.farm_labour_unknown()}</span>
								{:else}
									{money(y.year.labour)}
								{/if}
							</dd>
						</div>
					</dl>

					<ul class="cats">
						{#each y.groups as g (g.id)}
							<li>
								<span class="swatch" style="--c: {g.color}"></span>
								<span>{g.label}</span>
								<span class="num">{money(g.subtotal)}</span>
							</li>
						{/each}
					</ul>

					<details class="lines-toggle">
						<summary>{m.farm_lines_open({ n: y.year.n })}</summary>
						<table class="data">
							{#each y.groups as g (g.id)}
								<tbody>
									<tr class="group">
										<th scope="rowgroup">
											<span class="swatch" style="--c: {g.color}"></span>{g.label}
										</th>
										<td class="num">{money(g.subtotal)}</td>
									</tr>
									{#each g.items as item, n (n)}
										<tr>
											<th scope="row">{item.label[locale]}</th>
											<td class="num" class:muted={item.amount === 0}>{money(item.amount)}</td>
										</tr>
									{/each}
								</tbody>
							{/each}
							{#if y.year.oneOffs.length > 0}
								<tbody class="oneoffs">
									<tr class="group">
										<th scope="rowgroup">{m.farm_oneoffs()}</th>
										<td></td>
									</tr>
									{#each y.year.oneOffs as off, n (n)}
										<tr>
											<th scope="row">{off.label[locale]}</th>
											<td class="num">{money(off.amount)}</td>
										</tr>
									{/each}
								</tbody>
							{/if}
						</table>
					</details>
				</article>
			{/each}
		</div>

		<!-- Overzicht naast elkaar -->
		<h3 class="sub">{m.farm_overview_title()}</h3>
		<div class="fw-card block table-wrap">
			<table class="data overview">
				<thead>
					<tr>
						<th scope="col">{m.farm_col_category()}</th>
						{#each m2Years as y (y.n)}
							<th scope="col" class="num">{m.farm_year({ n: y.n })}</th>
						{/each}
						<th scope="col" class="num">{m.farm_col_avg()}</th>
					</tr>
				</thead>
				<tbody>
					{#each m2Categories as id (id)}
						<tr>
							<th scope="row">
								<span class="swatch" style="--c: {categories[id].color}"></span>{categories[id].label[locale]}
							</th>
							{#each yearData as y (y.year.n)}
								<td class="num">{whole(y.byCat[id])}</td>
							{/each}
							<td class="num">{whole(categoryAvg(id))}</td>
						</tr>
					{/each}
				</tbody>
				<tfoot>
					<tr>
						<th scope="row">{m.farm_row_total()}</th>
						{#each yearData as y (y.year.n)}
							<td class="num">{whole(y.total)}</td>
						{/each}
						<td class="num">{whole(m2Avg)}</td>
					</tr>
					<tr class="soft">
						<th scope="row">{m.farm_row_per_liter()}</th>
						{#each yearData as y (y.year.n)}
							<td class="num">{cents(y.perLiter, locale)}</td>
						{/each}
						<td class="num">{cents(m2Avg / (m2Years.reduce((s, y) => s + y.liters, 0) / m2Years.length), locale)}</td>
					</tr>
				</tfoot>
			</table>
		</div>
	</div>
</section>

<!-- ============ Begroting vs praktijk ============ -->
<section class="fw-section fw-section--alt" id="vergelijking">
	<div class="fw-wrap">
		<h2>{m.farm_compare_title()}</h2>
		<p class="fw-lede">{m.farm_compare_lede()}</p>

		<div class="fw-card block table-wrap">
			<table class="data overview">
				<thead>
					<tr>
						<th scope="col">{m.farm_col_category()}</th>
						<th scope="col" class="num">{m.farm_compare_budget()}</th>
						<th scope="col" class="num">{m.farm_compare_practice()}</th>
					</tr>
				</thead>
				<tbody>
					{#each compareRows as r (r.id)}
						<tr>
							<th scope="row"><span class="swatch" style="--c: {r.color}"></span>{r.label}</th>
							<td class="num" class:muted={r.budget === 0}>
								{r.budget === 0 ? m.farm_compare_not_budgeted() : whole(r.budget)}
							</td>
							<td class="num">{whole(r.practice)}</td>
						</tr>
					{/each}
				</tbody>
				<tfoot>
					<tr>
						<th scope="row">{m.farm_row_total()}</th>
						<td class="num">{whole(compareBudget)}</td>
						<td class="num">{whole(m2Avg)}</td>
					</tr>
				</tfoot>
			</table>
		</div>
		<p class="conclusion">{m.farm_compare_conclusion()}</p>
	</div>
</section>

<!-- ============ Aanschaf en totaal ============ -->
<section class="fw-section" id="aanschaf">
	<div class="fw-wrap">
		<h2>{m.farm_life_title()}</h2>
		<p class="fw-lede">{m.farm_life_lede()}</p>

		<div class="fw-card block">
			<ShareBar
				shares={lifeShares}
				format={whole}
				formatShare={(f) => pct(f, locale)}
				ariaLabel={m.farm_life_aria()}
			/>
			<p class="per-liter">
				{m.farm_life_liters({
					liters: num(lifetime.liters, locale),
					purchase: cents(purchasePerLiter, locale),
					maintenance: cents(maintenancePerLiter, locale)
				})}
			</p>
		</div>

		<h3 class="sub">{m.farm_purchases_title()}</h3>
		<div class="fw-card block table-wrap">
			<table class="data overview">
				<thead>
					<tr>
						<th scope="col">{m.costs_prices_item()}</th>
						<th scope="col" class="num">{m.farm_col_excl()}</th>
						<th scope="col" class="num">{m.farm_col_vat()}</th>
						<th scope="col" class="num">{m.farm_col_incl()}</th>
					</tr>
				</thead>
				<tbody>
					{#each purchases.filter((p) => p.id !== "m2-2022") as p (p.id)}
						<tr>
							<th scope="row">{p.label[locale]}</th>
							<td class="num">{whole(p.excl)}</td>
							<td class="num">{pct(p.vat, locale)}</td>
							<td class="num">{whole(p.incl)}</td>
						</tr>
					{/each}
					<tr class="soft">
						<th scope="row">{m.farm_life_purchase()}</th>
						<td class="num"></td>
						<td class="num"></td>
						<td class="num">{whole(lifetime.purchase)}</td>
					</tr>
					{#each purchases.filter((p) => p.id === "m2-2022") as p (p.id)}
						<tr>
							<th scope="row">{p.label[locale]}</th>
							<td class="num">{whole(p.excl)}</td>
							<td class="num">{pct(p.vat, locale)}</td>
							<td class="num">{whole(p.incl)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		<p class="small">{m.farm_purchases_note()}</p>
		<p class="conclusion">{m.farm_life_remarks()}</p>
	</div>
</section>

<!-- ============ Uitgangspunten + afsluiting ============ -->
<section class="fw-section fw-section--alt">
	<div class="fw-wrap end">
		<div>
			<h2>{m.farm_notes_title()}</h2>
			<ul class="notes">
				<li>{m.farm_notes_1({ milkings: farmFacts.milkingsPerDay })}</li>
				<li>{m.farm_notes_2()}</li>
				<li>{m.farm_notes_3()}</li>
				<li>{m.farm_notes_4()}</li>
			</ul>
		</div>

		<aside class="fw-card contribute">
			<h3>{m.farm_cta_title()}</h3>
			<p>{m.costs_contribute_body()}</p>
			<div class="cta">
				<a class="fw-btn" href={feeds.group.href} target="_blank" rel="noopener">
					Fullwood Merlin M2 enthusiasts
				</a>
				<a class="fw-btn fw-btn--ghost" href="{base}/kosten/">{m.farm_cta_back()}</a>
			</div>
		</aside>
	</div>
</section>

<style>
	.page-head {
		background: var(--fw-surface-alt);
		border-bottom: 1px solid var(--fw-line);
		padding-block: clamp(2rem, 5vw, 3.5rem);
	}

	.back {
		display: inline-block;
		margin-bottom: 1.25rem;
		font-size: 0.9rem;
		font-weight: 600;
		text-decoration: none;
	}

	.back:hover {
		text-decoration: underline;
	}

	/* ---------- kerncijfers ---------- */

	.stats {
		display: grid;
		gap: 1rem;
		margin: 2rem 0 0;
	}

	.stat {
		display: flex;
		flex-direction: column-reverse;
		justify-content: flex-end;
		gap: 0.35rem;
		padding: 1.15rem 1.35rem;
		background: var(--fw-surface);
		border: 1px solid var(--fw-line);
		border-radius: var(--fw-radius-lg);
	}

	.stat dt {
		font-size: 0.85rem;
		color: var(--fw-muted);
		line-height: 1.35;
	}

	.stat dd {
		margin: 0;
		font-size: clamp(1.6rem, 1.2rem + 1.4vw, 2.2rem);
		font-weight: 700;
		letter-spacing: -0.02em;
		line-height: 1.1;
		color: var(--fw-ink);
		font-variant-numeric: tabular-nums;
	}

	/* ---------- waarom ---------- */

	.why,
	.end {
		display: grid;
		gap: 2.5rem;
		align-items: start;
	}

	.why__text p {
		max-width: 62ch;
	}

	.rule {
		padding-left: 1rem;
		border-left: 3px solid var(--fw-blue);
		font-weight: 600;
		color: var(--fw-ink);
	}

	.method h3 {
		font-size: 1.05rem;
	}

	.method ul,
	.notes {
		margin: 0;
		padding-left: 1.2rem;
		display: grid;
		gap: 0.6rem;
		font-size: 0.95rem;
	}

	.notes {
		max-width: 62ch;
	}

	/* ---------- blokken en tabellen ---------- */

	.block {
		margin-top: 2rem;
		padding: clamp(1.25rem, 3vw, 2rem);
	}

	.sub {
		margin-top: 3rem;
		font-size: 1.35rem;
	}

	.small,
	.avg {
		margin-top: 1rem;
		max-width: 70ch;
		font-size: 0.9rem;
		color: var(--fw-text);
	}

	.avg__note {
		display: block;
		margin-top: 0.35rem;
		font-size: 0.85rem;
		color: var(--fw-muted);
	}

	.conclusion {
		margin-top: 1.25rem;
		max-width: 70ch;
	}

	.per-liter {
		margin: 1.25rem 0 0;
		font-weight: 600;
		color: var(--fw-ink);
	}

	.table-wrap {
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	.data th,
	.data td {
		padding: 0.65rem 0.75rem 0.65rem 0;
		text-align: left;
		vertical-align: top;
		font-weight: 400;
		border-bottom: 1px solid var(--fw-line);
		font-size: 0.92rem;
	}

	.data thead th {
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--fw-muted);
		white-space: nowrap;
	}

	.data tbody th,
	.data tfoot th {
		color: var(--fw-ink);
	}

	.data .num {
		text-align: right;
		white-space: nowrap;
		font-variant-numeric: tabular-nums;
		color: var(--fw-ink);
		padding-right: 0;
	}

	.data .num + .num {
		padding-left: 1rem;
	}

	.data tfoot th,
	.data tfoot td {
		font-weight: 700;
		border-bottom: 0;
	}

	.data tfoot tr:first-child th,
	.data tfoot tr:first-child td {
		border-top: 2px solid var(--fw-line);
	}

	.data .soft th,
	.data .soft td {
		font-weight: 600;
		color: var(--fw-text);
	}

	.data .group th,
	.data .group td {
		font-weight: 700;
		color: var(--fw-ink);
		border-bottom: 2px solid var(--fw-line);
		padding-top: 1.1rem;
	}

	.data .oneoffs th,
	.data .oneoffs td {
		color: var(--fw-text);
	}

	.muted {
		color: var(--fw-muted) !important;
	}

	.small-cell {
		max-width: 30ch;
		color: var(--fw-text);
	}

	.nowrap {
		white-space: nowrap;
	}

	.plain {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.tag {
		display: inline-block;
		margin-left: 0.35rem;
		padding: 0.05rem 0.45rem;
		border-radius: 999px;
		background: var(--fw-surface-alt);
		border: 1px solid var(--fw-line);
		font-size: 0.7rem;
		color: var(--fw-muted);
	}

	.swatch {
		display: inline-block;
		width: 12px;
		height: 12px;
		margin-right: 0.6rem;
		border-radius: 3px;
		background: var(--c);
		vertical-align: -1px;
	}

	.table-toggle {
		margin-top: 1.25rem;
		padding: 0;
	}

	summary {
		cursor: pointer;
		font-weight: 600;
		color: var(--fw-blue-dark);
	}

	.table-toggle summary {
		padding: 1rem 1.5rem;
	}

	.table-toggle .table-wrap {
		padding: 0 1.5rem 1.25rem;
	}

	/* ---------- jaarkaarten ---------- */

	.years {
		display: grid;
		gap: 1.25rem;
		margin-top: 2rem;
	}

	.year__head {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
	}

	.year__head h3 {
		margin: 0;
		font-size: 1.3rem;
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}

	.year__period {
		margin: 0.15rem 0 0;
		font-size: 0.85rem;
		color: var(--fw-muted);
	}

	.year__total {
		margin: 0;
		font-size: 1.6rem;
		font-weight: 700;
		letter-spacing: -0.02em;
		color: var(--fw-ink);
		font-variant-numeric: tabular-nums;
	}

	.year__summary {
		margin: 1rem 0 1.25rem;
		max-width: 70ch;
	}

	.mini {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
		gap: 1rem;
		margin: 0 0 1.25rem;
		padding: 1rem 0;
		border-block: 1px solid var(--fw-line);
	}

	.mini dt {
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--fw-muted);
	}

	.mini dd {
		margin: 0.15rem 0 0;
		font-weight: 600;
		color: var(--fw-ink);
		font-variant-numeric: tabular-nums;
	}

	.cats {
		list-style: none;
		margin: 0 0 1.25rem;
		padding: 0;
		display: grid;
		gap: 0.4rem 2rem;
		font-size: 0.92rem;
	}

	.cats li {
		display: grid;
		grid-template-columns: 12px 1fr auto;
		align-items: center;
		gap: 0.6rem;
	}

	.cats .swatch {
		margin: 0;
	}

	.cats .num {
		font-variant-numeric: tabular-nums;
		color: var(--fw-ink);
	}

	.lines-toggle summary {
		padding-block: 0.25rem;
	}

	.lines-toggle table {
		margin-top: 0.75rem;
	}

	/* ---------- afsluiting ---------- */

	.contribute h3 {
		font-size: 1.05rem;
	}

	.contribute p {
		font-size: 0.95rem;
	}

	.cta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	@media (min-width: 640px) {
		.stats {
			grid-template-columns: repeat(2, 1fr);
		}

		.cats {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 900px) {
		.stats {
			grid-template-columns: repeat(4, 1fr);
		}

		.why,
		.end {
			grid-template-columns: 1fr 360px;
			gap: 3.5rem;
		}

		.cats {
			grid-template-columns: repeat(3, 1fr);
		}
	}
</style>
