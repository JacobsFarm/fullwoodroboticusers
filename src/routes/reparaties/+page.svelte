<script lang="ts">
	import { base } from '$app/paths';
	import * as m from '$lib/paraglide/messages';
	import { getLocale } from '$lib/paraglide/runtime';
	import { absoluteUrl } from '$lib/config';
	import { repairs, categories, type Locale, type CategoryId } from '$lib/data/repairs';
	import Seo from '$lib/components/Seo.svelte';

	const locale = $derived(getLocale() as Locale);

	let query = $state('');
	let active = $state<CategoryId | 'all'>('all');

	const difficultyLabel = $derived({
		easy: m.repairs_diff_easy(),
		medium: m.repairs_diff_medium(),
		hard: m.repairs_diff_hard()
	});

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		return repairs.filter((r) => {
			if (active !== 'all' && r.category !== active) return false;
			if (!q) return true;
			const haystack = [
				r.title[locale],
				r.summary[locale],
				r.models.join(' '),
				...r.symptoms[locale],
				...r.causes[locale],
				...r.steps[locale],
				...r.parts[locale]
			]
				.join(' ')
				.toLowerCase();
			return haystack.includes(q);
		});
	});

	// Elke storing ook als HowTo in de structured data, zodat crawlers de
	// stappen als losse, geordende instructies kunnen lezen.
	const jsonld = $derived([
		{
			'@context': 'https://schema.org',
			'@type': 'ItemList',
			name: m.repairs_title(),
			description: m.repairs_intro(),
			numberOfItems: repairs.length,
			itemListElement: repairs.map((repair, index) => ({
				'@type': 'ListItem',
				position: index + 1,
				item: {
					'@type': 'HowTo',
					name: repair.title[locale],
					description: repair.summary[locale],
					url: absoluteUrl(`${base}/reparaties/#${repair.id}`),
					inLanguage: locale,
					tool: repair.parts[locale],
					step: repair.steps[locale].map((text, stepIndex) => ({
						'@type': 'HowToStep',
						position: stepIndex + 1,
						text
					}))
				}
			}))
		}
	]);
</script>

<Seo title={m.repairs_title()} description={m.repairs_intro()} {jsonld} />

<section class="page-head">
	<div class="fw-wrap">
		<p class="fw-kicker">{m.site_name()}</p>
		<h1>{m.repairs_title()}</h1>
		<p class="fw-lede">{m.repairs_intro()}</p>
	</div>
</section>

