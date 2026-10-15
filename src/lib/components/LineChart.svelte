<script lang="ts" module>
	export type LineSeries = {
		id: string;
		label: string;
		color: string;
		/** Gestreepte lijn, zodat de reeksen ook zonder kleur te onderscheiden zijn. */
		dashed?: boolean;
		points: { x: number; y: number }[];
	};
</script>

<script lang="ts">
	/**
	 * Lijngrafiek in gewone SVG, zonder grafiekbibliotheek. De x-as staat op de
	 * meetpunten (niet op gelijke afstand in jaren), de bedragen staan ook in de
	 * tabel onder de grafiek en als <title> bij elk punt.
	 */

	type Props = {
		series: LineSeries[];
		/** Waarden op de x-as, in jaren. */
		xTicks: number[];
		formatX: (x: number) => string;
		formatY: (y: number) => string;
		ariaLabel: string;
		xTitle: string;
		yMax?: number;
		yStep?: number;
	};

	let { series, xTicks, formatX, formatY, ariaLabel, xTitle, yMax = 100_000, yStep = 20_000 }: Props =
		$props();

	const W = 600;
	const H = 340;
	const pad = { top: 16, right: 20, bottom: 56, left: 84 };

	const xMax = $derived(Math.max(...xTicks));
	const px = $derived((x: number) => pad.left + (x / xMax) * (W - pad.left - pad.right));
	const py = $derived((y: number) => pad.top + (1 - y / yMax) * (H - pad.top - pad.bottom));
	const yTicks = $derived(Array.from({ length: Math.floor(yMax / yStep) + 1 }, (_, n) => n * yStep));
	const path = (s: LineSeries) =>
		s.points.map((p, i) => `${i === 0 ? 'M' : 'L'}${px(p.x).toFixed(1)} ${py(p.y).toFixed(1)}`).join(' ');
</script>

<figure class="chart">
	<ul class="legend" aria-hidden="true">
		{#each series as s (s.id)}
			<li>
				<svg width="28" height="10" viewBox="0 0 28 10" aria-hidden="true">
					<line
						x1="1"
						y1="5"
						x2="27"
						y2="5"
						stroke={s.color}
						stroke-width="3"
						stroke-linecap="round"
						stroke-dasharray={s.dashed ? '6 5' : undefined}
					/>
				</svg>
				{s.label}
			</li>
		{/each}
	</ul>

	<div class="scroll">
		<svg viewBox="0 0 {W} {H}" role="img" aria-label={ariaLabel}>
			{#each yTicks as t (t)}
				<line class="grid" x1={pad.left} x2={W - pad.right} y1={py(t)} y2={py(t)} />
				<text class="tick" x={pad.left - 10} y={py(t)} text-anchor="end" dominant-baseline="middle">
					{formatY(t)}
				</text>
			{/each}

			{#each xTicks as t (t)}
				<text class="tick" x={px(t)} y={H - pad.bottom + 20} text-anchor="middle">{formatX(t)}</text>
			{/each}
			<text class="axis-title" x={(pad.left + W - pad.right) / 2} y={H - 8} text-anchor="middle">
				{xTitle}
			</text>

			{#each series as s (s.id)}
				<path
					d={path(s)}
					fill="none"
					stroke={s.color}
					stroke-width="3"
					stroke-linejoin="round"
					stroke-linecap="round"
					stroke-dasharray={s.dashed ? '8 6' : undefined}
				/>
			{/each}

			{#each series as s (s.id)}
				{#each s.points as p (p.x)}
					<circle cx={px(p.x)} cy={py(p.y)} r="5" fill="var(--fw-surface)" stroke={s.color} stroke-width="3">
						<title>{s.label}, {formatX(p.x)}: {formatY(p.y)}</title>
					</circle>
				{/each}
			{/each}
		</svg>
	</div>
</figure>

<style>
	.chart {
		margin: 0;
	}

	.legend {
		list-style: none;
		margin: 0 0 1rem;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1.5rem;
		font-size: 0.85rem;
		color: var(--fw-text);
	}

	.legend li {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}

	.scroll {
		overflow-x: auto;
	}

	svg[role='img'] {
		display: block;
		width: 100%;
		min-width: 30rem;
		height: auto;
	}

	.grid {
		stroke: var(--fw-line);
		stroke-width: 1;
	}

	.tick {
		font-size: 12px;
		fill: var(--fw-muted);
		font-variant-numeric: tabular-nums;
	}

	.axis-title {
		font-size: 12px;
		fill: var(--fw-muted);
	}
</style>
