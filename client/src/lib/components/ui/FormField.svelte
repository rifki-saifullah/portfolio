<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		label: string;
		error?: string;
		id?: string;
		children: Snippet;
	}

	let { label, error = '', id = '', children }: Props = $props();
</script>

<div class="form-control w-full">
	<label class="label font-semibold text-xs tracking-wider uppercase text-base-content/70" for={id}>
		<span>{label}</span>
	</label>

	{@render children()}

	{#if error}
		<label class="label" for={id}>
			<span class="label-text-alt text-error">{error}</span>
		</label>
	{/if}
</div>
