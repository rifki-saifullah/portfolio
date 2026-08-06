<script lang="ts">
	const internships = [
		{
			company: 'Google',
			role: 'Software Engineering Intern',
			period: 'May 2024 - Aug 2024',
			location: 'Mountain View, CA',
			description:
				'Worked on Google Search infrastructure, reducing index update latency by 18% through pipeline optimizations in C++ and distributed systems tooling.',
			tags: ['C++', 'Distributed Systems', 'Spanner', 'Go']
		},
		// Tambahkan objek internship lainnya di sini
		{
			company: 'Google',
			role: 'Software Engineering Intern',
			period: 'May 2024 - Aug 2024',
			location: 'Mountain View, CA',
			description:
				'Worked on Google Search infrastructure, reducing index update latency by 18% through pipeline optimizations in C++ and distributed systems tooling.',
			tags: ['C++', 'Distributed Systems', 'Spanner', 'Go']
		}
	];
</script>

<div class="min-h-screen p-6 md:p-20">
	<!-- Header -->
	<div class="max-w-4xl mx-auto mb-16">
		<div class="flex items-center gap-4 mb-4">
			<span class="font-mono text-sm text-[#7A7468]">02</span>
			<div class="h-[1px] w-12 bg-[#7A7468]"></div>
		</div>
		<h1 class="text-4xl md:text-5xl font-serif font-bold mb-4">Internship History</h1>
		<p class="text-[#4A5D61]">Where I've worked and what I've built.</p>
	</div>

	<!-- Timeline dengan DaisyUI Steps -->
	<div class="max-w-4xl mx-auto">
		<ul class="steps steps-vertical items-start">
			{#each internships as job}
				<li class="step step-neutral mb-12">
					<div class="grid grid-cols-1 md:grid-cols-[1fr,2fr] gap-8 text-left ml-6">
						<!-- Sisi Kiri: Waktu & Perusahaan -->
						<div class="pt-1">
							<p class="font-mono text-xs text-[#7A7468] mb-1">{job.period}</p>
							<h3 class="font-bold text-lg">{job.company}</h3>
						</div>

						<!-- Sisi Kanan: Detail -->
						<div>
							<div class="bg-[#EFEADF] p-6 md:p-8 rounded-2xl border border-[#D1CCC0]/50 shadow-sm">
								<div class="flex justify-between items-start mb-4">
									<h4 class="font-bold text-lg">{job.role}</h4>
									<span class="text-xs text-[#7A7468] font-mono">{job.location}</span>
								</div>
								<p class="text-[#4A5D61] leading-relaxed mb-6 text-[15px]">
									{job.description}
								</p>
								<div class="flex flex-wrap gap-2">
									{#each job.tags as tag}
										<span
											class="px-3 py-1 text-[10px] border border-[#D1CCC0] text-[#7A7468] rounded-sm font-mono uppercase tracking-wider"
										>
											{tag}
										</span>
									{/each}
								</div>
							</div>
						</div>
					</div>
				</li>
			{/each}
		</ul>
	</div>
</div>
