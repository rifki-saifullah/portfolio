<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import LangInput from '$lib/components/ui/LangInput.svelte';
	import FormField from '$lib/components/ui/FormField.svelte';
	import CharCounter from '$lib/components/ui/CharCounter.svelte';
	import { postService } from '$lib/services/post.service';
	import { categoryService } from '$lib/services/category.service';
	import { userService } from '$lib/services/profile.service';
	import { postSchema } from '$lib/validators/post';
	import { toastStore } from '$lib/stores/toast.svelte.js';
	import { goto } from '$app/navigation';
	import type { Lang, ContentBlock, Category } from '$lib/types';
	import { z } from 'zod';
	import { onMount } from 'svelte';
	import { getLocale } from '$lib/paraglide/runtime';
	import { getImageUrl } from '$lib/utils/format';
	import { ChevronUp, ChevronDown } from '@lucide/svelte';

	let categories = $state<Category[]>([]);
	let selectedCategoryId = $state<number | null>(null);
	let isDraft = $state(false);

	let title = $state({ id: '', en: '', ja: '' });
	let titleLang = $state<Lang>('id');

	let youtubeId = $state('');
	let loading = $state(false);
	let uploadingImage = $state(false);
	let touched = $state(false);
	let errors = $state<Record<string, string>>({});

	const locale = $derived(getLocale() as 'id' | 'en' | 'ja');

	// Sync initial input lang with active site locale
	$effect(() => {
		titleLang = locale;
	});

	onMount(async () => {
		const res = await categoryService.getAll();
		if (res.ok) {
			categories = Array.isArray(res.data) ? res.data : (res.data.items ?? []);
			if (categories.length > 0) {
				selectedCategoryId = categories[0].id;
			}
		}
	});

	let blocks = $state<(ContentBlock & { lang: Lang })[]>([
		{ id: crypto.randomUUID(), type: 'rich-text', value: { id: '', en: '', ja: '' }, lang: 'id' }
	]);

	function validateRealtime(
		t = title,
		catId = selectedCategoryId,
		d = isDraft,
		yId = youtubeId,
		blks = blocks
	): boolean {
		if (!catId) {
			errors = { categoryId: m.admin_post_category_required?.() || 'Kategori wajib dipilih.' };
			return false;
		}
		try {
			postSchema().parse({
				title: t,
				categoryId: catId,
				isDraft: d,
				youtubeId: yId,
				contentBlocks: blks.map((b) => ({ id: b.id, type: b.type, value: b.value }))
			});
			errors = {};
			return true;
		} catch (err) {
			if (err instanceof z.ZodError) {
				const errs: Record<string, string> = {};
				err.issues.forEach((issue) => {
					errs[issue.path.join('.')] = issue.message;
				});
				errors = errs;
			}
			return false;
		}
	}

	// Automatic reactive validation when any field changes after user interaction
	$effect(() => {
		const t = title;
		const catId = selectedCategoryId;
		const d = isDraft;
		const yId = youtubeId;
		const blks = blocks;

		if (touched) {
			validateRealtime(t, catId, d, yId, blks);
		}
	});

	function addBlock(type: 'paragraph' | 'code' | 'rich-text' | 'image') {
		touched = true;
		blocks = [
			...blocks,
			{ id: crypto.randomUUID(), type, value: { id: '', en: '', ja: '' }, lang: locale }
		];
		validateRealtime();
	}

	function moveUp(index: number) {
		if (index > 0) {
			touched = true;
			const newBlocks = [...blocks];
			const temp = newBlocks[index];
			newBlocks[index] = newBlocks[index - 1];
			newBlocks[index - 1] = temp;
			blocks = newBlocks;
			validateRealtime();
		}
	}

	function moveDown(index: number) {
		if (index < blocks.length - 1) {
			touched = true;
			const newBlocks = [...blocks];
			const temp = newBlocks[index];
			newBlocks[index] = newBlocks[index + 1];
			newBlocks[index + 1] = temp;
			blocks = newBlocks;
			validateRealtime();
		}
	}

	async function removeBlock(index: number) {
		const block = blocks[index];
		if (block.type === 'image') {
			const url = block.value.id || block.value['id'];
			if (url) {
				await userService.deleteFile(url);
			}
		}
		if (blocks.length > 1) {
			touched = true;
			blocks = blocks.filter((_, i) => i !== index);
			validateRealtime();
		}
	}

	async function handleImageUpload(event: Event, index: number) {
		const input = event.target as HTMLInputElement;
		if (!input.files || input.files.length === 0) return;

		const file = input.files[0];
		uploadingImage = true;
		const res = await userService.uploadImage(file);
		uploadingImage = false;

		if (res.ok) {
			touched = true;
			blocks[index].value = { id: res.data.url, en: res.data.url, ja: res.data.url };
			toastStore.success('Gambar berhasil diunggah.');
			validateRealtime();
		} else {
			toastStore.error('Gagal mengunggah gambar.');
		}
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();
		touched = true;
		if (!validateRealtime()) return;
		if (!selectedCategoryId) return;

		loading = true;
		const result = await postService.create({
			title,
			categoryId: selectedCategoryId,
			isDraft,
			youtubeId,
			contentBlocks: blocks.map((b) => ({ id: b.id, type: b.type, value: b.value }))
		} as any);
		loading = false;

		if (result.ok) {
			toastStore.success(result.message);
			goto('/admin/post');
		} else {
			toastStore.error(result.error?.message || 'Gagal menyimpan postingan.');
		}
	}

	function getLocalizedCategoryName(cat: Category): string {
		const name = cat.name as any;
		return name[locale] || name['id'] || '';
	}
