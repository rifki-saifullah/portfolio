<script lang="ts">
	import type { Component } from 'svelte';
	import { Folder } from '@lucide/svelte';

	interface Props {
		title: string;
		description?: string;
		icon?: Component<{ class?: string }>;
	}

	let { title, description = '', icon: Icon = Folder }: Props = $props();
</script>

<div class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-base-300 py-12">
	<Icon class="mb-3 h-12 w-12 text-base-content/30" />
	<h3 class="font-semibold text-base-content">{title}</h3>
	{#if description}
		<p class="mt-1 text-center text-sm text-base-content/60">{description}</p>
	{/if}
</div>
