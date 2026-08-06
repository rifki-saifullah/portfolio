<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { getLocale } from '$lib/paraglide/runtime';
	import { Pencil, Trash2, Plus, Search, Layers } from '@lucide/svelte';
	import { categoryService } from '$lib/services/category.service';
	import { categorySchema } from '$lib/validators/category';
	import LangInput from '$lib/components/ui/LangInput.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';
	import LoadingSkeleton from '$lib/components/ui/LoadingSkeleton.svelte';
	import { toastStore } from '$lib/stores/toast.svelte.js';
	import type { Category, Lang } from '$lib/types';
	import { onMount } from 'svelte';
	import { z } from 'zod';

	let categories = $state<Category[]>([]);
	let loading = $state(true);
	let currentPage = $state(1);
	let totalPages = $state(1);
	let totalItems = $state(0);
	const perPage = 10;

	// Realtime search
	let searchQuery = $state('');

	const locale = $derived(getLocale() as 'id' | 'en' | 'ja');

	// Create form
	let newName = $state({ id: '', en: '', ja: '' });
	let newLang = $state<Lang>('id');
	let createErrors = $state<Record<string, string>>({});

	// Sync initial input lang with active site locale
	$effect(() => {
		newLang = locale;
	});

	// Edit form
	let editingId = $state<number | null>(null);
	let editName = $state({ id: '', en: '', ja: '' });
	let editLang = $state<Lang>('id');
	let editErrors = $state<Record<string, string>>({});

	// Delete dialog
	let deleteId = $state<number | null>(null);
	let deleteDialogOpen = $state(false);

	// Filter categories real-time by search query matching ID, EN, or JA
	let filteredCategories = $derived(
		categories.filter((cat) => {
			if (!searchQuery.trim()) return true;
			const q = searchQuery.trim().toLowerCase();
			const nameId = cat.name?.id?.toLowerCase() || '';
			const nameEn = cat.name?.en?.toLowerCase() || '';
			const nameJa = cat.name?.ja?.toLowerCase() || '';
			return nameId.includes(q) || nameEn.includes(q) || nameJa.includes(q);
		})
	);

	onMount(async () => {
		await loadCategories(currentPage);
	});

	async function loadCategories(page = 1) {
		loading = true;
		const result = await categoryService.getAll(page, perPage);
		if (result.ok) {
			categories = result.data.items;
			currentPage = result.data.meta.currentPage;
			totalPages = result.data.meta.totalPages;
			totalItems = result.data.meta.totalItems;
		}
		loading = false;
	}

	function validateCreateRealtime(data = newName): boolean {
		try {
			categorySchema().parse({ name: data });
			createErrors = {};
			return true;
		} catch (err) {
			if (err instanceof z.ZodError) {
				const errs: Record<string, string> = {};
				err.issues.forEach((issue) => {
					errs[issue.path.join('.')] = issue.message;
				});
				createErrors = errs;
			}
			return false;
		}
	}

	function validateEditRealtime(data = editName): boolean {
		try {
			categorySchema().parse({ name: data });
			editErrors = {};
			return true;
		} catch (err) {
			if (err instanceof z.ZodError) {
				const errs: Record<string, string> = {};
				err.issues.forEach((issue) => {
					errs[issue.path.join('.')] = issue.message;
				});
				editErrors = errs;
			}
			return false;
		}
	}

	async function addCategory() {
		if (!validateCreateRealtime()) return;

		const result = await categoryService.create({ ...newName });
		if (result.ok) {
			newName = { id: '', en: '', ja: '' };
			createErrors = {};
			toastStore.success(result.message);
			await loadCategories(currentPage);
		} else {
			toastStore.error(result.error?.message || m.admin_category_add_failed?.() || 'Gagal menambahkan kategori');
		}
	}

	function startEdit(cat: Category) {
		editingId = cat.id;
		editName = { ...cat.name };
		editLang = locale;
		editErrors = {};
	}

	async function saveEdit() {
		if (!validateEditRealtime() || editingId === null) return;

		const result = await categoryService.update(editingId, { ...editName });
		if (result.ok) {
			const index = categories.findIndex((c) => c.id === editingId);
			if (index !== -1) categories[index] = { ...categories[index], ...result.data };
			toastStore.success(result.message);
			cancelEdit();
		} else {
			toastStore.error(result.error?.message || m.admin_category_update_failed?.() || 'Gagal memperbarui kategori');
		}
	}

	function cancelEdit() {
		editingId = null;
		editName = { id: '', en: '', ja: '' };
		editErrors = {};
	}

	function openDelete(id: number) {
		deleteId = id;
		deleteDialogOpen = true;
	}

	async function confirmDelete() {
		if (deleteId === null) return;

		const result = await categoryService.delete(deleteId);
		if (result.ok) {
			toastStore.success(result.message || 'Kategori berhasil dihapus.');
			await loadCategories(currentPage);
		} else {
			if (result.error?.code === 'CATEGORY_HAS_POSTS' || result.error?.message?.includes('post')) {
				toastStore.error(
					m.admin_category_cannot_delete_has_posts?.() ||
						'Kategori tidak dapat dihapus karena masih digunakan oleh postingan.'
				);
			} else {
				toastStore.error(result.error?.message || m.admin_category_delete_failed?.() || 'Gagal menghapus kategori.');
			}
		}
		deleteId = null;
		deleteDialogOpen = false;
	}

	function handlePageChange(p: number) {
		currentPage = p;
		loadCategories(p);
	}
