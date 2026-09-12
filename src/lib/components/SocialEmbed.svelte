<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import type { SocialFeed } from '$lib/config';

	type Props = {
		feed: SocialFeed;
		title: string;
		/** Embed laadt pas nadat de bezoeker toestemming heeft gegeven. */
		consented: boolean;
		/** Extra uitleg onder de embed. */
		note?: string;
	};

	let { feed, title, consented, note }: Props = $props();

	const height = $derived(feed.kind === 'facebook-page' ? 720 : feed.kind === 'youtube' ? 380 : 420);

	const src = $derived.by(() => {
		const target = encodeURIComponent(feed.embedRef ?? feed.href);
		switch (feed.kind) {
			case 'facebook-page':
				return (
					`https://www.facebook.com/plugins/page.php?href=${target}` +
					`&tabs=timeline&width=500&height=${height}&small_header=false` +
					`&adapt_container_width=true&hide_cover=false&show_facepile=false`
				);
			case 'facebook-group':
				return (
					`https://www.facebook.com/plugins/group.php?href=${target}` +
					`&width=500&show_social_context=true&show_metadata=true`
				);
			case 'youtube':
				// nocookie-variant: YouTube plaatst dan pas iets bij afspelen.
				return `https://www.youtube-nocookie.com/embed/videoseries?list=${feed.embedRef}`;
		}
	});
</script>

<article class="emb">
	<header class="emb__head">
		<h3>{title}</h3>
		<a class="fw-btn fw-btn--ghost" href={feed.href} target="_blank" rel="noopener">
			{m.socials_open_channel()}
			<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false">
				<path
					d="M7 17 17 7M9 7h8v8"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</a>
	</header>

	<div class="emb__frame" class:is-wide={feed.kind === 'youtube'} style="--h: {height}px">
		{#if consented}
			<iframe
				{src}
				{title}
				width="100%"
				{height}
				style="border:none;overflow:hidden"
				loading="lazy"
				allowfullscreen={true}
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
			></iframe>
		{:else}
			<p class="emb__placeholder">{m.socials_consent_title()}</p>
		{/if}
	</div>

	{#if note}
		<p class="emb__note">{note}</p>
	{/if}
</article>

<style>
	.emb {
		background: var(--fw-surface);
		border: 1px solid var(--fw-line);
		border-radius: var(--fw-radius-lg);
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.emb__head {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
	}

	.emb__head h3 {
		margin: 0;
	}

	.emb__frame {
		min-height: var(--h);
		display: grid;
		place-items: center;
		background: var(--fw-surface-alt);
		border-radius: var(--fw-radius);
		overflow: hidden;
	}

	.emb__frame iframe {
		width: 100%;
		max-width: 500px;
	}

	.emb__frame.is-wide iframe {
		max-width: 100%;
	}

	.emb__placeholder {
		margin: 0;
		padding: 2rem;
		text-align: center;
		color: var(--fw-muted);
		max-width: 36ch;
	}

	.emb__note {
		margin: 0;
		font-size: 0.82rem;
		color: var(--fw-muted);
	}
</style>
