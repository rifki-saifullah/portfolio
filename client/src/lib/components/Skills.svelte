<script lang="ts">
	const skillCategories = [
		{
			title: 'Frontend Development',
			skills: ['Vue 3', 'Nuxt.js', 'Tailwind CSS', 'TypeScript', 'Svelte 5']
		},
		{
			title: 'Backend & Database',
			skills: ['Hono.js', 'Express', 'PHP Laravel', 'Bun', 'Prisma ORM', 'Redis']
		},
		{
			title: 'Tools & Data Engineering',
			skills: ['Apache Spark', 'Hadoop', 'Git', 'Docker', 'Linux/Ubuntu']
		}
	];
</script>

<div class="min-h-screen bg-[#F7F2E8] p-6 md:p-20 text-[#1A2E33]">
	<div class="max-w-4xl mx-auto">
		<!-- Header -->
		<div class="mb-16">
			<h1 class="text-4xl md:text-5xl font-serif font-bold mb-4">Technical Skills</h1>
			<p class="text-[#4A5D61]">
				Teknologi dan *tools* yang saya gunakan dalam membangun solusi digital.
			</p>
		</div>

		<!-- Skills Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
			{#each skillCategories as category}
				<div class="bg-[#EFEADF] p-8 rounded-2xl border border-[#D1CCC0]/50 shadow-sm">
					<h3 class="font-serif font-bold text-xl mb-6 text-[#0A3641]">{category.title}</h3>
					<div class="flex flex-wrap gap-3">
						{#each category.skills as skill}
							<span
								class="px-4 py-2 bg-[#F7F2E8] border border-[#D1CCC0] text-[#4A5D61] rounded-lg font-mono text-sm shadow-sm"
							>
								{skill}
							</span>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
