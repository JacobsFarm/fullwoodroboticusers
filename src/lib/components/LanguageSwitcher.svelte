<script lang="ts">
	import { getLocale, setLocale, locales, type Locale } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';

	const names: Record<string, string> = {
		nl: 'Nederlands',
		en: 'English',
		de: 'Deutsch'
	};

	let current = $state<string>(getLocale());

	// Op de client kan de opgeslagen taal afwijken van de taal waarmee de pagina
	// vooraf is gerenderd; daarom pas na hydratie de echte waarde overnemen.
	$effect(() => {
		current = getLocale();
	});

	function change(event: Event) {
		const value = (event.currentTarget as HTMLSelectElement).value as Locale;
		if (value !== getLocale()) setLocale(value);
	}
</script>

<div class="lang">
	<label class="visually-hidden" for="lang-select">{m.lang_label()}</label>
	<svg class="lang__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
		<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6" />
		<path
			d="M3 12h18M12 3c2.4 2.6 3.6 5.6 3.6 9S14.4 18.4 12 21c-2.4-2.6-3.6-5.6-3.6-9S9.6 5.6 12 3Z"
			fill="none"
			stroke="currentColor"
			stroke-width="1.6"
		/>
	</svg>
	<select id="lang-select" value={current} onchange={change}>
		{#each locales as locale (locale)}
			<option value={locale}>{names[locale] ?? locale}</option>
		{/each}
	</select>
</div>

<style>
	.lang {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.3rem 0.6rem;
		border: 1px solid var(--fw-line);
		border-radius: var(--fw-radius);
		background: var(--fw-surface);
		color: var(--fw-muted);
	}

	.lang__icon {
		width: 17px;
		height: 17px;
		flex: none;
	}

	select {
		border: 0;
		background: transparent;
		font: inherit;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--fw-ink);
		cursor: pointer;
		padding: 0.2rem 0;
	}

	select:focus-visible {
		outline: 2px solid var(--fw-blue-light);
		outline-offset: 2px;
	}
</style>
