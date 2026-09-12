<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import * as m from '$lib/paraglide/messages';
	import { getLocale } from '$lib/paraglide/runtime';

	let { children } = $props();

	// De HTML wordt vooraf in het Nederlands gerenderd; hier zetten we op de client
	// het lang-attribuut gelijk aan de taal die de bezoeker daadwerkelijk ziet.
	$effect(() => {
		document.documentElement.lang = getLocale();
	});
</script>

<a class="skip-link" href="#main">{m.skip_to_content()}</a>

<div class="shell">
	<Header />
	<main id="main">
		{@render children()}
	</main>
	<Footer />
</div>

<style>
	.shell {
		display: flex;
		flex-direction: column;
		min-height: 100dvh;
	}
</style>
