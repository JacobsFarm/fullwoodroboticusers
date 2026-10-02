<script lang="ts" module>
	export type Share = {
		id: string;
		label: string;
		value: number;
		color: string;
	};
</script>

<script lang="ts">
	/**
	 * Eén horizontale balk met de verdeling van een totaal, plus een legenda die elk
	 * bedrag en aandeel als tekst toont (kleur is nooit het enige signaal).
	 */


	type Props = {
		shares: Share[];
		format: (value: number) => string;
		formatShare: (fraction: number) => string;
		ariaLabel: string;
		/** Regel onder de legenda voor een post zonder bedrag (bijv. onvoorzien). */
		unknown?: { label: string; value: string };
	};

	let { shares, format, formatShare, ariaLabel, unknown }: Props = $props();

	const total = $derived(shares.reduce((s, x) => s + x.value, 0));
</script>

<div class="share">
	<div class="bar" role="img" aria-label={ariaLabel}>
		{#each shares as s (s.id)}
			<span class="seg" style="--c: {s.color}; flex: {s.value} 0 0" title="{s.label}: {format(s.value)}"></span>
		{/each}
	</div>

	<ul class="rows">
		{#each shares as s (s.id)}
			<li>
				<span class="swatch" style="--c: {s.color}"></span>
				<span class="label">{s.label}</span>
				<span class="value">{format(s.value)}</span>
				<span class="pct">{formatShare(s.value / total)}</span>
			</li>
		{/each}
		{#if unknown}
			<li class="unknown">
				<span class="swatch swatch--hatch"></span>
				<span class="label">{unknown.label}</span>
				<span class="value">{unknown.value}</span>
				<span class="pct"></span>
			</li>
		{/if}
	</ul>
</div>

<style>
	.bar {
		display: flex;
		gap: 2px;
		height: 24px;
	}

	.seg {
		background: var(--c);
		min-width: 2px;
	}

	.seg:first-child {
		border-radius: 4px 0 0 4px;
	}

	.seg:last-child {
		border-radius: 0 4px 4px 0;
	}

	.rows {
		list-style: none;
		margin: 1.25rem 0 0;
		padding: 0;
		display: grid;
	}

	.rows li {
		display: grid;
		grid-template-columns: 12px 1fr auto 3.5rem;
		align-items: center;
		gap: 0.75rem;
		padding: 0.55rem 0;
		border-bottom: 1px solid var(--fw-line);
		font-size: 0.95rem;
	}

	.rows li:first-child {
		border-top: 1px solid var(--fw-line);
	}

	.swatch {
		width: 12px;
		height: 12px;
		border-radius: 3px;
		background: var(--c);
	}

	.swatch--hatch {
		background-color: #eef1f3;
		background-image: repeating-linear-gradient(135deg, #8a949c 0 2px, transparent 2px 6px);
	}

	.label {
		color: var(--fw-ink);
	}

	.value,
	.pct {
		font-variant-numeric: tabular-nums;
		text-align: right;
		color: var(--fw-ink);
	}

	.pct {
		color: var(--fw-muted);
	}

	.unknown .value {
		color: var(--fw-muted);
	}
</style>
