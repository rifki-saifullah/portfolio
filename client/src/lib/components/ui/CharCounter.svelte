<script lang="ts">
	interface Props {
		current: number;
		max: number;
		class?: string;
	}

	let { current = 0, max = 50, class: className = '' }: Props = $props();

	let isWarning = $derived(current >= max * 0.8 && current < max);
	let isError = $derived(current >= max);
</script>

<span
	class="text-[11px] font-mono transition-colors {className} {isError
		? 'text-error font-bold'
		: isWarning
			? 'text-warning font-semibold'
			: 'text-base-content/50'}"
>
	{current}/{max}
</span>
