<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Breadcrumb from '$lib/components/ui/Breadcrumb.svelte';

	let { children } = $props();
</script>

<div class="flex flex-col min-h-screen w-full overflow-x-hidden">
	<Header />

	<main class="flex-grow flex flex-col pt-16 sm:pt-20">
		{@render children()}
	</main>

	<Footer />
</div>
