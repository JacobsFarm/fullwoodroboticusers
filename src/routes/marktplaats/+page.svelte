<script lang="ts">
	import { base } from '$app/paths';
	import * as m from '$lib/paraglide/messages';
	import { getLocale } from '$lib/paraglide/runtime';
	import { absoluteUrl, site, feeds, marketplace } from '$lib/config';
	import {
		listings,
		categoryLabels,
		type Listing,
		type ListingCategory,
		type ListingKind,
		type ListingStatus
	} from '$lib/data/listings';
	import type { Locale } from '$lib/data/repairs';
	import Seo from '$lib/components/Seo.svelte';

	const locale = $derived(getLocale() as Locale);

	let query = $state('');
	let kind = $state<ListingKind | 'all'>('all');
	let category = $state<ListingCategory | 'all'>('all');

	const kindLabel = $derived<Record<ListingKind, string>>({
		aangeboden: m.market_kind_offer(),
		gevraagd: m.market_kind_wanted()
	});

	const statusLabel = $derived<Record<ListingStatus, string>>({
		beschikbaar: m.market_status_available(),
		gereserveerd: m.market_status_reserved(),
		verkocht: m.market_status_sold()
	});

	const categoryIds = Object.keys(categoryLabels) as ListingCategory[];

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		return listings.filter((item) => {
			if (kind !== 'all' && item.kind !== kind) return false;
			if (category !== 'all' && item.category !== category) return false;
			if (!q) return true;
			const haystack = [
				item.title[locale],
				item.description[locale],
				item.models.join(' '),
				item.location ?? '',
				item.price ?? ''
			]
				.join(' ')
				.toLowerCase();
			return haystack.includes(q);
		});
	});

	function formatDate(iso: string) {
		try {
			return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(iso));
		} catch {
			return iso;
		}
	}

	// Alleen echte, beschikbare aanbiedingen in de structured data. Voorbeelden en
	// oproepen blijven eruit, zodat crawlers ze niet als aanbod oppikken.
	const jsonld = $derived([
		{
			'@context': 'https://schema.org',
			'@type': 'ItemList',
			name: m.market_title(),
			description: m.market_intro(),
			itemListElement: listings
				.filter((item) => !item.example && item.kind === 'aangeboden')
				.map((item, index) => ({
					'@type': 'ListItem',
					position: index + 1,
					item: {
						'@type': 'Product',
						name: item.title[locale],
						description: item.description[locale],
						url: absoluteUrl(`${base}/marktplaats/#${item.id}`),
						...(item.models.length ? { model: item.models.join(', ') } : {}),
						offers: {
							'@type': 'Offer',
							availability:
								item.status === 'verkocht'
									? 'https://schema.org/SoldOut'
									: item.status === 'gereserveerd'
										? 'https://schema.org/LimitedAvailability'
										: 'https://schema.org/InStock',
							...(item.price ? { price: item.price } : {}),
							...(item.location ? { areaServed: item.location } : {})
						}
					}
				}))
		}
	]);

	// --- formulier ---------------------------------------------------------

	let form = $state({
		kind: 'aangeboden' as ListingKind,
		category: 'robot' as ListingCategory,
		headline: '',
		description: '',
		models: '',
		price: '',
		location: '',
		contact: ''
	});

	let incomplete = $state(false);

	const submitNote = $derived(
		marketplace.submit === 'mailto' ? m.market_form_note_mailto() : m.market_form_note_github()
	);

	function compose(event: SubmitEvent) {
		event.preventDefault();

		if (!form.headline.trim() || !form.description.trim()) {
			incomplete = true;
			return;
		}
		incomplete = false;

		const subject = `[${kindLabel[form.kind]}] ${form.headline.trim()}`;
		const body = [
			`${m.market_form_kind()}: ${kindLabel[form.kind]}`,
			`${m.market_form_category()}: ${categoryLabels[form.category][locale]}`,
			`${m.market_form_headline()}: ${form.headline.trim()}`,
			`${m.market_form_models()}: ${form.models.trim() || '-'}`,
			`${m.market_form_price()}: ${form.price.trim() || '-'}`,
			`${m.market_form_location()}: ${form.location.trim() || '-'}`,
			`${m.market_form_contact()}: ${form.contact.trim() || '-'}`,
			'',
			`${m.market_form_description()}:`,
			form.description.trim()
		].join('\n');

		const url =
			marketplace.submit === 'mailto'
				? `mailto:${marketplace.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
				: `${site.repo}/issues/new?labels=${encodeURIComponent(marketplace.issueLabel)}` +
					`&title=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

		window.open(url, '_blank', 'noopener');
	}
</script>

<Seo title={m.market_title()} description={m.market_intro()} {jsonld} />

<section class="page-head">
	<div class="fw-wrap">
		<p class="fw-kicker">{m.site_name()}</p>
		<h1>{m.market_title()}</h1>
		<p class="fw-lede">{m.market_intro()}</p>
	</div>
