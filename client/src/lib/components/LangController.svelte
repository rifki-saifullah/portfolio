<script lang="ts">
	import { Languages } from '@lucide/svelte';
	import { setLocale } from '$lib/paraglide/runtime';
</script>

<div class="dropdown dropdown-end">
	<div tabindex="0" role="button" class="btn btn-ghost btn-circle" aria-label="Change language">
		<Languages class="size-5" />
	</div>

	<ul
		tabindex="0"
		class="menu dropdown-content bg-base-100 rounded-box z-20 mt-2 w-44 border border-base-300 shadow-lg"
	>
		<li><button onclick={() => setLocale('id')}>🇮🇩 Indonesia</button></li>
		<li><button onclick={() => setLocale('en')}>🇺🇸 English</button></li>
		<li><button onclick={() => setLocale('ja')}>🇯🇵 日本語</button></li>
	</ul>
</div>
