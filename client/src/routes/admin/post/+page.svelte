<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { Eye, Pencil, Trash2, User as UserIcon, Folder } from '@lucide/svelte';
	import { postService } from '$lib/services/post.service';
	import { categoryService } from '$lib/services/category.service';
	import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';
	import LoadingSkeleton from '$lib/components/ui/LoadingSkeleton.svelte';
	import { toastStore } from '$lib/stores/toast.svelte.js';
	import type { Post, Category } from '$lib/types';
	import { onMount } from 'svelte';
	import { getLocale } from '$lib/paraglide/runtime';

	let posts = $state<Post[]>([]);
	let categories = $state<Category[]>([]);
	let selectedCategoryId = $state<number | null>(null); // null = "Semua"
	
	let loading = $state(true);
	let loadingMore = $state(false);
	let page = $state(1);
	let hasMore = $state(true);

	let selectedPost = $state<Post | null>(null);
	let deleteDialogOpen = $state(false);

	const locale = $derived(getLocale() as 'id' | 'en' | 'ja');

	onMount(async () => {
		await loadCategories();
		await loadPosts(1, true);
	});

	async function loadCategories() {
		const res = await categoryService.getAll();
		if (res.ok) {
			// Check if response is array or paginated object
			categories = Array.isArray(res.data) ? res.data : (res.data.items ?? []);
		}
	}

	async function loadPosts(targetPage: number, reset: boolean = false) {
		if (reset) {
			loading = true;
			posts = [];
			page = 1;
		} else {
			loadingMore = true;
		}

		const res = await postService.getAll({
			page: targetPage,
			limit: 10,
			categoryId: selectedCategoryId ?? undefined
		});

		if (res.ok) {
			const newPosts = res.data.items ?? [];
			posts = reset ? newPosts : [...posts, ...newPosts];
			hasMore = targetPage < (res.data.meta?.totalPages ?? 1);
			page = targetPage;
		}

		loading = false;
		loadingMore = false;
	}

	function selectCategory(catId: number | null) {
		selectedCategoryId = catId;
		loadPosts(1, true);
	}

	function loadNextPage() {
		if (!loadingMore && hasMore) {
			loadPosts(page + 1, false);
		}
	}

	function triggerDelete(post: Post) {
		selectedPost = post;
		deleteDialogOpen = true;
	}

	async function confirmDelete() {
		if (!selectedPost) return;
		const result = await postService.delete(selectedPost.id);
		if (result.ok) {
			posts = posts.filter((p) => p.id !== selectedPost?.id);
			toastStore.success(result.message);
		}
		selectedPost = null;
		deleteDialogOpen = false;
	}

	function getLocalizedText(obj: any): string {
		if (!obj) return '';
		if (typeof obj === 'string') return obj;
		return obj[locale] || obj['id'] || '';
	}
</script>

<svelte:head>
	<title>{m.meta_admin_post_title()}</title>
</svelte:head>