</section>

<section class="fw-section">
	<div class="fw-wrap">
		<div class="fw-note disclaimer">
			<p><strong>{m.market_disclaimer_title()}</strong></p>
			<p>{m.market_disclaimer_body()}</p>
		</div>

		<div class="controls">
			<div class="search">
				<label class="visually-hidden" for="market-search">{m.market_search_label()}</label>
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
					id="market-search"
					type="search"
					bind:value={query}
					placeholder={m.market_search_placeholder()}
					autocomplete="off"
				/>
			</div>

			<div class="chipsets">
				<div class="chips" role="group" aria-label={m.market_form_kind()}>
					<button
						type="button"
						class="chip"
						class:is-active={kind === 'all'}
						onclick={() => (kind = 'all')}>{m.market_filter_all()}</button
					>
					<button
						type="button"
						class="chip"
						class:is-active={kind === 'aangeboden'}
						onclick={() => (kind = 'aangeboden')}>{m.market_kind_offer()}</button
					>
					<button
						type="button"
						class="chip"
						class:is-active={kind === 'gevraagd'}
						onclick={() => (kind = 'gevraagd')}>{m.market_kind_wanted()}</button
					>
				</div>

				<div class="chips" role="group" aria-label={m.market_form_category()}>
					<button
						type="button"
						class="chip chip--soft"
						class:is-active={category === 'all'}
						onclick={() => (category = 'all')}>{m.market_filter_all()}</button
					>
					{#each categoryIds as id (id)}
						<button
							type="button"
							class="chip chip--soft"
							class:is-active={category === id}
							onclick={() => (category = id)}>{categoryLabels[id][locale]}</button
						>
					{/each}
				</div>
			</div>
		</div>

		<p class="count" aria-live="polite">{m.market_results({ count: filtered.length })}</p>

		{#if filtered.length === 0}
			<p class="empty">{m.market_none()}</p>
		{:else}
			<ul class="grid">
				{#each filtered as item (item.id)}
					<li class="card" id={item.id} class:is-sold={item.status === 'verkocht'}>
						<div class="card__top">
							<span class="fw-tag" class:tag--wanted={item.kind === 'gevraagd'}>
								{kindLabel[item.kind]}
							</span>
							<span class="card__cat">{categoryLabels[item.category][locale]}</span>
							{#if item.example}
								<span class="card__example">{m.market_example()}</span>
							{/if}
						</div>

						<h2>{item.title[locale]}</h2>
						<p class="card__desc">{item.description[locale]}</p>

						<dl class="card__facts">
							{#if item.price}
								<dt>{m.market_price()}</dt>
								<dd>{item.price}</dd>
							{/if}
							{#if item.models.length}
								<dt>{m.market_models()}</dt>
								<dd>{item.models.join(' · ')}</dd>
							{/if}
							{#if item.location}
								<dt>{m.market_location()}</dt>
								<dd>{item.location}</dd>
							{/if}
							<dt>{m.market_posted()}</dt>
							<dd><time datetime={item.date}>{formatDate(item.date)}</time></dd>
						</dl>

						<div class="card__foot">
							<span class="status status--{item.status}">{statusLabel[item.status]}</span>
							<a href={item.contact.href} target="_blank" rel="noopener">
								{m.market_contact()}: {item.contact.label}
							</a>
						</div>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</section>

<section class="fw-section fw-section--alt">
	<div class="fw-wrap submit">
		<div class="submit__intro">
			<h2>{m.market_submit_title()}</h2>
			<p>{m.market_submit_body()}</p>
			<p class="submit__note">{submitNote}</p>
			<p class="submit__note">
				{m.market_form_alt()}
				<a href={feeds.group.href} target="_blank" rel="noopener">
					Fullwood Merlin M2 enthusiasts
				</a>
			</p>
		</div>

		<form class="form" onsubmit={compose}>
			<div class="form__row">
				<label>
					<span>{m.market_form_kind()}</span>
					<select bind:value={form.kind}>
						<option value="aangeboden">{m.market_kind_offer()}</option>
						<option value="gevraagd">{m.market_kind_wanted()}</option>
					</select>
				</label>

				<label>
					<span>{m.market_form_category()}</span>
					<select bind:value={form.category}>
						{#each categoryIds as id (id)}
							<option value={id}>{categoryLabels[id][locale]}</option>
						{/each}
					</select>
				</label>
			</div>

			<label>
				<span>{m.market_form_headline()}</span>
				<input type="text" bind:value={form.headline} required />
			</label>

			<label>
				<span>{m.market_form_description()}</span>
				<textarea rows="5" bind:value={form.description} required></textarea>
			</label>

			<div class="form__row">
				<label>
					<span>{m.market_form_models()} <em>{m.market_form_optional()}</em></span>
					<input type="text" bind:value={form.models} placeholder="Merlin M2" />
				</label>

				<label>
					<span>{m.market_form_price()} <em>{m.market_form_optional()}</em></span>
					<input type="text" bind:value={form.price} />
				</label>
			</div>

			<label>
				<span>{m.market_form_location()} <em>{m.market_form_optional()}</em></span>
				<input type="text" bind:value={form.location} />
			</label>

			<label>
				<span>{m.market_form_contact()}</span>
				<input type="text" bind:value={form.contact} />
				<small>{m.market_form_contact_hint()}</small>
			</label>

			{#if incomplete}
				<p class="form__error" role="alert">{m.market_form_incomplete()}</p>
			{/if}

			<button class="fw-btn" type="submit">{m.market_form_submit()}</button>
		</form>
	</div>
</section>

<style>
	.page-head {
		background: var(--fw-surface-alt);
		border-bottom: 1px solid var(--fw-line);
		padding-block: clamp(2.5rem, 6vw, 4rem);
	}

	.disclaimer {
		margin-bottom: 2rem;
	}

	.disclaimer p:first-child {
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

	.chipsets {
		display: grid;
		gap: 0.6rem;
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

	.chip--soft.is-active {
		background: var(--fw-blue-wash);
		border-color: var(--fw-blue-light);
		color: var(--fw-blue-dark);
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

	.grid {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
	}

	.card {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1.5rem;
		border: 1px solid var(--fw-line);
		border-radius: var(--fw-radius-lg);
		background: var(--fw-surface);
		scroll-margin-top: 90px;
	}

	.card.is-sold {
		background: var(--fw-surface-alt);
	}

	.card__top {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.25rem;
	}

	.tag--wanted {
		background: var(--fw-surface-alt);
		color: var(--fw-muted);
	}

	.card__cat {
		font-size: 0.78rem;
		color: var(--fw-muted);
	}

	.card__example {
		margin-left: auto;
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--fw-warn);
		border: 1px dashed currentcolor;
		border-radius: 999px;
		padding: 0.1rem 0.55rem;
	}

	.card h2 {
		margin: 0;
		font-size: 1.1rem;
	}

	.card__desc {
		margin: 0;
		font-size: 0.92rem;
	}

	.card__facts {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.15rem 1rem;
		margin: 0.5rem 0 0;
		font-size: 0.85rem;
	}

	.card__facts dt {
		color: var(--fw-muted);
	}

	.card__facts dd {
		margin: 0;
		color: var(--fw-ink);
		font-weight: 600;
	}

	.card__foot {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		margin-top: auto;
		padding-top: 1rem;
		font-size: 0.85rem;
	}

	.status {
		font-weight: 700;
		font-size: 0.78rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	.status--beschikbaar {
		color: var(--fw-ok);
	}

	.status--gereserveerd {
		color: var(--fw-warn);
	}

	.status--verkocht {
		color: var(--fw-muted);
	}

	.submit {
		display: grid;
		gap: 2rem;
		align-items: start;
	}

	.submit__intro p {
		max-width: 52ch;
	}

	.submit__note {
		font-size: 0.85rem;
		color: var(--fw-muted);
	}

	.form {
		display: grid;
		gap: 1rem;
		padding: 1.75rem;
		border: 1px solid var(--fw-line);
		border-radius: var(--fw-radius-lg);
		background: var(--fw-surface);
	}

	.form__row {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
	}

	.form label {
		display: grid;
		gap: 0.35rem;
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--fw-ink);
	}

	.form label em {
		font-style: normal;
		font-weight: 400;
		color: var(--fw-muted);
	}

	.form label small {
		font-weight: 400;
		font-size: 0.78rem;
		color: var(--fw-muted);
		line-height: 1.45;
	}

	.form input,
	.form select,
	.form textarea {
		width: 100%;
		padding: 0.6rem 0.75rem;
		border: 1px solid var(--fw-line);
		border-radius: var(--fw-radius);
		background: var(--fw-surface);
		font: inherit;
		font-size: 0.92rem;
		color: var(--fw-ink);
	}

	.form textarea {
		resize: vertical;
	}

	.form input:focus,
	.form select:focus,
	.form textarea:focus {
		outline: none;
		border-color: var(--fw-blue-light);
		box-shadow: 0 0 0 3px rgb(0 105 170 / 12%);
	}

	.form__error {
		margin: 0;
		padding: 0.7rem 1rem;
		border-radius: var(--fw-radius);
		background: var(--fw-warn-wash);
		color: #6b4410;
		font-size: 0.85rem;
	}

	.form button {
		justify-self: start;
	}

	@media (min-width: 700px) {
		.controls {
			grid-template-columns: minmax(280px, 460px) 1fr;
			align-items: start;
		}
	}

	@media (min-width: 960px) {
		.submit {
			grid-template-columns: 1fr 1.1fr;
			gap: 3rem;
		}
	}
</style>
