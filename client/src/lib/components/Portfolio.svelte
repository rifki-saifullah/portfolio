<script lang="ts">
	// Mock data proyek
	const projects = [
		{
			title: 'Kuningan SiteWell',
			description:
				'Dashboard pemantauan status jaringan real-time untuk situs pemerintahan daerah.',
			tags: ['Vue 3', 'Nuxt.js', 'Tailwind'],
			image:
				'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop', // Contoh gambar
			link: '#'
		},
		{
			title: 'SI IMUT',
			description:
				'Platform penjaminan mutu akademik dengan alur evaluasi multi-level dan worker queue.',
			tags: ['Laravel', 'BullMQ', 'Redis'],
			image:
				'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop', // Contoh gambar
			link: '#'
		},
		{
			title: 'Local Spark Cluster',
			description: 'Konfigurasi environment data engineering menggunakan Apache Spark dan HDFS.',
			tags: ['Apache Spark', 'Hadoop', 'Data Eng'],
			image:
				'https://images.unsplash.com/photo-1558494949-ef010bbbb319?q=80&w=600&auto=format&fit=crop', // Contoh gambar
			link: '#'
		}
	];
</script>

<div class="min-h-screen bg-[#F7F2E8] p-6 md:p-20 text-[#1A2E33]">
	<div class="max-w-5xl mx-auto">
		<div class="mb-16">
			<h1 class="text-4xl md:text-5xl font-serif font-bold mb-4">Projects</h1>
			<p class="text-[#4A5D61]">Kumpulan proyek software yang pernah saya kembangkan.</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each projects as project}
				<div
					class="group bg-[#EFEADF] p-4 rounded-2xl border border-[#D1CCC0]/50 hover:border-[#A8A49A] transition-all duration-300 flex flex-col shadow-sm hover:shadow-md"
				>
					<!-- Area Gambar -->
					<div class="aspect-video w-full overflow-hidden rounded-xl mb-4 bg-gray-200">
						<img
							src={project.image}
							alt={project.title}
							class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
						/>
					</div>

					<!-- Area Konten -->
					<div class="flex-1 flex flex-col justify-between p-2">
						<div>
							<h3 class="font-bold text-lg mb-2 group-hover:text-[#0A3641] transition-colors">
								{project.title}
							</h3>
							<p class="text-[#4A5D61] text-[15px] mb-6 leading-relaxed">{project.description}</p>
						</div>

						<div class="space-y-4">
							<div class="flex flex-wrap gap-2">
								{#each project.tags as tag}
									<span
										class="px-2 py-1 text-[10px] border border-[#D1CCC0] text-[#7A7468] rounded-sm font-mono uppercase tracking-wider"
									>
										{tag}
									</span>
								{/each}
							</div>
							<a
								href={project.link}
								class="inline-block text-sm font-bold text-[#1A2E33] underline underline-offset-4 hover:text-[#0A3641]"
							>
								Lihat Detail →
							</a>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
