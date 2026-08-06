<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import DownloadCv from '$lib/components/DownloadCv.svelte';
	import {
		ExternalLink,
		X,
		Maximize2,
		ChevronLeft,
		ChevronRight
	} from '@lucide/svelte';
	import * as m from '$lib/paraglide/messages';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { userService } from '$lib/services/profile.service';
	import type { User } from '$lib/types';
	import ResumePdf from '$lib/assets/resume-rifki-saifullah.pdf';

	import HomepageSiimoet from '$lib/assets/si-imoet/homepage.png';
	import AgendaSiimoet from '$lib/assets/si-imoet/agenda-management.png';
	import DashboardSiimoet from '$lib/assets/si-imoet/dashboard.png';
	import LoginSiimoet from '$lib/assets/si-imoet/login.png';
	import ManagementSiimoet from '$lib/assets/si-imoet/management-akreditasi.png';
	import ManagementPeriodSiimoet from '$lib/assets/si-imoet/management-period.png';
	import ModulePeriodSiimoet from '$lib/assets/si-imoet/module-period.png';
	import ModulePeriodIdSiimoet from '$lib/assets/si-imoet/module-periodeid.png';
	import PostSiimoet from '$lib/assets/si-imoet/post-management.png';
	import RoleSiimoet from '$lib/assets/si-imoet/role-management.png';
	import UserSiimoet from '$lib/assets/si-imoet/user-management.png';

	import HomepageSitewell from '$lib/assets/kuningan-sitewell/homepage.png';
	import AboutSitewell from '$lib/assets/kuningan-sitewell/about.png';
	import CreateWebSitewell from '$lib/assets/kuningan-sitewell/create-web.png';
	import DashboardSitewell from '$lib/assets/kuningan-sitewell/dashboard.png';
	import DetailWebSitewell from '$lib/assets/kuningan-sitewell/detail-web.png';
	import ListWebsAdminSitewell from '$lib/assets/kuningan-sitewell/list-webs-admin.png';
	import ListWebsSitewell from '$lib/assets/kuningan-sitewell/list-webs.png';
	import LoginSitewell from '$lib/assets/kuningan-sitewell/login.png';
	import NotifSitewell from '$lib/assets/kuningan-sitewell/notif.png';
	import PdfReportSitewell from '$lib/assets/kuningan-sitewell/pdf-report.png';
	import ReportSitewell from '$lib/assets/kuningan-sitewell/report.png';

	let profile = $state<User | null>(null);

	onMount(async () => {
		const res = await userService.getPublicProfile();
		if (res.ok) {
			profile = res.data;
		}
	});

	interface ProjectGalleryItem {
		src: string;
		alt: string;
		aspect: string;
	}

	interface Project {
		id: string;
		title: string;
		description: string;
		tags: string[];
		image: string;
		actionHref: string;
		actionLabel: string;
		details: string[];
		gallery: ProjectGalleryItem[];
	}

	const projects: Project[] = [
		{
			id: 'sitewell',
			title: 'Kuningan SiteWell',
			description: m.homepage_sitewell_description(),
			tags: ['Node Js', 'Express JS', 'Nuxt', 'Tailwind', 'MySQL'],
			image: HomepageSitewell,
			actionHref: 'https://github.com/rifki-saifullah/kuningan-sitewell',
			actionLabel: m.homepage_project_view_code(),
			details: [
				m.homepage_sitewell_description_1(),
				m.homepage_sitewell_description_2(),
				m.homepage_sitewell_description_3(),
				m.homepage_sitewell_description_4()
			],
			gallery: [
				{
					src: HomepageSitewell,
					alt: 'Homepage',
					aspect: 'col-span-12 lg:col-span-8 aspect-video'
				},
				{
					src: DashboardSitewell,
					alt: 'Dashboard',
					aspect: 'col-span-6 lg:col-span-4 aspect-square'
				},
				{
					src: AboutSitewell,
					alt: 'About',
					aspect: 'col-span-6 lg:col-span-4 aspect-square'
				},
				{
					src: ListWebsSitewell,
					alt: 'Website List',
					aspect: 'col-span-6 lg:col-span-4 aspect-square'
				},
				{
					src: DetailWebSitewell,
					alt: 'Website Detail',
					aspect: 'col-span-6 lg:col-span-4 aspect-square'
				},
				{
					src: CreateWebSitewell,
					alt: 'Create Website',
					aspect: 'col-span-12 lg:col-span-8 aspect-video'
				},
				{
					src: LoginSitewell,
					alt: 'Login',
					aspect: 'col-span-12 lg:col-span-4 aspect-video'
				},
				{
					src: ListWebsAdminSitewell,
					alt: 'Admin Website List',
					aspect: 'col-span-6 lg:col-span-4 aspect-square'
				},
				{
					src: ReportSitewell,
					alt: 'Report',
					aspect: 'col-span-6 lg:col-span-4 aspect-square'
				},
				{
					src: PdfReportSitewell,
					alt: 'PDF Report',
					aspect: 'col-span-12 lg:col-span-8 aspect-video'
				},
				{
					src: NotifSitewell,
					alt: 'Notification',
					aspect: 'col-span-6 lg:col-span-4 aspect-square'
				}
			]
		},
		{
			id: 'siimoet',
			title: 'SI-IMOET',
			description: m.homepage_siimoet_description(),
			tags: ['Bun', 'Hono', 'Nuxt', 'Tailwind', 'BullMQ', 'PostgreSQL', 'Redis'],
			image: HomepageSiimoet,
			actionHref: 'https://siimoet.umc.ac.id',
			actionLabel: m.homepage_project_visit_website(),
			details: [
				m.homepage_siimoet_description_1(),
				m.homepage_siimoet_description_2(),
				m.homepage_siimoet_description_3(),
				m.homepage_siimoet_description_4()
			],
			gallery: [
				{
					src: HomepageSiimoet,
					alt: 'Homepage',
					aspect: 'col-span-12 lg:col-span-8 aspect-video'
				},
				{
					src: DashboardSiimoet,
					alt: 'Dashboard',
					aspect: 'col-span-6 lg:col-span-4 aspect-square'
				},
				{
					src: LoginSiimoet,
					alt: 'Login',
					aspect: 'col-span-6 lg:col-span-4 aspect-square'
				},
				{
					src: AgendaSiimoet,
					alt: 'Agenda Management',
					aspect: 'col-span-6 lg:col-span-4 aspect-square'
				},
				{
					src: ManagementSiimoet,
					alt: 'Accreditation Management',
					aspect: 'col-span-6 lg:col-span-4 aspect-square'
				},
				{
					src: ManagementPeriodSiimoet,
					alt: 'Period Management',
					aspect: 'col-span-12 lg:col-span-8 aspect-video'
				},
				{
					src: ModulePeriodSiimoet,
					alt: 'Module Period',
					aspect: 'col-span-12 lg:col-span-4 aspect-video'
				},
				{
					src: ModulePeriodIdSiimoet,
					alt: 'Module Period Detail',
					aspect: 'col-span-6 lg:col-span-4 aspect-square'
				},
				{
					src: PostSiimoet,
					alt: 'Post Management',
					aspect: 'col-span-6 lg:col-span-4 aspect-square'
				},
				{
					src: RoleSiimoet,
					alt: 'Role Management',
					aspect: 'col-span-12 lg:col-span-8 aspect-video'
				},
				{
					src: UserSiimoet,
					alt: 'User Management',
					aspect: 'col-span-6 lg:col-span-4 aspect-square'
				}
			]
		}
	];

	const internships = [
		{
			company: m.homepage_journey_diskominfo_company(),
			role: m.homepage_journey_diskominfo_role(),
			period: m.homepage_journey_diskominfo_period(),
			location: m.homepage_journey_diskominfo_location(),
			description: m.homepage_journey_diskominfo_description()
		},
		{
			company: m.homepage_journey_lpmumc_company(),
			role: m.homepage_journey_lpmumc_role(),
			period: m.homepage_journey_lpmumc_period(),
			location: m.homepage_journey_lpmumc_location(),
			description: m.homepage_journey_lpmumc_description()
		}
	];

	const socialLinks = $derived.by(() => {
		const list: { name: string; href: string; icon: string; color: string }[] = [];

		if (profile?.email) {
			list.push({
				name: 'Email',
				href: `mailto:${profile.email}`,
				icon: 'mdi:email',
				color: '#ea4335'
			});
		}

		if (profile?.githubUrl) {
			list.push({
				name: 'GitHub',
				href: profile.githubUrl,
				icon: 'mdi:github',
				color: 'currentColor'
			});
		}

		if (profile?.linkedinUrl) {
			list.push({
				name: 'LinkedIn',
				href: profile.linkedinUrl,
				icon: 'mdi:linkedin',
				color: '#0a66c2'
			});
		}

		if (profile?.youtubeUrl) {
			list.push({
				name: 'YouTube',
				href: profile.youtubeUrl,
				icon: 'mdi:youtube',
				color: '#ff0000'
			});
		}

		// Fallback defaults if public profile API hasn't loaded yet
		if (list.length === 0) {
			return [
				{
					name: 'Email',
					href: 'mailto:saifullah.rifki.21@gmail.com',
					icon: 'mdi:email',
					color: '#ea4335'
				},
				{
					name: 'LinkedIn',
					href: 'https://linkedin.com/in/rifki-saifullah-550483343',
					icon: 'mdi:linkedin',
					color: '#0a66c2'
				},
				{
					name: 'GitHub',
					href: 'https://github.com/rifki-saifullah',
					icon: 'mdi:github',
					color: 'currentColor'
				},
				{
					name: 'YouTube',
					href: 'https://youtube.com/@fictiontypes?si=Pkry2ooluIdTrbop',
					icon: 'mdi:youtube',
					color: '#ff0000'
				}
			];
		}

		return list;
	});

	// Lightbox / Detail Modal State
	let selectedProject = $state<Project | null>(null);
	let isModalOpen = $state(false);

	// Image Viewer
	let isImageViewerOpen = $state(false);
	let selectedImage = $state<ProjectGalleryItem | null>(null);
	let selectedImageIndex = $state(0);

	function openImage(index: number) {
		if (!selectedProject) return;

		selectedImageIndex = index;
		selectedImage = selectedProject.gallery[index];
		isImageViewerOpen = true;
	}

	function closeImage() {
		isImageViewerOpen = false;
		selectedImage = null;
	}

	function nextImage() {
		if (!selectedProject) return;

		selectedImageIndex = (selectedImageIndex + 1) % selectedProject.gallery.length;

		selectedImage = selectedProject.gallery[selectedImageIndex];
	}

	function prevImage() {
		if (!selectedProject) return;

		selectedImageIndex =
			(selectedImageIndex - 1 + selectedProject.gallery.length) % selectedProject.gallery.length;

		selectedImage = selectedProject.gallery[selectedImageIndex];
	}

	function openProjectModal(project: Project) {
		selectedProject = project;
		isModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
		selectedProject = null;
	}

	onMount(() => {
		const handler = (e: KeyboardEvent) => {
			if (!isImageViewerOpen) return;

			if (e.key === 'Escape') closeImage();
			if (e.key === 'ArrowRight') nextImage();
			if (e.key === 'ArrowLeft') prevImage();
		};

		window.addEventListener('keydown', handler);

		return () => {
			window.removeEventListener('keydown', handler);
		};
	});
