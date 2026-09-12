<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { feeds, channels, allChannelUrls } from '$lib/config';
	import { highlights } from '$lib/data/highlights';
	import SocialEmbed from '$lib/components/SocialEmbed.svelte';
	import Seo from '$lib/components/Seo.svelte';

	const CONSENT_KEY = 'fw-embed-consent';

	let consented = $state(false);

	$effect(() => {
		try {
			consented = localStorage.getItem(CONSENT_KEY) === 'yes';
		} catch {
			// localStorage geblokkeerd: embeds blijven dan uit.
		}
	});

	function accept() {
		consented = true;
		try {
			localStorage.setItem(CONSENT_KEY, 'yes');
		} catch {
			// embed laadt deze sessie toch
		}
	}

	const jsonld = $derived([
		{
			'@context': 'https://schema.org',
			'@type': 'ItemList',
			name: m.socials_channels_title(),
			description: m.socials_intro(),
			numberOfItems: allChannelUrls.length,
			itemListElement: channels.flatMap((group) =>
				group.links.map((link) => ({
					'@type': 'ListItem',
					name: `${group.platform} — ${link.label}`,
					url: link.href
				}))
			)
		}
	]);
</script>

<Seo title={m.socials_title()} description={m.socials_intro()} {jsonld} />

<section class="page-head">
	<div class="fw-wrap">
		<p class="fw-kicker">{m.site_name()}</p>
		<h1>{m.socials_title()}</h1>
		<p class="fw-lede">{m.socials_intro()}</p>
	</div>
</section>

<section class="fw-section">
	<div class="fw-wrap">
		{#if !consented}
			<div class="consent">
				<div>
					<h2>{m.socials_consent_title()}</h2>
					<p>{m.socials_consent_body()}</p>
				</div>
				<button class="fw-btn" type="button" onclick={accept}>{m.socials_consent_accept()}</button>
			</div>
		{/if}

		<div class="feeds">
			<SocialEmbed feed={feeds.official} title={m.socials_official_title()} {consented} />
			<SocialEmbed
				feed={feeds.group}
				title={m.socials_group_title()}
				note={m.socials_group_note()}
				{consented}
			/>
		</div>

		<div class="feeds feeds--single">
			<SocialEmbed
				feed={feeds.youtube}
				title={m.socials_youtube_title()}
				note={m.socials_youtube_note()}
				{consented}
			/>
		</div>

		<p class="blocked">{m.socials_embed_blocked()}</p>
	</div>
</section>

<section class="fw-section fw-section--alt">
	<div class="fw-wrap">
		<h2>{m.socials_curated_title()}</h2>
		<p class="fw-lede">{m.socials_curated_body()}</p>

		{#if highlights.length === 0}
			<p class="empty">{m.socials_curated_empty()}</p>
		{:else}
			<ul class="highlights">
				{#each highlights as item (item.id)}
					<li>
						<a href={item.href} target="_blank" rel="noopener">
							<span class="highlights__meta">
								<span class="fw-tag">
									{item.source === 'official' ? 'Fullwood JOZ' : 'Fullwood Merlin M2 enthusiasts'}
								</span>
								<time datetime={item.date}>{item.date}</time>
							</span>
							<strong>{item.title}</strong>
							<span>{item.excerpt}</span>
						</a>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</section>

<section class="fw-section">
	<div class="fw-wrap">
		<h2>{m.socials_channels_title()}</h2>
		<div class="fw-grid platforms">
			{#each channels as group (group.id)}
				<section class="fw-card">
					<h3>{group.platform}</h3>
					<ul>
						{#each group.links as link (link.href)}
							<li><a href={link.href} target="_blank" rel="noopener">{link.label}</a></li>
						{/each}
					</ul>
				</section>
			{/each}
		</div>
	</div>
</section>

<style>
	.page-head {
		background: var(--fw-surface-alt);
		border-bottom: 1px solid var(--fw-line);
		padding-block: clamp(2.5rem, 6vw, 4rem);
	}

	.consent {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 1.5rem;
		padding: 1.5rem;
		margin-bottom: 2rem;
		border: 1px solid var(--fw-line);
		border-radius: var(--fw-radius-lg);
		background: var(--fw-blue-wash);
	}

	.consent h2 {
		font-size: 1.05rem;
		margin-bottom: 0.35rem;
	}

	.consent p {
		margin: 0;
		max-width: 60ch;
		font-size: 0.95rem;
	}

	.feeds {
		display: grid;
		gap: 1.5rem;
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		align-items: start;
	}

	.feeds--single {
		grid-template-columns: 1fr;
		margin-top: 1.5rem;
	}

	.blocked {
		margin: 1.25rem 0 0;
		font-size: 0.82rem;
		color: var(--fw-muted);
	}

	.empty {
		color: var(--fw-muted);
	}

	.highlights {
		list-style: none;
		margin: 2rem 0 0;
		padding: 0;
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
	}

	.highlights a {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		height: 100%;
		padding: 1.25rem;
		border: 1px solid var(--fw-line);
		border-radius: var(--fw-radius-lg);
		background: var(--fw-surface);
		text-decoration: none;
		color: var(--fw-text);
	}

	.highlights a:hover {
		border-color: var(--fw-blue-light);
	}

	.highlights__meta {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		font-size: 0.78rem;
		color: var(--fw-muted);
	}

	.highlights strong {
		color: var(--fw-ink);
		font-size: 1.02rem;
	}

	.platforms {
		margin-top: 2rem;
	}

	.platforms h3 {
		font-size: 0.78rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--fw-blue);
		margin-bottom: 0.9rem;
	}

	.platforms ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.45rem;
		font-size: 0.92rem;
	}
</style>
