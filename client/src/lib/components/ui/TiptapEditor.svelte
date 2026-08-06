<script lang="ts">
	import { onMount } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import { Bold, Italic, Heading1, Heading2, Code, List, ListOrdered, Quote, Undo, Redo } from '@lucide/svelte';

	interface Props {
		value?: string;
		onchange?: (val: string) => void;
		inputClass?: string;
		/**
		 * 'rich-text' — full WYSIWYG toolbar (default)
		 * 'code'      — code-only mode: Enter = newline, no formatting, outputs plain text
		 */
		mode?: 'rich-text' | 'code';
	}

	let { value = '', onchange = () => {}, inputClass = '', mode = 'rich-text' }: Props = $props();

	let element: HTMLElement | undefined = $state();
	let editor: Editor | undefined = $state();

	/** Wrap plain-text code into a TipTap codeBlock node */
	function toCodeContent(text: string): string {
		// If it already looks like HTML from a previous save, strip tags to get plain text
		const plain = text.includes('<') ? text.replace(/<[^>]*>/g, '').trim() : text;
		// Unescape common HTML entities
		const decoded = plain
			.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>')
			.replace(/&amp;/g, '&')
			.replace(/&quot;/g, '"');
		return `<pre><code>${decoded}</code></pre>`;
	}

	/** Extract plain text from a codeBlock HTML string */
	function fromCodeContent(html: string): string {
		const match = html.match(/<code>([\s\S]*?)<\/code>/i);
		if (!match) return html.replace(/<[^>]*>/g, '');
		return match[1]
			.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>')
			.replace(/&amp;/g, '&')
			.replace(/&quot;/g, '"');
	}

	onMount(() => {
		if (!element) return;

		const initialContent = mode === 'code' ? toCodeContent(value) : value;

		editor = new Editor({
			element: element,
			extensions: [StarterKit],
			content: initialContent,
			onTransaction: () => {
				editor = editor;
			},
			onUpdate: ({ editor: e }) => {
				const html = e.getHTML();
				const emitted = mode === 'code' ? fromCodeContent(html) : html;
				if (emitted !== value) {
					onchange(emitted);
				}
			}
		});

		// For code mode, ensure cursor starts inside codeBlock
		if (mode === 'code') {
			editor.commands.focus('end');
		}

		return () => {
			editor?.destroy();
		};
	});

	$effect(() => {
		const val = value;
		if (!editor || editor.isFocused) return;

		if (mode === 'code') {
			const current = fromCodeContent(editor.getHTML());
			if (current !== val) {
				editor.commands.setContent(toCodeContent(val), false);
			}
		} else {
			if (editor.getHTML() !== val) {
				editor.commands.setContent(val, false);
			}
		}
	});
</script>

