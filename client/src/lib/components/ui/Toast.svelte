<script lang="ts">
	import { toastStore } from '$lib/stores/toast.svelte.js';
	import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from '@lucide/svelte';
	import type { ToastType } from '$lib/stores/toast.svelte.js';

	const iconMap: Record<ToastType, typeof CheckCircle> = {
		success: CheckCircle,
		error: AlertCircle,
		warning: AlertTriangle,
		info: Info
	};

	const alertClassMap: Record<ToastType, string> = {
		success: 'alert-success',
		error: 'alert-error',
		warning: 'alert-warning',
		info: 'alert-info'
	};
</script>

{#if toastStore.toasts.length > 0}
	<div class="toast toast-end toast-top z-[100] mt-16">
		{#each toastStore.toasts as toast (toast.id)}
			{@const Icon = iconMap[toast.type]}
			<div class="alert {alertClassMap[toast.type]} shadow-lg animate-slide-in min-w-72 max-w-sm">
				<Icon class="h-5 w-5 shrink-0" />
				<span class="text-sm">{toast.message}</span>
				<button
					class="btn btn-ghost btn-xs btn-square"
					onclick={() => toastStore.remove(toast.id)}
				>
					<X class="h-3.5 w-3.5" />
				</button>
			</div>
		{/each}
	</div>
{/if}

<style>
	@keyframes slide-in {
		from { transform: translateX(100%); opacity: 0; }
		to { transform: translateX(0); opacity: 1; }
	}
	:global(.animate-slide-in) {
		animation: slide-in 0.3s ease-out;
	}
</style>
