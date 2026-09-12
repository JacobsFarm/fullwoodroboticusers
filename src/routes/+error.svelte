<script lang="ts">
	import { base } from '$app/paths';
	import * as m from '$lib/paraglide/messages';
</script>

<svelte:head>
	<title>{m.error_title()} — {m.site_name()}</title>
	<meta name="robots" content="noindex, follow" />
</svelte:head>

<section class="fw-section">
	<div class="fw-wrap err">
		<p class="fw-kicker">404</p>
		<h1>{m.error_title()}</h1>
		<p class="fw-lede">{m.error_body()}</p>
		<a class="fw-btn" href="{base}/">{m.error_home()}</a>
	</div>
</section>

<style>
	.err {
		max-width: 56ch;
		padding-block: clamp(2rem, 8vw, 5rem);
	}

	.err a {
		margin-top: 1rem;
	}
</style>