</script>

<svelte:head>
	<title>{m.meta_admin_post_create_title()}</title>
</svelte:head>

<div
	class="w-full min-h-screen text-base-content px-6 py-8 flex justify-center selection:bg-primary selection:text-primary-content"
>
	<div class="w-full max-w-3xl mx-auto font-sans">
		<header class="mb-10 text-center sm:text-left">
			<h1 class="text-3xl font-serif font-bold text-primary mb-2">{m.admin_post_create_title()}</h1>
			<p class="text-sm text-base-content/70">{m.admin_post_create_subtitle()}</p>
		</header>

		<form
			onsubmit={handleSubmit}
			class="space-y-6 bg-base-100 p-6 sm:p-8 rounded-2xl border border-base-300 shadow-sm"
		>
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<!-- Category Dropdown -->
				<FormField label={m.admin_post_category_label()} error={errors['categoryId']}>
					<select
						bind:value={selectedCategoryId}
						onchange={() => {
							touched = true;
							validateRealtime();
						}}
						class="select select-bordered w-full bg-base-100/50 cursor-pointer"
					>
						{#each categories as cat}
							<option value={cat.id}>{getLocalizedCategoryName(cat)}</option>
						{/each}
					</select>
				</FormField>

				<!-- Draft Switch -->
				<div class="flex items-center justify-between sm:justify-start sm:gap-4 pt-6">
					<span class="text-sm font-semibold">{m.admin_post_save_draft?.() || 'Simpan sebagai Draft'}</span>
					<input
						type="checkbox"
						class="toggle toggle-primary cursor-pointer"
						bind:checked={isDraft}
						onchange={() => {
							touched = true;
							validateRealtime();
						}}
					/>
				</div>
			</div>

			<!-- Title -->
			<div class="space-y-1">
				<FormField label={m.admin_post_title_label()} id="title" error={errors['title.' + titleLang] || errors['title.id'] || errors['title']}>
					<LangInput
						value={title}
						currentLang={titleLang}
						onLangChange={(lang) => (titleLang = lang)}
						onValueChange={(lang, val) => {
							title = { ...title, [lang]: val };
							touched = true;
							validateRealtime(title);
						}}
						placeholder={m.admin_post_title_placeholder()}
						inputClass="font-serif text-lg"
						maxLength={150}
						showCharCount={true}
					/>
				</FormField>
			</div>

			<!-- Content Blocks -->
			<div class="space-y-4">
				<div class="flex items-center justify-between">
					<label class="label font-semibold text-xs tracking-wider uppercase text-base-content/70 pb-0">
						<span>{m.admin_post_content_label()}</span>
					</label>
					<div class="flex gap-2">
						<button type="button" class="btn btn-xs btn-outline" onclick={() => addBlock('rich-text')}>
							{m.admin_post_add_text?.() || '+ Teks'}
						</button>
						<button type="button" class="btn btn-xs btn-outline" onclick={() => addBlock('code')}>
							{m.admin_post_add_code_btn?.() || '+ Kode'}
						</button>
						<button type="button" class="btn btn-xs btn-outline" onclick={() => addBlock('image')}>
							{m.admin_post_add_image_btn?.() || '+ Gambar'}
						</button>
					</div>
				</div>

				{#each blocks as block, i (block.id)}
					<div class="flex flex-col gap-3 rounded-xl border border-base-200 bg-base-200/30 p-4 transition-all relative">
						<div class="flex justify-between items-center text-xs text-base-content/60 border-b border-base-300 pb-2">
							<span class="font-bold uppercase tracking-wider">
								{m.admin_post_block_number?.({ number: (i + 1).toString(), type: block.type }) ||
									`Blok #${i + 1} (${block.type})`}
							</span>
							<div class="flex items-center gap-1">
								<button
									type="button"
									class="btn btn-ghost btn-xs p-1 h-7 min-h-0"
									title={m.move_up?.() || 'Naik'}
									disabled={i === 0}
									onclick={() => moveUp(i)}
								>
									<ChevronUp size={16} />
								</button>
								<button
									type="button"
									class="btn btn-ghost btn-xs p-1 h-7 min-h-0"
									title={m.move_down?.() || 'Turun'}
									disabled={i === blocks.length - 1}
									onclick={() => moveDown(i)}
								>
									<ChevronDown size={16} />
								</button>
								{#if blocks.length > 1}
									<button type="button" class="btn btn-ghost btn-xs text-error ml-1" onclick={() => removeBlock(i)}>
										{m.admin_post_delete_block()}
									</button>
								{/if}
							</div>
						</div>

						{#if block.type === 'image'}
							<div class="space-y-2">
								<input
									type="file"
									accept="image/*"
									class="file-input file-input-bordered file-input-sm w-full"
									onchange={(e) => handleImageUpload(e, i)}
								/>
								{#if block.value.id || block.value['id']}
									<div class="max-w-xs aspect-video rounded-lg overflow-hidden border border-base-300">
										<img src={getImageUrl(block.value.id || block.value['id'])} alt="Uploaded block" class="w-full h-full object-cover" />
									</div>
								{/if}
							</div>
						{:else}
							<LangInput
								value={block.value}
								currentLang={block.lang}
								onLangChange={(lang) => (block.lang = lang)}
								onValueChange={(lang, val) => {
									block.value = { ...block.value, [lang]: val };
									touched = true;
									validateRealtime();
								}}
								type={block.type === 'code' ? 'code' : 'rich-text'}
								maxLength={10000}
								showCharCount={true}
							/>
							{#if errors[`contentBlocks.${i}.value.${block.lang}`] || errors[`contentBlocks.${i}.value.id`]}
								<p class="text-xs text-error font-medium mt-1">
									{errors[`contentBlocks.${i}.value.${block.lang}`] || errors[`contentBlocks.${i}.value.id`]}
								</p>
							{/if}
						{/if}
					</div>
				{/each}
			</div>

			<!-- YouTube -->
			<FormField label={m.admin_post_youtube_label()} id="youtubeId" error={errors['youtubeId']}>
				<div class="space-y-1">
					<div class="join w-full">
						<span class="btn join-item bg-base-300 pointer-events-none text-xs hidden sm:inline-flex">v=</span>
						<input
							id="youtubeId"
							type="text"
							maxLength={20}
							placeholder={m.admin_post_youtube_placeholder()}
							bind:value={youtubeId}
							oninput={() => {
								touched = true;
								validateRealtime();
							}}
							class="input input-bordered join-item w-full bg-base-100/50 text-sm font-mono"
						/>
					</div>
					<div class="flex justify-end">
						<CharCounter current={youtubeId.length} max={20} />
					</div>
				</div>
			</FormField>

			{#if youtubeId.trim()}
				<div class="p-4 rounded-xl border border-dashed border-base-300 bg-base-200/50 space-y-2">
					<span class="text-xs font-mono font-bold text-error block">{m.admin_post_youtube_preview()}</span>
					<div class="max-w-xs aspect-[16/9] rounded-lg overflow-hidden bg-neutral relative shadow-sm">
						<img
							src="https://img.youtube.com/vi/{youtubeId}/mqdefault.jpg"
							alt="Preview Thumbnail"
							class="w-full h-full object-cover"
						/>
					</div>
				</div>
			{/if}

			<div class="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-base-200">
				<button type="button" class="btn btn-ghost text-base-content/70" onclick={() => history.back()}>
					{m.admin_post_cancel()}
				</button>
				<button type="submit" class="btn btn-primary px-8" disabled={loading || uploadingImage}>
					{#if loading || uploadingImage}
						<span class="loading loading-spinner loading-sm"></span>
					{/if}
					{m.admin_post_submit()}
				</button>
			</div>
		</form>
	</div>
</div>
