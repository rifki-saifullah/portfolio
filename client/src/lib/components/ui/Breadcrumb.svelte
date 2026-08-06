<script lang="ts">
	import { page } from '$app/state';
	import { buildBreadcrumbs } from '$lib/utils/route';
	import { Home } from '@lucide/svelte';

	const crumbs = $derived(buildBreadcrumbs(page.url.pathname));
</script>

{#if crumbs.length > 0}
	<div class="breadcrumbs text-sm px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 pt-6 pb-2 max-w-6xl mx-auto w-full">
		<ul>
			{#each crumbs as crumb}
				<li>
					{#if crumb.isCurrentPage}
						<span class="text-base-content/60">{crumb.label}</span>
					{:else if crumb.href === '/'}
						<a href={crumb.href} class="inline-flex items-center gap-1 text-primary hover:text-accent transition-colors">
							<Home class="h-3.5 w-3.5" />
							<span class="hidden sm:inline">{crumb.label}</span>
						</a>
					{:else}
						<a href={crumb.href} class="text-primary hover:text-accent transition-colors">
							{crumb.label}
						</a>
					{/if}
				</li>
			{/each}
		</ul>
	</div>
{/if}
