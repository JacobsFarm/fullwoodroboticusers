<script lang="ts" module>
	export type ChartSeries = {
		id: string;
		label: string;
		color: string;
		/** Gearceerd vlak, voor schattingen. */
		hatch?: boolean;
	};

	export type ChartColumn = {
		id: string;
		label: string;
		/** Tweede regel onder het label, bijv. "lopend". */
		sub?: string;
		segments: { series: string; value: number }[];
	};

	export type Marker = { afterIndex: number; label: string };
</script>

<script lang="ts">
	/**
	 * Gestapelde kolomgrafiek in gewone HTML/CSS. Geen grafiekbibliotheek nodig en
	 * de tekst blijft scherp en doorzoekbaar. Hover én toetsenbordfocus tonen de
	 * tooltip; de bedragen staan ook altijd in de tabel onder de grafiek.
	 */


	type Props = {
		columns: ChartColumn[];
		series: ChartSeries[];
		format: (value: number) => string;
		formatTick?: (value: number) => string;
		totalLabel: string;
		ariaLabel: string;
		height?: number;
		/** Toon het totaal boven elke kolom (alleen bij weinig kolommen). */
		showTotals?: boolean;
		/** Minimale breedte per kolom in px; daaronder scrolt de grafiek horizontaal. */
		minColumn?: number;
		/** Breedte van een balk in px. Standaard 24; breder bij weinig kolommen. */
		barWidth?: number;
		markers?: Marker[];
	};

	let {
		columns,
		series,
		format,
		formatTick = format,
		totalLabel,
		ariaLabel,
		height = 280,
		showTotals = false,
		minColumn = 44,
		barWidth = 24,
		markers = []
	}: Props = $props();

	const totals = $derived(columns.map((c) => c.segments.reduce((s, x) => s + x.value, 0)));
	const maxTotal = $derived(Math.max(...totals, 1));

	const step = $derived.by(() => {
		const candidates = [500, 1000, 2000, 2500, 5000, 10000, 20000, 50000];
		return candidates.find((c) => maxTotal / c <= 6) ?? 100000;
	});
	const yMax = $derived(Math.ceil(maxTotal / step) * step);
	const ticks = $derived(Array.from({ length: yMax / step + 1 }, (_, n) => n * step));

	const seriesById = $derived(new Map(series.map((s) => [s.id, s])));
	const used = $derived(
		series.filter((s) => columns.some((c) => c.segments.some((x) => x.series === s.id && x.value > 0)))
	);

	function edge(index: number): string {
		const n = columns.length;
		if (n >= 4 && index < n * 0.25) return 'edge-l';
		if (n >= 4 && index >= n * 0.75) return 'edge-r';
		return '';
	}
</script>

