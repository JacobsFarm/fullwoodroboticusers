<script lang="ts">
	import { base } from '$app/paths';
	import * as m from '$lib/paraglide/messages';
	import { getLocale } from '$lib/paraglide/runtime';
	import { models } from '$lib/data/models';
	import type { Locale } from '$lib/data/repairs';
	import { absoluteUrl } from '$lib/config';
	import Seo from '$lib/components/Seo.svelte';

	const locale = $derived(getLocale() as Locale);

	const cards = $derived([
		{
			href: `${base}/reparaties/`,
			title: m.home_card_repairs_title(),
			body: m.home_card_repairs_body()
		},
		{
			href: `${base}/kosten/`,
			title: m.home_card_costs_title(),
			body: m.home_card_costs_body()
		},
		{
			href: `${base}/socials/`,
			title: m.home_card_socials_title(),
			body: m.home_card_socials_body()
		}
	]);

	const jsonld = $derived([
		{
			'@context': 'https://schema.org',
			'@type': 'ItemList',
			name: m.home_cards_title(),
			itemListElement: cards.map((card, index) => ({
				'@type': 'ListItem',
				position: index + 1,
				name: card.title,
				description: card.body,
				url: absoluteUrl(card.href)
			}))
		},
		{
			'@context': 'https://schema.org',
			'@type': 'ItemList',
			name: m.home_models_title(),
			itemListElement: models.map((model, index) => ({
				'@type': 'ListItem',
				position: index + 1,
				name: model.name,
				description: model.blurb[locale]
			}))
		}
	]);
</script>

<Seo title={m.site_tagline()} description={m.home_hero_sub()} {jsonld} />

<section class="hero">
	<div class="fw-wrap hero__inner">
		<p class="hero__kicker">{m.home_hero_kicker()}</p>
		<h1>{m.home_hero_title()}</h1>
		<p class="hero__sub">{m.home_hero_sub()}</p>
		<div class="hero__actions">
			<a class="fw-btn" href="{base}/reparaties/">{m.home_hero_cta_primary()}</a>
			<a class="fw-btn fw-btn--on-dark" href="{base}/socials/">{m.home_hero_cta_secondary()}</a>
		</div>
		<p class="hero__disclaimer">{m.disclaimer_short()}</p>
	</div>
</section>

<section class="fw-section">
	<div class="fw-wrap intro">
		<div>
			<p class="fw-kicker">{m.home_intro_title()}</p>
			<p class="fw-lede">{m.home_intro_body()}</p>
		</div>
	</div>
</section>

<section class="fw-section fw-section--alt">
	<div class="fw-wrap">
		<h2>{m.home_cards_title()}</h2>
		<div class="fw-grid cards">
			{#each cards as card (card.href)}
				<a class="card" href={card.href}>
					<h3>{card.title}</h3>
					<p>{card.body}</p>
					<span class="card__link">{m.home_card_link()} →</span>
				</a>
			{/each}
		</div>
	</div>
</section>

<section class="fw-section">
	<div class="fw-wrap">
		<h2>{m.home_models_title()}</h2>
		<p class="fw-lede">{m.home_models_intro()}</p>
		<div class="fw-grid models">
			{#each models as model (model.id)}
				<article class="fw-card">
					<h3>{model.name}</h3>
					{#if model.period}
						<p class="models__period">{model.period}</p>
					{/if}
					<p>{model.blurb[locale]}</p>
					{#if model.specs.length}
						<dl class="specs">
							{#each model.specs as spec (spec.label.nl)}
								<dt>{spec.label[locale]}</dt>
								<dd>{spec.value}</dd>
							{/each}
						</dl>
					{:else}
						<p class="fw-tag">{m.home_models_note()}</p>
					{/if}
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.hero {
		background:
			radial-gradient(120% 140% at 85% 0%, rgb(0 105 170 / 55%) 0%, transparent 60%),
			linear-gradient(160deg, var(--fw-blue-dark) 0%, var(--fw-blue-deep) 100%);
		color: #fff;
		padding-block: clamp(3.5rem, 9vw, 7rem);
	}

	.hero__inner {
		max-width: 860px;
		margin-inline: auto;
		text-align: center;
	}

	.hero__kicker {
		text-transform: uppercase;
		letter-spacing: 0.16em;
		font-size: 0.75rem;
		font-weight: 700;
		color: rgb(255 255 255 / 70%);
		margin-bottom: 1rem;
	}

	.hero :global(h1) {
		color: #fff;
		margin-bottom: 1rem;
	}

	.hero__sub {
		font-size: 1.125rem;
		color: rgb(255 255 255 / 82%);
		max-width: 60ch;
		margin-inline: auto;
	}

	.hero__actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		justify-content: center;
		margin-top: 2rem;
	}

	.hero__disclaimer {
		margin-top: 2.5rem;
		margin-bottom: 0;
		font-size: 0.8rem;
		color: rgb(255 255 255 / 55%);
	}

	.intro {
		display: grid;
		gap: 2rem;
	}

	.cards {
		margin-top: 2rem;
	}

	.card {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		background: var(--fw-surface);
		border: 1px solid var(--fw-line);
		border-radius: var(--fw-radius-lg);
		padding: 1.75rem;
		text-decoration: none;
		color: inherit;
		transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
	}

	.card:hover {
		border-color: var(--fw-blue-light);
		box-shadow: var(--fw-shadow);
		transform: translateY(-2px);
	}

	.card h3 {
		margin-bottom: 0.35rem;
	}

	.card p {
		margin-bottom: 1rem;
	}

	.card__link {
		margin-top: auto;
		color: var(--fw-blue);
		font-weight: 600;
		font-size: 0.9rem;
	}

	.models {
		margin-top: 2rem;
	}

	.models__period {
		color: var(--fw-muted);
		font-size: 0.85rem;
		margin-bottom: 0.5rem;
	}

	.specs {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.25rem 1rem;
		margin: 0;
		font-size: 0.9rem;
	}

	.specs dt {
		color: var(--fw-muted);
	}

	.specs dd {
		margin: 0;
		font-weight: 600;
		color: var(--fw-ink);
	}
</style>