<section class="min-h-screen px-4 py-8 sm:px-6 md:px-10 lg:px-16 xl:px-24">
	<div class="mx-auto max-w-6xl">
		<!-- Categories Filter -->
		<div class="mb-8">
			<div class="mb-3 flex items-center justify-between">
				<h2 class="text-sm font-semibold uppercase tracking-[0.25em] text-base-content/60">
					{m.admin_post_category_heading?.() || m.admin_post_category_label()}
				</h2>

			</div>

			<div
				class="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-transparent"
			>
				<button
					type="button"
					class="btn btn-sm rounded-full whitespace-nowrap {selectedCategoryId === null ? 'btn-primary' : 'btn-outline'}"
					onclick={() => selectCategory(null)}
				>
					{m.admin_post_filter_all?.() || 'Semua'}
				</button>

				{#each categories as category}
					<button
						type="button"
						class="btn btn-sm rounded-full whitespace-nowrap {selectedCategoryId === category.id ? 'btn-primary' : 'btn-outline'}"
						onclick={() => selectCategory(category.id)}
					>
						{getLocalizedText(category.name)}
					</button>
				{/each}
			</div>
		</div>

		<!-- Action Bar & Title -->
		<div class="mb-6 flex flex-wrap items-center justify-between gap-4 md:mb-8">
			<h1 class="text-lg font-semibold text-base-content md:text-xl">
				{m.admin_post_title()}
			</h1>
			<div class="flex flex-wrap items-center gap-2">
				<a href="/admin/profile" class="btn btn-outline btn-sm gap-2">
					<UserIcon size={16} />
					<span>{m.admin_post_my_profile?.() || 'Profil Saya'}</span>
				</a>
								<a href="/admin/category" class="btn btn-outline btn-sm gap-2">
					<Folder size={16} />
					<span>{m.admin_category_title()}</span>
				</a>
				<a href="/admin/post/create" class="btn btn-primary btn-sm">
					+ {m.admin_post_create_title()}
				</a>
			</div>
		</div>

		<!-- Post List -->
		{#if loading}
			<div class="space-y-3">
				{#each Array(3) as _}
					<LoadingSkeleton variant="table-row" />
				{/each}
			</div>
		{:else if posts.length === 0}
			<div class="rounded-xl border border-base-300 bg-base-100 p-8 text-center text-base-content/60">
				{m.admin_post_empty_category?.() || 'Belum ada postingan dalam kategori ini.'}
			</div>
		{:else}
			<div class="space-y-3">
				{#each posts as post, index}
					<div
						class="flex w-full items-center justify-between gap-4 rounded-xl border border-base-300 bg-base-100 p-4 transition-colors hover:bg-base-200"
					>
						<!-- Display looping index number instead of raw UUID -->
						<div class="w-8 shrink-0 text-sm font-bold text-base-content/50">
							#{index + 1}
						</div>

						<div class="min-w-0 flex-1">
							<div class="flex items-center gap-2">
								<h3 class="truncate text-base font-semibold md:text-lg">
									{getLocalizedText(post.title)}
								</h3>
								{#if post.isDraft}
									<span class="badge badge-neutral badge-sm">{m.admin_post_draft?.() || 'Draft'}</span>
								{/if}
							</div>
							<p class="mt-0.5 text-xs text-base-content/60 md:text-sm">
								{post.category ? getLocalizedText(post.category.name) : (m.admin_post_uncategorized?.() || 'Tanpa Kategori')}
							</p>
						</div>

						<div class="flex items-center gap-1 shrink-0">
							<a
								href="/post/{post.id}"
								class="btn btn-ghost btn-sm btn-square text-base-content/70 hover:text-primary"
								aria-label={m.admin_post_view()}
								target="_blank"
							>
								<Eye size={18} />
							</a>

							<a
								href="/admin/post/{post.id}/edit"
								class="btn btn-ghost btn-sm btn-square text-base-content/70 hover:text-info"
								aria-label={m.admin_post_edit()}
							>
								<Pencil size={18} />
							</a>

							<button
								type="button"
								class="btn btn-ghost btn-sm btn-square text-base-content/70 hover:text-error hover:bg-error/10"
								aria-label={m.admin_post_delete()}
								onclick={() => triggerDelete(post)}
							>
								<Trash2 size={18} />
							</button>
						</div>
					</div>
				{/each}
			</div>

			<!-- Lazy Loading / Load More -->
			{#if hasMore}
				<div class="mt-6 text-center">
					<button
						type="button"
						class="btn btn-outline btn-sm min-w-[140px]"
						disabled={loadingMore}
						onclick={loadNextPage}
					>
						{#if loadingMore}
							<span class="loading loading-spinner loading-xs"></span>
						{:else}
							{m.admin_post_load_more?.() || 'Muat Lebih Banyak'}
						{/if}
					</button>
				</div>
			{/if}
		{/if}
	</div>
</section>

<ConfirmDialog
	open={deleteDialogOpen}
	title={m.dialog_delete_post_title()}
	message={selectedPost
		? m.dialog_delete_post_message({ item: getLocalizedText(selectedPost.title) })
		: ''}
	onConfirm={confirmDelete}
	onCancel={() => (deleteDialogOpen = false)}
/>