<figure class="chart" style="--h: {height}px; --n: {columns.length}; --min: {minColumn}px; --bar: {barWidth}px">
	<ul class="legend" aria-label={ariaLabel}>
		{#each used as s (s.id)}
			<li>
				<span class="swatch" class:hatch={s.hatch} style="--c: {s.color}"></span>
				{s.label}
			</li>
		{/each}
	</ul>

	<div class="scroll">
		<div class="plot">
			<div class="axis" aria-hidden="true">
				{#each ticks as t (t)}
					<div class="tick" style="bottom: {(t / yMax) * 100}%">
						<span>{formatTick(t)}</span>
					</div>
				{/each}
			</div>

			<div class="cols">
				{#each ticks as t (t)}
					<div class="gl" style="bottom: {(t / yMax) * 100}%" aria-hidden="true"></div>
				{/each}

				{#each markers as marker (marker.afterIndex)}
					<div
						class="marker"
						style="left: {((marker.afterIndex + 1) / columns.length) * 100}%"
						aria-hidden="true"
					>
						<span>{marker.label}</span>
					</div>
				{/each}

				{#each columns as column, index (column.id)}
					<!-- Focusbaar zodat toetsenbordgebruikers dezelfde tooltip krijgen als muisgebruikers. -->
					<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
					<div
						class="col {edge(index)}"
						tabindex="0"
						role="group"
						aria-label="{column.label}: {format(totals[index])}"
					>
						<div class="bars">
							<div class="stack" style="height: {(totals[index] / yMax) * 100}%">
								{#if showTotals}
									<span class="total">{format(totals[index])}</span>
								{/if}
								{#each column.segments as seg (seg.series)}
									{@const s = seriesById.get(seg.series)}
									{#if s && seg.value > 0}
										<i
											class="seg"
											class:hatch={s.hatch}
											style="--c: {s.color}; flex: {seg.value} 0 0"
										></i>
									{/if}
								{/each}
							</div>
						</div>
						<div class="x">
							<span>{column.label}</span>
							{#if column.sub}<small>{column.sub}</small>{/if}
						</div>

						<div class="tip" role="tooltip">
							<strong>{column.label}{column.sub ? ` · ${column.sub}` : ''}</strong>
							<ul>
								{#each column.segments as seg (seg.series)}
									{@const s = seriesById.get(seg.series)}
									{#if s && seg.value > 0}
										<li>
											<span class="swatch" class:hatch={s.hatch} style="--c: {s.color}"></span>
											<span class="tip__label">{s.label}</span>
											<span class="tip__value">{format(seg.value)}</span>
										</li>
									{/if}
								{/each}
							</ul>
							<p>
								<span>{totalLabel}</span>
								<strong>{format(totals[index])}</strong>
							</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</figure>

<style>
	.chart {
		margin: 0;
	}

	.legend {
		list-style: none;
		margin: 0 0 1.25rem;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1.25rem;
		font-size: 0.85rem;
		color: var(--fw-text);
	}

	.legend li {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}

	.swatch {
		width: 12px;
		height: 12px;
		border-radius: 3px;
		background: var(--c);
		flex: none;
	}

	.hatch {
		background-color: #eef1f3;
		background-image: repeating-linear-gradient(
			135deg,
			var(--c) 0 2px,
			transparent 2px 6px
		);
	}

	.scroll {
		overflow-x: auto;
		/* ruimte boven voor het bovenste y-label, dat half boven de plot uitsteekt */
		padding-block: 0.6rem 0.25rem;
	}

	.plot {
		position: relative;
		display: grid;
		grid-template-columns: 4.25rem 1fr;
		min-width: calc(4.25rem + var(--n) * var(--min));
		/* ruimte voor de x-labels onder de balken */
		padding-bottom: 3rem;
	}

	/* ---------- y-as ---------- */

	.axis {
		position: relative;
		height: var(--h);
	}

	.tick {
		position: absolute;
		left: 0;
		right: 0;
		height: 0;
	}

	.tick span {
		position: absolute;
		right: 0.75rem;
		bottom: 0;
		transform: translateY(50%);
		font-size: 0.72rem;
		font-variant-numeric: tabular-nums;
		color: var(--fw-muted);
		white-space: nowrap;
	}

	.cols {
		position: relative;
		display: grid;
		grid-template-columns: repeat(var(--n), minmax(0, 1fr));
		height: var(--h);
	}

	.gl {
		position: absolute;
		left: 0;
		right: 0;
		height: 1px;
		background: var(--fw-line);
		pointer-events: none;
	}

	.col {
		position: relative;
		height: 100%;
		outline-offset: -2px;
		cursor: default;
	}

	.col:hover,
	.col:focus-visible {
		background: var(--fw-blue-wash);
	}

	.bars {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: flex-end;
		justify-content: center;
	}

	.stack {
		position: relative;
		display: flex;
		flex-direction: column-reverse;
		width: min(var(--bar), 60%);
	}

	.seg {
		display: block;
		font-style: normal;
		background: var(--c);
		border-top: 2px solid var(--fw-surface);
		min-height: 2px;
	}

	.seg:first-of-type {
		border-top: 0;
	}

	.seg:last-of-type {
		border-radius: 4px 4px 0 0;
	}

	.seg.hatch {
		background-color: #eef1f3;
		background-image: repeating-linear-gradient(
			135deg,
			var(--c) 0 2px,
			transparent 2px 6px
		);
	}

	.total {
		position: absolute;
		bottom: calc(100% + 4px);
		left: 50%;
		transform: translateX(-50%);
		font-size: 0.78rem;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		color: var(--fw-ink);
		white-space: nowrap;
	}

	.x {
		position: absolute;
		top: calc(100% + 0.5rem);
		left: 0;
		right: 0;
		text-align: center;
		font-size: 0.78rem;
		color: var(--fw-text);
		line-height: 1.25;
	}

	.x small {
		display: block;
		color: var(--fw-muted);
		font-size: 0.7rem;
	}

	/* ---------- marker (bijv. overstap naar M2) ---------- */

	.marker {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 0;
		border-left: 1px solid var(--fw-muted);
		z-index: 1;
		pointer-events: none;
	}

	.marker span {
		position: absolute;
		top: 0;
		right: 6px;
		text-align: right;
		font-size: 0.7rem;
		font-weight: 600;
		color: var(--fw-muted);
		white-space: nowrap;
	}

	/* ---------- tooltip ---------- */

	.tip {
		display: none;
		position: absolute;
		top: 8px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 5;
		min-width: 17rem;
		max-width: 22rem;
		padding: 0.75rem 0.9rem;
		background: var(--fw-surface);
		border: 1px solid var(--fw-line);
		border-radius: var(--fw-radius);
		box-shadow: var(--fw-shadow);
		font-size: 0.82rem;
		line-height: 1.4;
		pointer-events: none;
	}

	.col.edge-l .tip {
		left: 0;
		transform: none;
	}

	.col.edge-r .tip {
		left: auto;
		right: 0;
		transform: none;
	}

	.col:hover .tip,
	.col:focus-visible .tip {
		display: block;
	}

	.tip > strong {
		display: block;
		margin-bottom: 0.4rem;
		color: var(--fw-ink);
	}

	.tip ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.25rem;
	}

	.tip li {
		display: grid;
		grid-template-columns: 12px 1fr auto;
		align-items: center;
		gap: 0.5rem;
	}

	.tip__label {
		color: var(--fw-text);
	}

	.tip__value,
	.tip p strong {
		font-variant-numeric: tabular-nums;
		color: var(--fw-ink);
	}

	.tip p {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		margin: 0.5rem 0 0;
		padding-top: 0.5rem;
		border-top: 1px solid var(--fw-line);
	}
</style>
