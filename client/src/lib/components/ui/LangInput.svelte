<script lang="ts">
	import type { Lang } from '$lib/types';
	import TiptapEditor from './TiptapEditor.svelte';
	import CharCounter from './CharCounter.svelte';

	interface Props {
		value: Record<Lang, string>;
		currentLang: Lang;
		onLangChange: (lang: Lang) => void;
		onValueChange: (lang: Lang, value: string) => void;
		placeholder?: string;
		type?: 'input' | 'textarea' | 'rich-text' | 'code';
		inputClass?: string;
		required?: boolean;
		size?: 'default' | 'sm';
		maxLength?: number;
		showCharCount?: boolean;
	}

	let {
		value,
		currentLang,
		onLangChange,
		onValueChange,
		placeholder = '',
		type = 'input',
		inputClass = '',
		required = false,
		size = 'default',
		maxLength,
		showCharCount = false
	}: Props = $props();

	const langs: Lang[] = ['id', 'en', 'ja'];
	const btnSize = $derived(size === 'sm' ? 'btn-sm' : '');
	const inputSize = $derived(size === 'sm' ? 'input-sm' : '');
	const textareaSize = $derived(size === 'sm' ? 'textarea-sm' : '');

	let currentTextLength = $derived((value[currentLang] || '').length);
</script>

<div class="flex flex-col w-full gap-1">
	<div class="join w-full {type === 'textarea' || type === 'rich-text' || type === 'code' ? 'items-start' : ''}">
		<div class="dropdown join-item">
			<div tabindex="0" role="button" class="btn btn-outline border-base-300 w-14 px-0 cursor-pointer {btnSize}">
				{currentLang.toUpperCase()}
			</div>
			<ul
				tabindex="0"
				class="dropdown-content menu bg-base-100 rounded-box z-20 w-16 p-1 shadow border border-base-300"
			>
				{#each langs as lang}
					<li>
						<button
							type="button"
							onclick={() => onLangChange(lang)}
							class="px-2 {currentLang === lang ? 'active' : ''}"
						>
							{lang.toUpperCase()}
						</button>
					</li>
				{/each}
			</ul>
		</div>

		{#if type === 'rich-text' || type === 'code'}
			<TiptapEditor
				value={value[currentLang]}
				mode={type === 'code' ? 'code' : 'rich-text'}
				onchange={(val) => onValueChange(currentLang, val)}
				inputClass="join-item w-full rounded-tl-none rounded-bl-none border-l-0 {inputClass}"
			/>
		{:else if type === 'textarea'}
			<textarea
				class="textarea textarea-bordered join-item w-full min-h-[100px] bg-base-100/50 {textareaSize} {inputClass}"
				{placeholder}
				{required}
				maxlength={maxLength}
				value={value[currentLang]}
				oninput={(e) => onValueChange(currentLang, e.currentTarget.value)}
			></textarea>
		{:else}
			<input
				type="text"
				class="input input-bordered join-item w-full bg-base-100/50 {inputSize} {inputClass}"
				{placeholder}
				{required}
				maxlength={maxLength}
				value={value[currentLang]}
				oninput={(e) => onValueChange(currentLang, e.currentTarget.value)}
			/>
		{/if}
	</div>

	{#if (showCharCount || maxLength) && maxLength}
		<div class="flex justify-end px-1">
			<CharCounter current={currentTextLength} max={maxLength} />
		</div>
	{/if}
</div>
