export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
	id: string;
	type: ToastType;
	message: string;
}

const TOAST_DURATION_MS = 4000;

function createToastStore() {
	let toasts = $state<Toast[]>([]);

	function addToast(type: ToastType, message: string): void {
		const id = crypto.randomUUID();
		toasts.push({ id, type, message });

		setTimeout(() => {
			removeToast(id);
		}, TOAST_DURATION_MS);
	}

	function removeToast(id: string): void {
		toasts = toasts.filter((t) => t.id !== id);
	}

	return {
		get toasts() { return toasts; },
		success: (message: string) => addToast('success', message),
		error: (message: string) => addToast('error', message),
		warning: (message: string) => addToast('warning', message),
		info: (message: string) => addToast('info', message),
		remove: removeToast
	};
}

export const toastStore = createToastStore();