</script>

<svelte:head>
	<title>{m.meta_homepage_title()}</title>
	<meta name="description" content={m.meta_homepage_description()} />
</svelte:head>

<Header variant="homepage" />

<!-- Hero Section -->
<section id="home" class="hero flex min-h-screen items-center bg-base-100 text-base-content">
	<div class="mx-auto w-full px-6 sm:px-10 lg:px-20">
		<div class="mx-auto flex max-w-3xl flex-col items-center space-y-8 text-center">
			<div class="flex flex-col gap-3">
				<p
					class="hero-item font-sans text-xs font-medium uppercase tracking-[0.35em] text-secondary sm:text-sm"
				>
					{m.homepage_hero_greeting()}
				</p>

				<h1
					class="hero-item font-serif text-5xl font-semibold leading-none text-primary sm:text-6xl lg:text-8xl"
				>
					Rifki Saifullah
				</h1>
			</div>

			<div
				class="flex flex-wrap items-center justify-center gap-3 text-sm font-medium tracking-wide sm:text-base"
			>
				<span>{m.homepage_hero_role_se()}</span>

				<span class="relative flex h-2 w-2">
					<span
						class="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75"
					></span>
					<span class="relative inline-flex h-2 w-2 rounded-full bg-secondary"></span>
				</span>

				<span>{m.homepage_hero_role_be()}</span>
			</div>

			<div class="hero-item mb-2 h-0.5 w-20 rounded-full bg-accent"></div>

			<p
				class="hero-item max-w-2xl font-sans text-base leading-relaxed text-base-content/75 sm:text-lg"
			>
				{m.homepage_hero_summary()}
			</p>

			<DownloadCv href={ResumePdf} label={m.homepage_download_cv()} downloadName="Rifki Saifullah - CV.pdf" />
		</div>
	</div>
