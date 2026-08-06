<script lang="ts">
	import type { Pathname } from '$app/types';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import { themeStore } from '$lib/stores/theme.svelte.js';
	import { authStore } from '$lib/stores/auth.svelte.js';
	import { env } from '$env/dynamic/public';
	import { onMount } from 'svelte';
	import Toast from '$lib/components/ui/Toast.svelte';
	import favicon from '$lib/assets/favicon.svg';
	import './layout.css';

	let { children } = $props();

	onMount(async () => {
		themeStore.initialize();
		authStore.initialize();

		// Start MSW in development mode
		if (env.PUBLIC_MOCK_API === 'true') {
			const { worker } = await import('$lib/mocks/browser');
			await worker.start({ onUnhandledRequest: 'bypass' });
		}
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<Toast />
{@render children()}

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={resolve(localizeHref(page.url.pathname, { locale }) as Pathname)}>{locale}</a>
	{/each}
</div>
