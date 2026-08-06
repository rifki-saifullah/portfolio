<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { Trash2 } from '@lucide/svelte';

	interface Props {
		open: boolean;
		title: string;
		message: string;
		onConfirm: () => void;
		onCancel: () => void;
	}

	let { open, title, message, onConfirm, onCancel }: Props = $props();

	let dialogEl: HTMLDialogElement;

	$effect(() => {
		if (!dialogEl) return;
		if (open && !dialogEl.open) {
			dialogEl.showModal();
		} else if (!open && dialogEl.open) {
			dialogEl.close();
		}
	});
</script>

<dialog
	bind:this={dialogEl}
	class="modal modal-bottom sm:modal-middle"
	onclose={onCancel}
>
	<div class="modal-box max-w-md">
		<h3 class="text-lg font-bold text-error">{title}</h3>
		<p class="mt-2 text-sm text-base-content/70">{message}</p>

		<div class="modal-action gap-2">
			<button class="btn btn-ghost btn-sm" onclick={onCancel}>
				{m.dialog_cancel()}
			</button>
			<button class="btn btn-error btn-sm px-5" onclick={onConfirm}>
				<Trash2 class="h-4 w-4" />
				{m.dialog_confirm_delete()}
			</button>
		</div>
	</div>

	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
