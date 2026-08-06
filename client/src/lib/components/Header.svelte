<script lang="ts">
	import ThemeController from '$lib/components/ThemeController.svelte';
	import LangController from '$lib/components/LangController.svelte';
	import * as m from '$lib/paraglide/messages';
	import Logo from '$lib/assets/logo.svg';
	import { Menu } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/state';

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
		{ href: '/#journey', label: () => m.header_nav_journey() },
		{ href: '/#portfolio', label: () => m.header_nav_portfolio() },
		{ href: '/#contact', label: () => m.header_nav_contact() },
		{ href: '/post', label: () => m.header_nav_post() }
	];

	const defaultNav = [
		{ href: '/post', label: () => m.header_nav_home() },
		{ href: '/', label: () => m.header_nav_writer() }
	];

	const navItems = $derived(variant === 'homepage' ? homepageNav : defaultNav);

	let isScrolled = $state(false);

	onMount(() => {
		const handleScroll = () => {
			isScrolled = window.scrollY > 20;
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<header
	class="site-header fixed inset-x-0 top-0 z-50 border-b border-base-300/50 transition-all duration-300 backdrop-blur-md {isScrolled
		? 'shadow-md bg-base-100/95'
		: 'bg-base-100/80'}"
>
	<div class="navbar mx-auto max-w-7xl px-6 md:px-10 lg:px-20">
		<!-- Logo -->
		<div class="navbar-start">
			<div class="dropdown">
				<div tabindex="0" role="button" class="btn btn-ghost btn-circle lg:hidden">
					<Menu class="h-5 w-5" />
				</div>

				<ul
					tabindex="0"
					class="menu menu-sm dropdown-content rounded-box z-[1] mt-3 w-56 border border-base-300 bg-base-100 p-2 shadow-lg"
				>
					{#each navItems as item}
						<li>
							<a href={item.href}>{item.label()}</a>
						</li>
					{/each}
				</ul>
			</div>

			<a
				href={logoHref}
				class="header-item font-serif text-2xl font-semibold tracking-wide text-primary transition-colors hover:text-accent"
			>
				<img src={Logo} alt="logo" class="h-8 w-8" />
			</a>
		</div>

		<!-- Desktop Navigation -->
		<div class="navbar-center hidden lg:flex">
			<nav class="flex items-center gap-8 font-sans text-sm font-medium">
				{#each navItems as item}
					<a href={item.href} class="header-item transition-colors duration-200 hover:text-primary">
						{item.label()}
					</a>
				{/each}
			</nav>
		</div>

		<!-- Actions -->
		<div class="header-item navbar-end flex items-center gap-2">
			<LangController />
			<ThemeController />
		</div>
	</div>
</header>