<div class="flex w-full flex-col overflow-hidden rounded-lg border border-base-300 bg-base-100/50 {inputClass}">
	{#if editor}
		{#if mode === 'code'}
			<!-- Code mode: minimal toolbar -->
			<div class="flex items-center gap-2 border-b border-base-300 bg-base-200/50 px-3 py-1.5">
				<span class="badge badge-neutral badge-sm font-mono text-xs">CODE</span>
				<span class="text-xs text-base-content/50">Enter = baris baru &nbsp;·&nbsp; Tab = indentasi</span>
				<div class="ml-auto flex gap-1">
					<button
						type="button"
						class="btn btn-ghost btn-square btn-sm"
						onclick={() => editor?.chain().focus().undo().run()}
						disabled={!editor?.can().undo()}
						title="Batal (Undo)"
					>
						<Undo size={14} />
					</button>
					<button
						type="button"
						class="btn btn-ghost btn-square btn-sm"
						onclick={() => editor?.chain().focus().redo().run()}
						disabled={!editor?.can().redo()}
						title="Ulangi (Redo)"
					>
						<Redo size={14} />
					</button>
				</div>
			</div>
		{:else}
			<!-- Rich-text mode: full toolbar -->
			<div class="flex flex-wrap gap-1 border-b border-base-300 bg-base-200/50 p-2">
				<button
					type="button"
					class="btn btn-ghost btn-square btn-sm {editor.isActive('bold') ? 'btn-active' : ''}"
					onclick={() => editor?.chain().focus().toggleBold().run()}
					title="Tebal (Bold)"
				>
					<Bold size={16} />
				</button>
				<button
					type="button"
					class="btn btn-ghost btn-square btn-sm {editor.isActive('italic') ? 'btn-active' : ''}"
					onclick={() => editor?.chain().focus().toggleItalic().run()}
					title="Miring (Italic)"
				>
					<Italic size={16} />
				</button>
				<div class="divider divider-horizontal mx-0"></div>
				<button
					type="button"
					class="btn btn-ghost btn-square btn-sm {editor.isActive('heading', { level: 1 }) ? 'btn-active' : ''}"
					onclick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
					title="Judul 1 (H1)"
				>
					<Heading1 size={16} />
				</button>
				<button
					type="button"
					class="btn btn-ghost btn-square btn-sm {editor.isActive('heading', { level: 2 }) ? 'btn-active' : ''}"
					onclick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
					title="Judul 2 (H2)"
				>
					<Heading2 size={16} />
				</button>
				<button
					type="button"
					class="btn btn-ghost btn-square btn-sm {editor.isActive('codeBlock') ? 'btn-active' : ''}"
					onclick={() => editor?.chain().focus().toggleCodeBlock().run()}
					title="Blok Kode (Code Block)"
				>
					<Code size={16} />
				</button>
				<button
					type="button"
					class="btn btn-ghost btn-square btn-sm {editor.isActive('blockquote') ? 'btn-active' : ''}"
					onclick={() => editor?.chain().focus().toggleBlockquote().run()}
					title="Kutipan (Blockquote)"
				>
					<Quote size={16} />
				</button>
				<div class="divider divider-horizontal mx-0"></div>
				<button
					type="button"
					class="btn btn-ghost btn-square btn-sm {editor.isActive('bulletList') ? 'btn-active' : ''}"
					onclick={() => editor?.chain().focus().toggleBulletList().run()}
					title="Daftar Simbol (Bullet List)"
				>
					<List size={16} />
				</button>
				<button
					type="button"
					class="btn btn-ghost btn-square btn-sm {editor.isActive('orderedList') ? 'btn-active' : ''}"
					onclick={() => editor?.chain().focus().toggleOrderedList().run()}
					title="Daftar Angka (Ordered List)"
				>
					<ListOrdered size={16} />
				</button>
				<div class="divider divider-horizontal mx-0"></div>
				<button
					type="button"
					class="btn btn-ghost btn-square btn-sm"
					onclick={() => editor?.chain().focus().undo().run()}
					disabled={!editor?.can().undo()}
					title="Batal (Undo)"
				>
					<Undo size={16} />
				</button>
				<button
					type="button"
					class="btn btn-ghost btn-square btn-sm"
					onclick={() => editor?.chain().focus().redo().run()}
					disabled={!editor?.can().redo()}
					title="Ulangi (Redo)"
				>
					<Redo size={16} />
				</button>
			</div>
		{/if}
	{/if}

	<div
		bind:this={element}
		class="prose prose-sm md:prose-base min-h-[160px] p-4 focus:outline-none max-w-none {mode === 'code' ? 'code-mode font-mono text-sm' : ''}"
	></div>
</div>

<style>
	:global(.ProseMirror) {
		min-height: 160px;
		outline: none;
	}
	:global(.ProseMirror p.is-editor-empty:first-child::before) {
		content: attr(data-placeholder);
		float: left;
		color: #adb5bd;
		pointer-events: none;
		height: 0;
	}
	/* Rich-text code block styling */
	:global(.ProseMirror pre) {
		background: #1e293b;
		color: #f8fafc;
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		margin: 0.5rem 0;
		white-space: pre;
	}
	:global(.ProseMirror code) {
		color: var(--fallback-p, oklch(var(--p) / 1));
		background: rgba(0, 0, 0, 0.06);
		padding: 0.15rem 0.35rem;
		border-radius: 0.25rem;
		font-size: 0.875em;
	}
	:global(.ProseMirror pre code) {
		color: inherit;
		background: transparent;
		padding: 0;
		font-size: inherit;
	}
	/* Code mode — full-area dark code editor look */
	:global(.code-mode) {
		background: #0f172a;
		color: #e2e8f0;
		border-radius: 0;
		padding: 1rem;
	}
	:global(.code-mode .ProseMirror) {
		background: #0f172a;
		color: #e2e8f0;
		white-space: pre;
		tab-size: 2;
	}
	:global(.code-mode .ProseMirror pre) {
		background: transparent;
		padding: 0;
		margin: 0;
		border-radius: 0;
	}
	:global(.code-mode .ProseMirror pre code) {
		color: #e2e8f0;
		background: transparent;
		font-size: 0.875rem;
		line-height: 1.7;
	}
</style>