</section>

<!-- About Section -->
<section
	id="about"
	class="relative overflow-hidden bg-base-100 px-6 py-16 text-base-content md:px-12 md:py-24"
>
	<div class="pointer-events-none absolute inset-0 opacity-70">
		<div class="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"></div>
		<div class="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-secondary/10 blur-3xl"></div>
	</div>

	<div class="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.15fr,0.85fr] lg:gap-16">
		<div class="space-y-8 text-left">
			<div class="space-y-4">
				<div class="h-1 w-12 rounded-full bg-accent"></div>
				<h2 class="font-serif text-4xl font-bold tracking-tight text-primary md:text-5xl lg:text-6xl">
					{m.homepage_about_title()}
				</h2>
			</div>

			<div class="space-y-5 rounded-[2rem] border border-base-300/80 bg-base-200/70 p-6 shadow-sm backdrop-blur md:p-8">
				{#each [
					m.homepage_about_description_1(),
					m.homepage_about_description_2(),
					m.homepage_about_description_3()
				] as paragraph, index (index)}
					<p class="font-sans text-lg leading-8 text-base-content/80 md:text-xl md:leading-9">
						{paragraph}
					</p>
				{/each}
			</div>
		</div>

	</div>
</section>

<!-- Journey Section -->
<div id="journey" class="intern-card min-h-screen bg-base-100 p-6 text-base-content md:p-20">
	<div class="mx-auto mb-16 max-w-4xl">
		<div class="mb-4 flex items-center gap-4">
			<div class="h-px w-12 bg-accent"></div>
		</div>

		<h2 class="mb-4 font-serif text-4xl font-bold md:text-5xl text-primary">
			{m.homepage_journey_title()}
		</h2>

		<p class="font-sans text-base text-base-content/70">
			{m.homepage_journey_description()}
		</p>
	</div>

	<div class="mx-auto max-w-4xl">
		<ul class="steps steps-vertical items-start">
			{#each internships as job}
				<li class="step step-primary mb-12">
					<div class="ml-6 grid grid-cols-1 gap-8 text-left md:grid-cols-[1fr,2fr]">
						<div class="pt-1">
							<p class="mb-1 font-mono text-xs text-secondary">
								{job.period}
							</p>

							<h3 class="text-lg font-semibold text-base-content">
								{job.company}
							</h3>
						</div>

						<div>
							<div
								class="rounded-2xl border border-base-300 bg-base-200 p-6 shadow-sm transition-all duration-300 hover:border-primary hover:shadow-lg md:p-8"
							>
								<div class="mb-4 flex items-start justify-between gap-4">
									<h4 class="text-lg font-semibold text-primary">
										{job.role}
									</h4>

									<span class="font-mono text-xs text-secondary">
										{job.location}
									</span>
								</div>

								<p class="mb-6 text-[15px] leading-relaxed text-base-content/80">
									{job.description}
								</p>
							</div>
						</div>
					</div>
				</li>
			{/each}
		</ul>
	</div>
</div>

<!-- Portfolio Section (Static Masonry Grid Gallery + Lightbox Modal) -->
<div id="portfolio" class="project-card min-h-screen bg-base-100 p-6 text-base-content md:p-20">
	<div class="mx-auto max-w-6xl">
		<div class="mb-4 flex items-center gap-4">
			<div class="h-px w-12 bg-accent"></div>
		</div>

		<div class="mb-12">
			<h2 class="mb-4 font-serif text-4xl font-bold md:text-5xl text-primary">
				{m.homepage_portfolio_title()}
			</h2>
			<p class="font-sans text-base text-base-content/70">
				{m.homepage_portfolio_description()}
			</p>
		</div>

		<!-- Masonry Grid Columns -->
		<div class="columns-1 md:columns-2 gap-6 space-y-6">
			{#each projects as project}
				<div
					role="button"
					tabindex="0"
					class="group break-inside-avoid flex flex-col rounded-2xl border border-base-300 bg-base-200 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-xl cursor-pointer"
					onclick={() => openProjectModal(project)}
					onkeydown={(e) => e.key === 'Enter' && openProjectModal(project)}
				>
					<div class="relative mb-4 aspect-video w-full overflow-hidden rounded-xl bg-base-300">
						<img
							src={project.image}
							alt={project.title}
							class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
						/>
						<div
							class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 font-semibold text-sm"
						>
							<Maximize2 size={18} />
							<span>{m.homepage_project_view_detail()}</span>
						</div>
					</div>

					<div class="flex flex-1 flex-col justify-between p-2">
						<div>
							<h3
								class="mb-2 text-lg font-semibold text-base-content transition-colors duration-300 group-hover:text-primary"
							>
								{project.title}
							</h3>

							<p class="mb-4 text-[15px] leading-relaxed text-base-content/75 line-clamp-3">
								{project.description}
							</p>
						</div>

						<div class="space-y-4">
							<div class="flex flex-wrap gap-2">
								{#each project.tags as tag}
									<span
										class="rounded-md border border-base-300 bg-base-100 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-secondary"
									>
										{tag}
									</span>
								{/each}
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<!-- Project Detail Modal / Lightbox -->
{#if isModalOpen && selectedProject}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-black/80 backdrop-blur-md transition-opacity"
		role="dialog"
		aria-modal="true"
	>
		<div
			class="relative w-full max-w-6xl max-h-[92vh] bg-base-100 rounded-3xl m-auto border border-base-300 shadow-2xl overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
		>
			<!-- Close Button -->
			<button
				type="button"
				class="absolute right-4 top-4 z-30 btn btn-circle btn-sm btn-neutral inline-flex items-center justify-center p-0 leading-none opacity-80 shadow-md hover:opacity-100"
				onclick={closeModal}
			>
				<X size={18} />
			</button>

			<!-- Modal Content -->
			<div class="p-6 sm:p-8 md:p-10 space-y-8">
				<div class="relative">
					<!-- HERO IMAGE -->
					<div class="relative h-[260px] md:h-[420px] overflow-hidden">
						<img
							src={selectedProject.gallery[0].src}
							alt={selectedProject.gallery[0].alt}
							class="absolute inset-0 w-full h-full object-cover"
						/>

						<div
							class="absolute inset-0 bg-gradient-to-t from-base-100 via-black/40 to-black/20"
						></div>

						<button
							class="absolute top-5 right-5 btn btn-circle btn-primary"
							onclick={() => openImage(0)}
						>
							<Maximize2 size={18} />
						</button>

						<div class="absolute bottom-0 left-0 right-0 p-8 md:p-10 text-white">
							<h2 class="font-serif text-3xl md:text-5xl font-bold">
								{selectedProject.title}
							</h2>

							<p class="mt-3 max-w-3xl text-white/90">
								{selectedProject.description}
							</p>
						</div>
					</div>

					<!-- CONTENT -->
							<span>{m.homepage_project_view_detail()}</span>
					<div class="p-8 md:p-10">
						<div class="flex flex-wrap gap-2 mb-8">
							{#each selectedProject.tags as tag}
								<span class="badge badge-outline badge-secondary">
									{tag}
								</span>
							{/each}
						</div>

						<div class="mb-10 space-y-4">
							{#each selectedProject.details as detail}
								<p class="leading-8 text-base-content/80">{detail}</p>
							{/each}
						</div>

						<div class="flex justify-end mb-8">
							<a href={selectedProject.actionHref} target="_blank" class="btn btn-primary gap-2">
								{selectedProject.actionLabel}

								<ExternalLink size={16} />
							</a>
						</div>

						<div class="border-t border-base-300 pt-8">
							<h3 class="font-semibold text-xl mb-6">{m.homepage_project_screenshots()}</h3>

							<!-- GRID -->

							<div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
								{#each selectedProject.gallery as item, index}
									<button
										type="button"
										onclick={() => openImage(index)}
										class="
                        group
                        relative
                        overflow-hidden
                        rounded-2xl
                        aspect-video
                        bg-base-300
                        border
                        border-base-300
                        cursor-pointer"
									>
										<img
											src={item.src}
											alt={item.alt}
											class="w-full h-full object-cover transition duration-500 group-hover:scale-110"
										/>

										<div
											class="
                            absolute
                            inset-0
                            bg-black/40
                            opacity-0
                            transition
                            group-hover:opacity-100
                            flex
                            items-center
                            justify-center"
										>
											<Maximize2 size={22} class="text-white" />
										</div>
									</button>
								{/each}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

{#if isImageViewerOpen && selectedImage}
<div
    class="fixed inset-0 z-[999] bg-black/95 backdrop-blur-md flex items-center justify-center"
    onclick={closeImage}
>

    <!-- Close -->
    <button
        class="btn btn-circle absolute top-6 right-6 z-20"
        onclick={(e)=>{
            e.stopPropagation();
            closeImage();
        }}
    >
        <X size={20}/>
    </button>

    <!-- Previous -->
    <button
        class="btn btn-circle absolute left-6 z-20"
        onclick={(e)=>{
            e.stopPropagation();
            prevImage();
        }}
    >
        <ChevronLeft size={26}/>
    </button>

    <!-- Next -->
    <button
        class="btn btn-circle absolute right-6 z-20"
        onclick={(e)=>{
            e.stopPropagation();
            nextImage();
        }}
    >
        <ChevronRight size={26}/>
    </button>

    <!-- Counter -->
    <div
        class="absolute top-6 left-6 badge badge-neutral badge-lg z-20">

        {selectedImageIndex + 1} /
        {selectedProject?.gallery.length}

    </div>

    <!-- Image -->

    <img
        src={selectedImage.src}
        alt={selectedImage.alt}
        class="
            max-w-[92vw]
            max-h-[90vh]
            object-contain
            rounded-xl
            shadow-2xl
            animate-in
            zoom-in-95
            duration-200"
        onclick={(e)=>e.stopPropagation()}
    />

</div>
{/if}

<!-- Contact Section (Pure Social & Direct Info, Contact Form removed as per decision) -->
<div
	id="contact"
	class="bg-base-100 px-6 py-16 text-base-content md:px-12 md:py-24 border-t border-base-200"
>
	<div class="mx-auto max-w-4xl text-center space-y-10">
		<div class="space-y-4">
			<div class="flex justify-center">
				<div class="h-1 w-12 rounded-full bg-accent"></div>
			</div>
			<h2 class="font-serif text-4xl font-bold text-primary md:text-5xl">
				{m.homepage_contact_title()}
			</h2>
			<p class="font-sans text-base text-base-content/75 max-w-2xl mx-auto">
				{m.homepage_contact_description()}
			</p>
		</div>

		<div class="flex flex-wrap justify-center items-center gap-6 pt-4">
			{#each socialLinks as item}
				<a
					href={item.href}
					target="_blank"
					rel="noopener noreferrer"
					aria-label={item.name}
					style="--brand: {item.color};"
					class="group relative flex h-16 w-16 items-center justify-center rounded-full bg-base-200 shadow-md ring-1 ring-base-300 transition-all duration-500 hover:-translate-y-2 hover:bg-[var(--brand)] hover:shadow-[0_10px_20px_-5px_var(--brand)] hover:ring-[var(--brand)]"
				>
					<Icon
						icon={item.icon}
						class="relative z-10 h-8 w-8 text-base-content transition-colors duration-500 group-hover:text-white dark:group-hover:text-black"
					/>
				</a>
			{/each}
		</div>
	</div>
</div>

<Footer variant="homepage" />
