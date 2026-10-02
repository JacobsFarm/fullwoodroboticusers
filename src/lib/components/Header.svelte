<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages';
	import LanguageSwitcher from './LanguageSwitcher.svelte';

	let open = $state(false);

	const links = $derived([
		{ href: `${base}/`, label: m.nav_home() },
		{ href: `${base}/reparaties/`, label: m.nav_repairs() },
		{ href: `${base}/kosten/`, label: m.nav_costs() },
		{ href: `${base}/marktplaats/`, label: m.nav_market() },
		{ href: `${base}/socials/`, label: m.nav_socials() }
	]);

	function isActive(href: string) {
		const current = page.url.pathname.replace(/\/$/, '');
		const target = href.replace(/\/$/, '');
		return target === `${base}` ? current === target : current.startsWith(target);
	}
</script>

<header class="hdr">
	<div class="fw-wrap hdr__inner">
		<a class="brand" href="{base}/" onclick={() => (open = false)}>
			<span class="brand__mark" aria-hidden="true">FR</span>
			<span class="brand__text">
				<strong>{m.site_name()}</strong>
				<small>{m.site_tagline()}</small>
			</span>
		</a>

		<button
			class="burger"
			type="button"
			aria-expanded={open}
			aria-controls="primary-nav"
			onclick={() => (open = !open)}
		>
			<span class="visually-hidden">{m.nav_menu()}</span>
			<span class="burger__bars" class:is-open={open} aria-hidden="true"></span>
		</button>

		<nav id="primary-nav" class="nav" class:is-open={open} aria-label={m.nav_menu()}>
			<ul>
				{#each links as link (link.href)}
					<li>
						<a
							href={link.href}
							aria-current={isActive(link.href) ? 'page' : undefined}
							onclick={() => (open = false)}
						>
							{link.label}
						</a>
					</li>
				{/each}
			</ul>
			<LanguageSwitcher />
		</nav>
	</div>
</header>

<style>
	.hdr {
		position: sticky;
		top: 0;
		z-index: 40;
		background: var(--fw-surface);
		border-bottom: 1px solid var(--fw-line);
	}

	.hdr__inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		min-height: 72px;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		text-decoration: none;
		color: inherit;
	}

	.brand__mark {
		display: grid;
		place-items: center;
		width: 40px;
		height: 40px;
		border-radius: 8px;
		background: var(--fw-blue);
		color: #fff;
		font-weight: 800;
		font-size: 0.85rem;
		letter-spacing: 0.02em;
		flex: none;
	}

	.brand__text {
		display: flex;
		flex-direction: column;
		line-height: 1.25;
	}

	.brand__text strong {
		color: var(--fw-ink);
		font-size: 1rem;
	}

	.brand__text small {
		color: var(--fw-muted);
		font-size: 0.75rem;
	}

	.nav {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}

	.nav ul {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.nav a {
		display: block;
		padding: 0.5rem 0.85rem;
		border-radius: var(--fw-radius);
		color: var(--fw-ink);
		font-weight: 600;
		font-size: 0.925rem;
		text-decoration: none;
	}

	.nav a:hover {
		background: var(--fw-surface-alt);
		color: var(--fw-blue-dark);
	}

	.nav a[aria-current='page'] {
		color: var(--fw-blue);
		background: var(--fw-blue-wash);
	}

	.burger {
		display: none;
		width: 44px;
		height: 44px;
		border: 1px solid var(--fw-line);
		border-radius: var(--fw-radius);
		background: var(--fw-surface);
		cursor: pointer;
		position: relative;
	}

	.burger__bars,
	.burger__bars::before,
	.burger__bars::after {
		position: absolute;
		left: 50%;
		width: 20px;
		height: 2px;
		background: var(--fw-ink);
		transform: translateX(-50%);
		transition: transform 0.18s ease, opacity 0.18s ease;
	}

	.burger__bars {
		top: 50%;
		transform: translate(-50%, -50%);
	}

	.burger__bars::before,
	.burger__bars::after {
		content: '';
		left: 0;
		transform: none;
	}

	.burger__bars::before {
		top: -6px;
	}

	.burger__bars::after {
		top: 6px;
	}

	.burger__bars.is-open {
		background: transparent;
	}

	.burger__bars.is-open::before {
		transform: translateY(6px) rotate(45deg);
	}

	.burger__bars.is-open::after {
		transform: translateY(-6px) rotate(-45deg);
	}

	@media (max-width: 800px) {
		.burger {
			display: block;
		}

		.nav {
			display: none;
			position: absolute;
			left: 0;
			right: 0;
			top: 100%;
			flex-direction: column;
			align-items: stretch;
			gap: 1rem;
			padding: 1rem clamp(1rem, 4vw, 2rem) 1.5rem;
			background: var(--fw-surface);
			border-bottom: 1px solid var(--fw-line);
			box-shadow: var(--fw-shadow);
		}

		.nav.is-open {
			display: flex;
		}

		.nav ul {
			flex-direction: column;
			align-items: stretch;
			gap: 0.125rem;
		}

		.nav a {
			padding: 0.75rem 0.85rem;
		}
	}
</style>
