<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { feeds } from '$lib/config';
	import Seo from '$lib/components/Seo.svelte';

	const planned = $derived([
		m.costs_plan_1(),
		m.costs_plan_2(),
		m.costs_plan_3(),
		m.costs_plan_4(),
		m.costs_plan_5(),
		m.costs_plan_6()
	]);

	const jsonld = $derived([
		{
			'@context': 'https://schema.org',
			'@type': 'ItemList',
			name: m.costs_planned_title(),
			itemListElement: planned.map((name, index) => ({
				'@type': 'ListItem',
				position: index + 1,
				name
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

<section class="fw-section">
	<div class="fw-wrap grid">
		<div>
			<div class="wip">
				<span class="fw-tag">{m.costs_wip_title()}</span>
				<p>{m.costs_wip_body()}</p>
			</div>

			<h2>{m.costs_planned_title()}</h2>
			<ol class="plan">
				{#each planned as item, i (i)}
					<li>
						<span class="plan__num">{String(i + 1).padStart(2, '0')}</span>
						<span>{item}</span>
					</li>
				{/each}
			</ol>
		</div>

		<aside class="fw-card contribute">
			<h2>{m.costs_contribute_title()}</h2>
			<p>{m.costs_contribute_body()}</p>
			<a class="fw-btn" href={feeds.group.href} target="_blank" rel="noopener">
				Fullwood Merlin M2 enthusiasts
			</a>
		</aside>
	</div>
</section>

<style>
	.page-head {
		background: var(--fw-surface-alt);
		border-bottom: 1px solid var(--fw-line);
		padding-block: clamp(2.5rem, 6vw, 4rem);
	}

	.grid {
		display: grid;
		gap: 2.5rem;
		align-items: start;
	}

	.wip {
		border: 1px dashed var(--fw-line);
		border-radius: var(--fw-radius-lg);
		background: var(--fw-surface-alt);
		padding: 1.5rem;
		margin-bottom: 2.5rem;
	}

	.wip p {
		margin: 0.75rem 0 0;
		max-width: 60ch;
	}

	.plan {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0;
		counter-reset: plan;
	}

	.plan li {
		display: flex;
		align-items: baseline;
		gap: 1rem;
		padding: 0.9rem 0;
		border-bottom: 1px solid var(--fw-line);
		color: var(--fw-ink);
	}

	.plan li:first-child {
		border-top: 1px solid var(--fw-line);
	}

	.plan__num {
		font-variant-numeric: tabular-nums;
		font-weight: 700;
		font-size: 0.8rem;
		color: var(--fw-blue);
		flex: none;
		width: 1.75rem;
	}

	.contribute h2 {
		font-size: 1.05rem;
	}

	.contribute p {
		font-size: 0.95rem;
	}

	@media (min-width: 900px) {
		.grid {
			grid-template-columns: 1fr 320px;
			gap: 3.5rem;
		}
	}
</style>
