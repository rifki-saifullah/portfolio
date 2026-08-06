<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { postService } from '$lib/services/post.service';
	import { categoryService } from '$lib/services/category.service';
	import LoadingSkeleton from '$lib/components/ui/LoadingSkeleton.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import BookPicture from '$lib/assets/book.png';
	import type { Post, Category } from '$lib/types';
	import { onMount } from 'svelte';
	import { getLocale } from '$lib/paraglide/runtime';
	import { ChevronRight } from '@lucide/svelte';

	let posts = $state<Post[]>([]);
	let categories = $state<Category[]>([]);
	let selectedCategoryId = $state<number | null>(null);
	let loading = $state(true);
	let currentPage = $state(1);
	let totalPages = $state(1);
	const limit = 10;

	const locale = $derived(getLocale() as 'id' | 'en' | 'ja');

	function getCategoryName(cat: Category): string {
		if (typeof cat.name === 'string') return cat.name;
		return cat.name[locale] || cat.name.id || '';
	}

	async function loadPosts() {
		loading = true;
		const params: { page: number; limit: number; categoryId?: number } = {
			page: currentPage,
			limit
		};
		if (selectedCategoryId !== null) {
			params.categoryId = selectedCategoryId;
		}

		const result = await postService.getAll(params);
		if (result.ok) {
			posts = result.data.items;
			totalPages = result.data.meta.totalPages;
		} else {
			posts = [];
			totalPages = 1;
		}
		loading = false;
	}

	function selectCategory(id: number | null) {
		if (selectedCategoryId === id) return;
		selectedCategoryId = id;
		currentPage = 1;
		loadPosts();
	}

	function handlePageChange(page: number) {
		currentPage = page;
		loadPosts();
	}

	onMount(async () => {
		const [catResult, postResult] = await Promise.all([
			categoryService.getAll(),
			postService.getAll({ page: 1, limit })
		]);

		if (catResult.ok) {
			categories = catResult.data.items;
		}
		if (postResult.ok) {
			posts = postResult.data.items;
			totalPages = resultHeadingMeta(postResult.data.meta.totalPages);
		}
		loading = false;
	});

	function resultHeadingMeta(pages: number) {
		return pages || 1;
	}

	const selectedCategoryObj = $derived(categories.find((c) => c.id === selectedCategoryId));
</script>

<svelte:head>
	<title>{m.meta_post_list_title()}</title>
</svelte:head>

<section class="min-h-screen pb-16 px-4 sm:px-6 lg:px-8 xl:px-24">
	<div class="mx-auto max-w-6xl">
		<!-- Category Tabs -->
		<div class="my-6 md:mb-8">
			<div
				class="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-primary/40 scrollbar-track-transparent"
			>
				<button
					onclick={() => selectCategory(null)}
					class="btn btn-xs whitespace-nowrap rounded-full transition-all sm:btn-sm {selectedCategoryId ===
					null
						? 'btn-primary'
						: 'btn-outline border-base-300 hover:border-primary hover:bg-primary hover:text-primary-content'}"
				>
					Semua
				</button>
				{#each categories as category (category.id)}
					<button
						onclick={() => selectCategory(category.id)}
						class="btn btn-xs whitespace-nowrap rounded-full transition-all sm:btn-sm {selectedCategoryId ===
						category.id
							? 'btn-primary'
							: 'btn-outline border-base-300 hover:border-primary hover:bg-primary hover:text-primary-content'}"
					>
						{getCategoryName(category)}
					</button>
				{/each}
			</div>
		</div>

		<h1 class="mb-6 text-xl font-bold text-base-content sm:text-2xl lg:text-3xl">
			{selectedCategoryId === null
				? 'Semua Postingan'
				: selectedCategoryObj
					? getCategoryName(selectedCategoryObj)
					: m.list_post_category()}
		</h1>

		<div class="grid gap-6 lg:grid-cols-[240px_1fr] lg:gap-8">
			<!-- Book Cover -->
			<div class="mx-auto w-full max-w-[170px] sm:max-w-[200px] lg:mx-0 lg:max-w-[240px]">
				<div
					class="rounded-2xl border border-base-300 bg-base-200/40 p-2 shadow-lg backdrop-blur md:p-3"
				>
					<figure class="overflow-hidden rounded-xl">
						<div class="relative">
							<img
								src={BookPicture}
								alt="Book Cover"
								class="aspect-[2/3] w-full object-cover transition-transform duration-500 hover:scale-105"
							/>
							<div
								class="absolute inset-0 bg-gradient-to-t from-neutral/70 via-transparent to-transparent"
							></div>
						</div>
					</figure>
				</div>
			</div>

			<!-- Chapters / Posts -->
			<div>
				<div class="mb-4 flex items-center justify-between">
					<h2 class="mt-1 text-lg font-bold text-base-content sm:text-xl lg:text-2xl">
						{m.list_post_list()}
					</h2>
				</div>

				{#if loading}
					<div class="space-y-3">
						{#each Array(5) as _}
							<LoadingSkeleton variant="table-row" />
						{/each}
					</div>
				{:else if posts.length === 0}
					<div
						class="rounded-xl border border-base-300 bg-base-100 p-8 text-center text-base-content/60"
					>
						Belum ada postingan untuk kategori ini.
					</div>
				{:else}
					<div class="space-y-3">
						{#each posts as post, i}
							<a
								href="/post/{post.id}"
								class="group flex items-center gap-3 rounded-xl border border-base-300 bg-base-100 p-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary/5 hover:shadow-md sm:gap-4 sm:p-4 md:rounded-2xl md:p-5"
							>
								<div
									class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-content sm:h-12 sm:w-12 md:h-14 md:w-14"
								>
									{(currentPage - 1) * limit + i + 1}
								</div>

								<div class="min-w-0 flex-1">
									<h3
										class="truncate text-sm font-semibold transition-colors group-hover:text-primary sm:text-base md:text-lg"
									>
										{post.title[locale] || post.title['id'] || ''}
									</h3>

									{#if post.createdAt}
										<p class="mt-1 text-xs text-base-content/60 sm:text-sm">
											{new Date(post.createdAt).toLocaleDateString(locale, {
												year: 'numeric',
												month: 'long',
												day: 'numeric'
											})}
										</p>
									{/if}
								</div>

								<ChevronRight
									class="h-4 w-4 shrink-0 text-base-content/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary sm:h-5 sm:w-5"
								/>
							</a>
						{/each}
					</div>

					<Pagination {currentPage} {totalPages} onPageChange={handlePageChange} />
				{/if}
			</div>
		</div>
	</div>
</section>
