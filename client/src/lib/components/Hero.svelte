<script lang="ts">
	import { Dot, ArrowRight } from '@lucide/svelte';

	const tags = ['Literary Fiction', 'Essay', 'Design Criticism', 'Jakarta', 'Indonesian Culture'];
</script>

<section class="min-h-screen flex items-center">
	<div class="mx-auto w-full px-6 sm:px-10 lg:px-20">
		<div class="max-w-3xl space-y-8">
			<div class="flex flex-col gap-2">
				<p class="text-xs uppercase tracking-[0.35em] text-primary sm:text-sm">Hello, I'm</p>

				<h1
					class="font-serif text-5xl font-semibold leading-none text-base-content sm:text-6xl lg:text-8xl"
				>
					Rifki Saifullah
				</h1>
			</div>

			<div class="flex flex-wrap items-center gap-3 text-sm font-medium tracking-wide sm:text-base">
				<div class="group relative flex items-center gap-2.5 rounded-full border border-primary/20 bg-primary/10 px-5 py-2 text-primary shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/20 hover:shadow-md cursor-default">
					<span class="relative flex h-2 w-2">
						<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
						<span class="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
					</span>
					<span>Software Engineer</span>
				</div>

				<div class="group relative flex items-center gap-2.5 rounded-full border border-secondary/20 bg-secondary/10 px-5 py-2 text-secondary shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary/40 hover:bg-secondary/20 hover:shadow-md cursor-default">
					<span class="relative flex h-2 w-2">
						<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75"></span>
						<span class="relative inline-flex h-2 w-2 rounded-full bg-secondary"></span>
					</span>
					<span>Backend Engineer</span>
				</div>
			</div>

			<div class="h-1 w-16 rounded-full bg-primary"></div>

			<p class="max-w-xl text-base leading-8 text-neutral sm:text-lg">
				I build thoughtful software—from systems that scale to interfaces that feel inevitable.
			</p>

			<button
				class="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-white shadow-lg transition hover:bg-secondary cursor-pointer"
			>
				<span>View My Work</span>
				<ArrowRight class="h-4 w-4" />
			</button>
		</div>
	</div>
</section>

<div class="min-h-screen bg-[#F7F2E8] flex items-center justify-center p-6 md:p-12">
	<div class="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
		<!-- Bagian Kiri: Teks -->
		<div class="space-y-6">
			<div class="space-y-2">
				<p class="text-[10px] uppercase tracking-[0.2em] text-[#7A7468] font-bold">About</p>
				<h1 class="text-4xl md:text-5xl font-serif text-[#1A2E33]">About Me</h1>
			</div>

			<div class="text-[#4A5D61] leading-relaxed space-y-4 font-sans text-[15px]">
				<p>
					I'm Aditya Prasetyo, a Jakarta-based writer and digital creator. My work sits at the
					intersection of literary fiction, personal essay, and design criticism. I'm interested in
					how cities remember — and forget — and what those acts of memory tell us about who we are.
				</p>
				<p>
					My debut novel, <i>Bayangan di Tepi Sungai</i>, is published here in serial chapters. It
					draws on archival research into colonial Jakarta, the social history of the Ciliwung
					river, and the personal testimony of descendants of Betawi families displaced by decades
					of urban development.
				</p>
			</div>

			<!-- Tags -->
			<div class="flex flex-wrap gap-2 pt-2">
				{#each tags as tag}
					<span
						class="px-3 py-1 text-[11px] border border-[#D1CCC0] text-[#7A7468] rounded-sm font-mono tracking-wide"
					>
						{tag}
					</span>
				{/each}
			</div>
		</div>

		<!-- Bagian Kanan: Foto -->
		<div class="w-full h-full flex justify-center md:justify-end">
			<div class="aspect-[4/5] w-full max-w-sm overflow-hidden shadow-lg">
				<!-- Pastikan mengganti src dengan path gambar Anda -->
				<img
					src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop"
					alt="Aditya Prasetyo"
					class="w-full h-full object-cover grayscale-[20%] contrast-[105%]"
				/>
			</div>
		</div>
	</div>
</div>
