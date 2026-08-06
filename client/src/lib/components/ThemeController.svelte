<script lang="ts">
	import { Moon, Sun } from '@lucide/svelte';
	import { themeStore } from '$lib/stores/theme.svelte.js';
</script>

<label
	class="swap swap-rotate btn btn-ghost btn-circle tooltip tooltip-bottom cursor-pointer"
	aria-label="Toggle theme"
>
	<input
		type="checkbox"
		class="hidden"
		checked={themeStore.isDark}
		onchange={() => themeStore.toggle()}
	/>

	<Sun class="swap-off size-5 transition-transform duration-200" strokeWidth={2} />

	<Moon class="swap-on size-5 transition-transform duration-200" strokeWidth={2} />
</label>