</script>

<svelte:head>
	<title>{m.meta_admin_category_title()}</title>
</svelte:head>

<div class="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-3xl space-y-6">
		<!-- Card -->
		<div class="rounded-3xl border border-base-300 bg-base-100 shadow-sm overflow-hidden">
			<!-- Header with Total Info -->
			<div class="border-b border-base-300 p-5 sm:p-6 bg-base-100">
				<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div class="space-y-1">
						<div class="flex items-center gap-3">
							<h1 class="text-xl font-bold text-base-content">{m.admin_category_title()}</h1>
							<span class="badge badge-primary font-semibold gap-1.5 px-3 py-2">
								<Layers class="w-3.5 h-3.5" />
								{m.admin_category_total_count?.({ count: totalItems.toString() }) || `Total ${totalItems} Kategori`}
							</span>
						</div>
						<p class="text-sm text-base-content/60">{m.admin_category_subtitle()}</p>
					</div>

					<!-- Search Bar Realtime -->
					<div class="relative w-full sm:w-64">
						<Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/40" />
						<input
							type="text"
							bind:value={searchQuery}
							placeholder={m.admin_category_search_placeholder?.() || 'Cari kategori (ID/EN/JA)...'}
							class="input input-sm input-bordered pl-9 w-full rounded-xl bg-base-200/50 focus:bg-base-100 transition-colors"
						/>
					</div>
				</div>
			</div>

			<!-- Add Category Form -->
			<div class="border-b border-base-300 p-5 sm:p-6 bg-base-200/30">
				<div class="flex flex-col gap-2 w-full">
					<div class="flex gap-2 w-full items-start">
						<LangInput
							value={newName}
							currentLang={newLang}
							onLangChange={(lang) => (newLang = lang)}
							onValueChange={(lang, val) => {
								newName = { ...newName, [lang]: val };
								validateCreateRealtime(newName);
							}}
							placeholder={m.admin_category_add_placeholder()}
							maxLength={50}
							showCharCount={true}
						/>

						<button class="btn btn-primary" onclick={addCategory}>
							<Plus class="h-4 w-4" />
							<span class="hidden sm:inline">{m.admin_category_add_button()}</span>
						</button>
					</div>
					{#if createErrors['name.' + newLang] || createErrors['name.id']}
						<p class="text-xs text-error font-medium">
							{createErrors['name.' + newLang] || createErrors['name.id']}
						</p>
					{/if}
				</div>
			</div>

			<!-- Category List -->
			<div class="p-5 sm:p-6">
				{#if loading}
					<div class="space-y-3">
						{#each Array(3) as _}
							<LoadingSkeleton variant="table-row" />
						{/each}
					</div>
				{:else if filteredCategories.length === 0}
					<EmptyState
						title={searchQuery
							? (m.admin_category_not_found_title?.() || 'Kategori Tidak Ditemukan')
							: m.admin_category_empty_title()}
						description={searchQuery
							? (m.admin_category_not_found_description?.({ query: searchQuery }) ||
									`Tidak ada kategori yang cocok dengan "${searchQuery}".`)
							: m.admin_category_empty_description()}
					/>
				{:else}
					<div class="space-y-3">
						{#each filteredCategories as cat, i (cat.id)}
							{@const itemIndex = (currentPage - 1) * perPage + i + 1}
							<div
								class="rounded-2xl border border-base-300 p-4 transition hover:border-primary/50 hover:bg-base-200/30"
							>
								{#if editingId === cat.id}
									<div class="flex flex-col gap-3 w-full">
										<div class="flex flex-col gap-3 sm:flex-row w-full items-start">
											<LangInput
												value={editName}
												currentLang={editLang}
												onLangChange={(lang) => (editLang = lang)}
												onValueChange={(lang, val) => {
													editName = { ...editName, [lang]: val };
													validateEditRealtime(editName);
												}}
												size="sm"
												maxLength={50}
												showCharCount={true}
											/>

											<div class="flex gap-2 shrink-0">
												<button class="btn btn-primary btn-sm flex-1 sm:flex-none" onclick={saveEdit}>
													{m.admin_category_save()}
												</button>
												<button class="btn btn-ghost btn-sm flex-1 sm:flex-none" onclick={cancelEdit}>
													{m.admin_category_cancel()}
												</button>
											</div>
										</div>
										{#if editErrors['name.' + editLang] || editErrors['name.id']}
											<p class="text-xs text-error font-medium">
												{editErrors['name.' + editLang] || editErrors['name.id']}
											</p>
										{/if}
									</div>
								{:else}
									<div class="flex items-center justify-between gap-4">
										<div class="flex min-w-0 items-center gap-3">
											<!-- Loop Number -->
											<span class="w-6 text-center font-mono text-base-content text-sm">#{itemIndex}</span>

											<!-- Category Name -->
											<p class="truncate font-semibold text-base-content">
												{cat.name[locale] || cat.name.id || cat.name.en || ''}
											</p>

											<!-- Post Count Badge -->
											<span class="badge badge-ghost badge-sm shrink-0 font-medium text-base-content/70">
												{m.admin_category_post_unit?.({ count: (cat._count?.posts ?? 0).toString() }) ||
													`${cat._count?.posts ?? 0} post`}
											</span>
										</div>

										<!-- Actions -->
										<div class="flex gap-1">
											<button
												class="btn btn-ghost btn-sm btn-square"
												title={m.admin_post_edit()}
												onclick={() => startEdit(cat)}
											>
												<Pencil class="h-4 w-4" />
											</button>

											<button
												class="btn btn-ghost btn-sm btn-square text-error"
												title={m.admin_post_delete()}
												onclick={() => openDelete(cat.id)}
											>
												<Trash2 class="h-4 w-4" />
											</button>
										</div>
									</div>
								{/if}
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>

		<Pagination {currentPage} {totalPages} onPageChange={handlePageChange} />
	</div>
</div>

<ConfirmDialog
	open={deleteDialogOpen}
	title={m.dialog_delete_title()}
	message={m.dialog_delete_category_message()}
	onConfirm={confirmDelete}
	onCancel={() => (deleteDialogOpen = false)}
/>