<section class="fw-section">
	<div class="fw-wrap">
		<div class="fw-note safety">
			<p><strong>{m.repairs_safety_title()}</strong></p>
			<p>{m.repairs_safety_body()}</p>
		</div>

		<div class="controls">
			<div class="search">
				<label class="visually-hidden" for="repair-search">{m.repairs_search_label()}</label>
				<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
					<circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="1.8" />
					<path
						d="m16 16 4.5 4.5"
						fill="none"
						stroke="currentColor"
						stroke-width="1.8"
						stroke-linecap="round"
					/>
				</svg>
				<input
					id="repair-search"
					type="search"
					bind:value={query}
					placeholder={m.repairs_search_placeholder()}
					autocomplete="off"
				/>
			</div>

			<div class="chips" role="group" aria-label={m.repairs_title()}>
				<button
					type="button"
					class="chip"
					class:is-active={active === 'all'}
					onclick={() => (active = 'all')}
				>
					{m.repairs_filter_all()}
				</button>
				{#each categories as category (category.id)}
					<button
						type="button"
						class="chip"
						class:is-active={active === category.id}
						onclick={() => (active = category.id)}
					>
						{category.label[locale]}
					</button>
				{/each}
			</div>
		</div>

		<p class="count" aria-live="polite">{m.repairs_results({ count: filtered.length })}</p>

		{#if filtered.length === 0}
			<p class="empty">{m.repairs_none()}</p>
		{:else}
			<div class="list">
				{#each filtered as repair (repair.id)}
					<!-- <details> houdt de volledige inhoud in de HTML, ook ingeklapt:
					     crawlers en bezoekers zonder JavaScript zien alles. -->
					<details class="item" id={repair.id}>
						<summary>
							<span class="item__title">
								<span class="item__name">{repair.title[locale]}</span>
								<span class="item__summary">{repair.summary[locale]}</span>
							</span>
							<span class="item__meta">
								<span class="fw-tag">{difficultyLabel[repair.difficulty]}</span>
								<svg class="chev" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
									<path
										d="m6 9 6 6 6-6"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</span>
						</summary>

						<div class="body">
							<dl class="facts">
								<dt>{m.repairs_models()}</dt>
								<dd>{repair.models.join(' · ')}</dd>
								<dt>{m.repairs_difficulty()}</dt>
								<dd>{difficultyLabel[repair.difficulty]}</dd>
							</dl>

							<div class="cols">
								<section>
									<h3>{m.repairs_symptoms()}</h3>
									<ul>
										{#each repair.symptoms[locale] as line, i (i)}
											<li>{line}</li>
										{/each}
									</ul>
								</section>
								<section>
									<h3>{m.repairs_causes()}</h3>
									<ul>
										{#each repair.causes[locale] as line, i (i)}
											<li>{line}</li>
										{/each}
									</ul>
								</section>
							</div>

							<section class="steps">
								<h3>{m.repairs_steps()}</h3>
								<ol>
									{#each repair.steps[locale] as line, i (i)}
										<li>{line}</li>
									{/each}
								</ol>
							</section>

							{#if repair.parts[locale].length}
								<section>
									<h3>{m.repairs_parts()}</h3>
									<p class="parts">{repair.parts[locale].join(' · ')}</p>
								</section>
							{/if}

							{#if !repair.verified}
								<p class="unverified">{m.repairs_placeholder_note()}</p>
							{/if}
						</div>
					</details>
				{/each}
			</div>
		{/if}
	</div>
</section>

<style>
	.page-head {
		background: var(--fw-surface-alt);
		border-bottom: 1px solid var(--fw-line);
		padding-block: clamp(2.5rem, 6vw, 4rem);
	}

	.safety {
		margin-bottom: 2rem;
	}

	.safety p:first-child {
		margin-bottom: 0.25rem;
	}

	.controls {
		display: grid;
		gap: 1rem;
		margin-bottom: 1.25rem;
	}

	.search {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.15rem 0.9rem;
		border: 1px solid var(--fw-line);
		border-radius: var(--fw-radius);
		background: var(--fw-surface);
		max-width: 460px;
		color: var(--fw-muted);
	}

	.search svg {
		width: 18px;
		height: 18px;
		flex: none;
	}

	.search input {
		flex: 1;
		border: 0;
		background: transparent;
		font: inherit;
		color: var(--fw-ink);
		padding: 0.65rem 0;
	}

	.search input:focus {
		outline: none;
	}

	.search:focus-within {
		border-color: var(--fw-blue-light);
		box-shadow: 0 0 0 3px rgb(0 105 170 / 12%);
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.chip {
		padding: 0.4rem 0.85rem;
		border-radius: 999px;
		border: 1px solid var(--fw-line);
		background: var(--fw-surface);
		font: inherit;
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--fw-text);
		cursor: pointer;
	}

	.chip:hover {
		border-color: var(--fw-blue-light);
		color: var(--fw-blue-dark);
	}

	.chip.is-active {
		background: var(--fw-blue);
		border-color: var(--fw-blue);
		color: #fff;
	}

	.count {
		font-size: 0.85rem;
		color: var(--fw-muted);
	}

	.empty {
		padding: 2.5rem;
		text-align: center;
		color: var(--fw-muted);
		background: var(--fw-surface-alt);
		border-radius: var(--fw-radius-lg);
	}

	.list {
		display: grid;
		gap: 0.75rem;
	}

	.item {
		border: 1px solid var(--fw-line);
		border-radius: var(--fw-radius-lg);
		background: var(--fw-surface);
		overflow: hidden;
		scroll-margin-top: 90px;
	}

	.item[open] {
		border-color: var(--fw-blue-light);
	}

	.item summary {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1.1rem 1.35rem;
		cursor: pointer;
		list-style: none;
	}

	.item summary::-webkit-details-marker {
		display: none;
	}

	.item summary:hover {
		background: var(--fw-surface-alt);
	}

	.item__title {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.item__name {
		font-weight: 700;
		font-size: 1.05rem;
		color: var(--fw-ink);
	}

	.item__summary {
		font-size: 0.875rem;
		color: var(--fw-muted);
	}

	.item__meta {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex: none;
	}

	.chev {
		width: 20px;
		height: 20px;
		color: var(--fw-muted);
		transition: transform 0.15s ease;
	}

	.item[open] .chev {
		transform: rotate(180deg);
	}

	.body {
		padding: 0 1.35rem 1.5rem;
		border-top: 1px solid var(--fw-line);
		display: grid;
		gap: 1.5rem;
	}

	.facts {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.2rem 1rem;
		margin: 1.25rem 0 0;
		font-size: 0.875rem;
	}

	.facts dt {
		color: var(--fw-muted);
	}

	.facts dd {
		margin: 0;
		color: var(--fw-ink);
		font-weight: 600;
	}

	.cols {
		display: grid;
		gap: 1.5rem;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
	}

	.body h3 {
		font-size: 0.78rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--fw-blue);
		margin-bottom: 0.6rem;
	}

	.body ul,
	.body ol {
		margin: 0;
		padding-left: 1.15rem;
		display: grid;
		gap: 0.35rem;
		font-size: 0.95rem;
	}

	.steps ol li::marker {
		font-weight: 700;
		color: var(--fw-blue);
	}

	.parts {
		margin: 0;
		font-size: 0.95rem;
	}

	.unverified {
		margin: 0;
		padding: 0.7rem 1rem;
		border-radius: var(--fw-radius);
		background: var(--fw-warn-wash);
		color: #6b4410;
		font-size: 0.82rem;
	}

	@media (min-width: 700px) {
		.controls {
			grid-template-columns: minmax(280px, 460px) 1fr;
			align-items: center;
		}
	}
</style>
