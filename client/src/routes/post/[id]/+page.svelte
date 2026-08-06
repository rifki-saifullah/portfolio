<script lang="ts">
	import { Heart, Share2, Check } from '@lucide/svelte';
	import * as m from '$lib/paraglide/messages';
	import ProfilePicture from '$lib/assets/profile-picture.jpeg';
	import { postService } from '$lib/services/post.service';
	import { userService } from '$lib/services/profile.service';
	import LoadingSkeleton from '$lib/components/ui/LoadingSkeleton.svelte';
	import type { Post, User } from '$lib/types';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { getLocale } from '$lib/paraglide/runtime';
	import { toastStore } from '$lib/stores/toast.svelte.js';
	import { getImageUrl } from '$lib/utils/format';

	const postId = $derived(page.params.id ?? '');
	const locale = $derived(getLocale() as 'id' | 'en' | 'ja');

	let post = $state<Post | null>(null);
	let author = $state<User | null>(null);
	let loading = $state(true);
	let copied = $state(false);
	let copyTimeout: ReturnType<typeof setTimeout> | null = null;

	const saweria = {
		url: 'https://saweria.co/username',
		username: '@username'
	};

	onMount(async () => {
		if (!postId) {
			loading = false;
			return;
		}
		const [postResult, profileResult] = await Promise.all([
			postService.getById(postId),
			userService.getPublicProfile()
		]);

		if (postResult.ok) {
			if (postResult.data && !postResult.data.isDraft) {
				post = postResult.data;
			} else {
				post = null;
			}
		}
		if (profileResult.ok) {
			author = profileResult.data;
		}
		loading = false;
	});

	async function share() {
		const data = {
			title: post?.title[locale] || document.title,
			text: m.detail_post_share_text(),
			url: window.location.href
		};

		if (copyTimeout) clearTimeout(copyTimeout);

		try {
			if (navigator.share && navigator.canShare?.(data)) {
				await navigator.share(data);
				copied = true;
				toastStore.success(m.detail_post_copied?.() || 'Tautan disalin ke papan klip!');
				copyTimeout = setTimeout(() => {
					copied = false;
				}, 2500);
				return;
			}
		} catch (err) {
			if ((err as Error)?.name === 'AbortError') return;
		}

		try {
			await navigator.clipboard.writeText(data.url);
			copied = true;
			toastStore.success(m.detail_post_copied?.() || 'Tautan disalin ke papan klip!');
			copyTimeout = setTimeout(() => {
				copied = false;
			}, 2500);
		} catch (err) {
			console.error('Failed to copy link:', err);
		}
	}

	function getLocalizedText(obj: any): string {
		if (!obj) return '';
		if (typeof obj === 'string') return obj;
		return obj[locale] || obj['id'] || '';
	}

	function formatHtmlContent(val: any): string {
		const raw = getLocalizedText(val);
		if (!raw) return '';
		const trimmed = raw.trim();
		if (trimmed.startsWith('<p') || trimmed.startsWith('<div')) {
			return trimmed;
		}
		return `<p>${trimmed}</p>`;
	}

	function getCodeText(obj: any): string {
		const raw = getLocalizedText(obj);
		if (!raw) return '';
		if (typeof window !== 'undefined') {
			const doc = new DOMParser().parseFromString(raw, 'text/html');
			return (doc.body.textContent || doc.body.innerText || raw).trim();
		}
		return raw.replace(/<[^>]*>?/gm, '').trim();
	}
</script>

<div
	class="min-h-screen pt-4 pb-16 px-4 sm:px-6 lg:px-8 selection:bg-primary selection:text-primary-content"
