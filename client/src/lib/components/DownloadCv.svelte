<script lang="ts">
	import { ArrowDownToLine } from '@lucide/svelte';

	let {
		href,
		label,
		downloadName = 'Rifki Saifullah - CV.pdf'
	}: {
		href: string;
		label: string;
		downloadName?: string;
	} = $props();
</script>

<a
	href={href}
	download={downloadName}
	class="group inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-content shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md"
>
	<span>{label}</span>
	<ArrowDownToLine class="h-4 w-4 opacity-90 transition-transform duration-300 group-hover:translate-y-0.5" />
</a>