<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { Copyright, LogOut, LogIn } from '@lucide/svelte';
	import Logo from '$lib/assets/logo.svg';
	import { authStore } from '$lib/stores/auth.svelte.js';
	import { authService } from '$lib/services/auth.service';
	import { toastStore } from '$lib/stores/toast.svelte.js';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	interface Props {
		/** 'homepage' shows section anchors, 'default' shows page links */
		variant?: 'homepage' | 'default';
	}

	let { variant = 'default' }: Props = $props();

	const logoHref = $derived.by(() => {
		const pathname = page.url.pathname;
		if (pathname.startsWith('/admin')) {
			return '/admin/post';
		}
		if (pathname.startsWith('/post')) {
			return '/post';
		}
		return '/';
	});

	const homepageNav = [
		{ href: '/#about', label: () => m.header_nav_about() },
		{ href: '/#contact', label: () => m.header_nav_contact() },
		{ href: '/post', label: () => m.header_nav_post() }
	];

	const defaultNav = [
		{ href: '/post', label: () => m.header_nav_home() },
		{ href: '/', label: () => m.header_nav_writer() }
	];

	const navItems = $derived(variant === 'homepage' ? homepageNav : defaultNav);

	onMount(() => {
		authStore.initialize();
	});

	async function handleLogout() {
		await authService.logout();
		toastStore.success('Logout berhasil.');
		goto('/login');
	}
</script>

<footer class="border-t border-base-300 bg-base-100">
	<div
		class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-6 md:flex-row md:px-10 lg:px-20"
	>
		<!-- Logo -->
		<a
			href={logoHref}
			class="font-serif text-2xl font-semibold tracking-wide text-primary transition-colors hover:text-accent"
		>
			<img src={Logo} alt="logo" class="h-8 w-8" />
		</a>

		<!-- Copyright & Auth Action -->
		<div class="flex items-center gap-6">
			<div class="flex items-center gap-1">
				<Copyright class="h-4 w-4 text-base-content/60" />
				<p class="font-sans text-sm text-base-content/70">
					{m.footer()}
				</p>
			</div>

			{#if authStore.isAuthenticated || page.url.pathname.startsWith('/admin')}
				<button
					type="button"
					class="btn btn-ghost btn-xs text-error hover:bg-error/10 gap-1 rounded-lg"
					onclick={handleLogout}
				>
					<LogOut class="h-3.5 w-3.5" />
					<span>{m.footer_logout()}</span>
				</button>
			{:else}
				<a
					href="/login"
					class="btn btn-ghost btn-xs text-base-content/60 hover:text-primary gap-1 rounded-lg"
				>
					<LogIn class="h-3.5 w-3.5" />
					<span>{m.footer_login()}</span>
				</a>
			{/if}
		</div>
	</div>
</footer>