>
	{#if loading}
		<div class="mx-auto w-full max-w-3xl space-y-6">
			<LoadingSkeleton variant="text" lines={2} />
			<LoadingSkeleton variant="text" lines={8} />
			<LoadingSkeleton variant="avatar" />
		</div>
	{:else if post}
		<article class="mx-auto w-full max-w-3xl">
			<header class="mb-10">
				<h1 class="mt-5 text-3xl font-bold leading-tight text-base-content md:text-5xl">
					{post.title[locale]}
				</h1>

				<div class="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-base-content/60">
					<div class="flex flex-wrap items-center gap-3">
						{#if post.category}
							<span class="badge badge-outline badge-sm">{getLocalizedText(post.category.name)}</span>
						{/if}
						<span>{new Date(post.createdAt ?? '').toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
					</div>

					<!-- Top Header Share Button -->
					<button
						class="btn btn-ghost btn-xs sm:btn-sm gap-1.5 rounded-full transition-all duration-300 active:scale-90 group {copied ? 'bg-success/15 text-success border border-success/30 scale-105' : 'hover:bg-base-200'}"
						onclick={share}
						title={copied ? (m.detail_post_copied?.() || 'Tautan disalin!') : m.detail_post_share()}
					>
						{#if copied}
							<Check class="h-4 w-4 text-success animate-pop" />
							<span class="text-xs font-semibold text-success animate-pop">{m.detail_post_copied?.() || 'Disalin!'}</span>
						{:else}
							<Share2 class="h-4 w-4 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
							<span class="hidden sm:inline text-xs font-medium">{m.detail_post_share()}</span>
						{/if}
					</button>
				</div>
			</header>

			<!-- Article Content -->
			<div class="space-y-7 text-base leading-8 text-base-content md:text-lg">
				{#each post.contentBlocks as block, i}
					{#if block.type === 'paragraph'}
						<div class="prose prose-base max-w-none dark:prose-invert article-paragraph {i === 0 ? 'first-drop-cap' : ''}">
							{@html formatHtmlContent(block.value)}
						</div>
					{:else if block.type === 'code'}
						<div class="mockup-code border border-base-300 shadow-sm font-mono text-sm">
							{#each getCodeText(block.value).split('\n') as line, idx}
								<pre data-prefix={idx === 0 ? '$' : '>'}><code>{line}</code></pre>
							{/each}
						</div>
					{:else if block.type === 'rich-text'}
						<div class="prose prose-base max-w-none dark:prose-invert article-paragraph {i === 0 ? 'first-drop-cap' : ''}">
							{@html formatHtmlContent(block.value)}
						</div>
					{:else if block.type === 'image'}
						{#if getLocalizedText(block.value)}
							<figure class="rounded-xl overflow-hidden border border-base-300 shadow-sm">
								<img src={getImageUrl(getLocalizedText(block.value))} alt="" class="w-full object-cover" loading="lazy" />
							</figure>
						{/if}
					{/if}
				{/each}

				<!-- YouTube Embed -->
				{#if post.youtubeId}
					<div class="pt-4">
						<a
							href="https://www.youtube.com/watch?v={post.youtubeId}"
							target="_blank"
							rel="noopener noreferrer"
							class="group flex flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100 transition-all duration-300 hover:border-primary hover:shadow-lg sm:flex-row"
						>
							<div class="relative h-52 w-full overflow-hidden sm:h-auto sm:w-64">
								<img
									src="https://img.youtube.com/vi/{post.youtubeId}/mqdefault.jpg"
									alt="YouTube Thumbnail"
									class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
								/>
								<div class="absolute inset-0 bg-black/25 transition group-hover:bg-black/40"></div>
								<div class="absolute inset-0 flex items-center justify-center">
									<div
										class="rounded-full bg-error p-4 text-error-content shadow-xl transition group-hover:scale-110"
									>
										<svg class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
											<path d="M8 5v14l11-7z" />
										</svg>
									</div>
								</div>
							</div>
							<div class="flex flex-1 flex-col justify-center p-5">
								<p class="text-xs font-semibold uppercase tracking-[0.25em] text-error">
									{m.detail_post_watch_now()}
								</p>
								<h3 class="mt-2 text-lg font-bold transition-colors group-hover:text-primary">
									{post.title[locale]}
								</h3>
							</div>
						</a>
					</div>
				{/if}
			</div>

			<div class="divider my-10"></div>

			<!-- Author Card -->
			<div class="rounded-2xl border border-base-300 bg-base-100 p-4">
				<div class="flex items-center justify-between gap-4">
					<a href="/" class="group flex min-w-0 flex-1 items-center gap-3 rounded-xl">
						<div class="avatar">
							<div class="w-12 h-12 rounded-full overflow-hidden bg-base-200">
								<img
									src={author?.avatarUrl ? getImageUrl(author.avatarUrl) : ProfilePicture}
									alt={author?.name || 'Author'}
									class="w-full h-full object-cover"
								/>
							</div>
						</div>
						<div class="min-w-0">
							<h3
								class="truncate font-semibold text-base-content transition-colors group-hover:text-primary"
							>
								{author?.name || 'Rifki Saifullah'}
							</h3>
							{#if author?.email}
								<p class="text-sm text-base-content/60 truncate">{author.email}</p>
							{/if}
						</div>
					</a>

					<!-- Desktop Actions -->
					<div class="hidden gap-2 sm:flex items-center">
						<button
							class="btn btn-ghost btn-sm gap-2 rounded-full transition-all duration-300 active:scale-90 group {copied ? 'bg-success/15 text-success border border-success/30 scale-105 shadow-sm' : 'hover:bg-base-200'}"
							onclick={share}
							title={copied ? (m.detail_post_copied?.() || 'Tautan disalin!') : m.detail_post_share()}
						>
							{#if copied}
								<Check class="h-4 w-4 text-success animate-pop" />
								<span class="text-xs font-semibold text-success animate-pop">{m.detail_post_copied?.() || 'Disalin!'}</span>
							{:else}
								<Share2 class="h-4 w-4 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
								<span>{m.detail_post_share()}</span>
							{/if}
						</button>
						<a
							href={author?.saweriaUrl || saweria.url}
							target="_blank"
							rel="noopener noreferrer"
							class="btn btn-primary btn-sm rounded-full transition-all duration-300 hover:scale-105 active:scale-95"
						>
							<Heart class="h-4 w-4 fill-current" />
							<span>{m.detail_post_support()}</span>
						</a>
					</div>
				</div>

				<!-- Mobile Actions -->
				<div class="mt-4 grid grid-cols-2 gap-2 sm:hidden">
					<button
						class="btn transition-all duration-300 active:scale-95 {copied ? 'btn-success text-success-content shadow-md scale-102' : 'btn-outline'}"
						onclick={share}
					>
						{#if copied}
							<Check class="h-4 w-4 animate-pop" />
							<span class="animate-pop">{m.detail_post_copied?.() || 'Disalin!'}</span>
						{:else}
							<Share2 class="h-4 w-4 transition-transform duration-200" />
							<span>{m.detail_post_share()}</span>
						{/if}
					</button>
					<a href={author?.saweriaUrl || saweria.url} target="_blank" rel="noopener noreferrer" class="btn btn-primary transition-all duration-300 active:scale-95">
						<Heart class="h-4 w-4 fill-current" />
						<span>{m.detail_post_support()}</span>
					</a>
				</div>
			</div>
		</article>
	{:else}
		<div class="mx-auto w-full max-w-3xl py-20 text-center">
			<h1 class="mb-4 text-7xl font-bold text-base-content/20">404</h1>
			<h2 class="mb-2 text-2xl font-bold text-base-content">{m.detail_post_not_found_title()}</h2>
			<p class="mb-8 text-base-content/60">
				{m.detail_post_not_found_desc()}
			</p>
			<a href="/post" class="btn btn-primary">{m.detail_post_back_to_list()}</a>
		</div>
	{/if}
</div>

<style>
	:global(.article-paragraph p) {
		text-indent: 2.25rem;
	}
	:global(.first-drop-cap p:first-of-type) {
		text-indent: 0;
	}
	:global(.first-drop-cap p:first-of-type::first-letter) {
		float: left;
		font-size: 4rem;
		line-height: 0.8;
		font-weight: 700;
		margin-right: 0.75rem;
		margin-top: 0.15rem;
		color: var(--fallback-p, oklch(var(--p) / 1));
		font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
	}

	@keyframes pop-in {
		0% {
			transform: scale(0.75);
			opacity: 0;
		}
		60% {
			transform: scale(1.15);
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}
	.animate-pop {
		animation: pop-in 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
	}
</style>
