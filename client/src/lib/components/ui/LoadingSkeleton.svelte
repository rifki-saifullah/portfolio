<script lang="ts">
	/**
	 * Loading skeleton component using DaisyUI's skeleton class.
	 * Renders placeholder shapes that match the content being loaded.
	 */

	interface Props {
		variant?: 'text' | 'card' | 'table-row' | 'form-field' | 'avatar';
		lines?: number;
		width?: string;
		height?: string;
		class?: string;
	}

	let {
		variant = 'text',
		lines = 3,
		width = 'w-full',
		height = '',
		class: className = ''
	}: Props = $props();
</script>

{#if variant === 'text'}
	<div class="space-y-3 {width} {className}">
		{#each Array(lines) as _, i}
			<div
				class="skeleton h-4 {i === lines - 1 ? 'w-3/4' : 'w-full'}"
			></div>
		{/each}
	</div>
{:else if variant === 'card'}
	<div class="rounded-2xl border border-base-300 p-4 {width} {className}">
		<div class="skeleton h-40 w-full rounded-xl mb-4"></div>
		<div class="skeleton h-5 w-3/4 mb-2"></div>
		<div class="skeleton h-4 w-full mb-1"></div>
		<div class="skeleton h-4 w-2/3"></div>
	</div>
{:else if variant === 'table-row'}
	<div class="flex items-center gap-4 rounded-2xl border border-base-300 p-4 {width} {className}">
		<div class="skeleton h-5 w-5 shrink-0 rounded"></div>
		<div class="flex-1 space-y-2">
			<div class="skeleton h-4 w-3/4"></div>
			<div class="skeleton h-3 w-1/2"></div>
		</div>
		<div class="flex gap-1">
			<div class="skeleton h-8 w-8 rounded-lg"></div>
			<div class="skeleton h-8 w-8 rounded-lg"></div>
		</div>
	</div>
{:else if variant === 'form-field'}
	<div class="space-y-2 {width} {className}">
		<div class="skeleton h-3 w-24"></div>
		<div class="skeleton h-10 w-full rounded-lg"></div>
	</div>
{:else if variant === 'avatar'}
	<div class="flex items-center gap-3 {className}">
		<div class="skeleton h-12 w-12 rounded-full shrink-0"></div>
		<div class="space-y-2 flex-1">
			<div class="skeleton h-4 w-32"></div>
			<div class="skeleton h-3 w-24"></div>
		</div>
	</div>
{/if}
