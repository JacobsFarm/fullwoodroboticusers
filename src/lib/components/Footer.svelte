<script lang="ts">
	import { base } from '$app/paths';
	import * as m from '$lib/paraglide/messages';
	import { site, feeds } from '$lib/config';
</script>

<footer class="ftr">
	<div class="fw-wrap ftr__grid">
		<div>
			<h2>{m.footer_about_title()}</h2>
			<p>{m.footer_about_body()}</p>
			<p><a href={site.repo} rel="noopener">{m.footer_source()}</a></p>
		</div>

		<div>
			<h2>{m.footer_links_title()}</h2>
			<ul>
				<li><a href="{base}/reparaties/">{m.nav_repairs()}</a></li>
				<li><a href="{base}/kosten/">{m.nav_costs()}</a></li>
				<li><a href="{base}/socials/">{m.nav_socials()}</a></li>
				<li><a href={feeds.group.href} rel="noopener">Fullwood Merlin M2 enthusiasts</a></li>
				<li><a href={feeds.official.href} rel="noopener">Fullwood JOZ</a></li>
			</ul>
		</div>
	</div>

	<div class="fw-wrap ftr__legal">
		<p>{m.footer_disclaimer()}</p>
	</div>
</footer>

<style>
	.ftr {
		background: var(--fw-blue-deep);
		color: rgb(255 255 255 / 78%);
		padding-block: clamp(2.5rem, 5vw, 3.5rem) 1.5rem;
		margin-top: auto;
	}

	.ftr__grid {
		display: grid;
		gap: 2rem;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
	}

	.ftr h2 {
		color: #fff;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		margin-bottom: 0.9rem;
	}

	.ftr p {
		max-width: 46ch;
		font-size: 0.9rem;
	}

	.ftr ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.4rem;
		font-size: 0.9rem;
	}

	.ftr a {
		color: #fff;
		text-decoration: none;
		border-bottom: 1px solid rgb(255 255 255 / 30%);
	}

	.ftr a:hover {
		color: #fff;
		border-bottom-color: #fff;
	}

	.ftr__legal {
		margin-top: 2.5rem;
		padding-top: 1.25rem;
		border-top: 1px solid rgb(255 255 255 / 15%);
	}

	.ftr__legal p {
		margin: 0;
		font-size: 0.78rem;
		color: rgb(255 255 255 / 55%);
		max-width: 90ch;
	}
</style>
