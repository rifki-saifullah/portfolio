<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import FormField from '$lib/components/ui/FormField.svelte';
	import { userService } from '$lib/services/profile.service';
	import { authStore } from '$lib/stores/auth.svelte.js';
	import { toastStore } from '$lib/stores/toast.svelte.js';
	import { updateProfileSchema, changePasswordSchema } from '$lib/validators/profile';
	import { onMount } from 'svelte';
	import { User as UserIcon, Lock, Camera, ArrowLeft } from '@lucide/svelte';
	import { z } from 'zod';

	import { getImageUrl } from '$lib/utils/format';

	let name = $state('');
	let email = $state('');
	let avatarUrl = $state('');
	let saweriaUrl = $state('');
	let githubUrl = $state('');
	let linkedinUrl = $state('');
	let youtubeUrl = $state('');

	let oldPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');

	let profileLoading = $state(false);
	let passwordLoading = $state(false);
	let avatarUploading = $state(false);

	let profileErrors = $state<Record<string, string>>({});
	let passwordErrors = $state<Record<string, string>>({});

	onMount(async () => {
		const res = await userService.getProfile();
		if (res.ok) {
			name = res.data.name;
			email = res.data.email;
			avatarUrl = res.data.avatarUrl || '';
			saweriaUrl = res.data.saweriaUrl || '';
			githubUrl = res.data.githubUrl || '';
			linkedinUrl = res.data.linkedinUrl || '';
			youtubeUrl = res.data.youtubeUrl || '';
		}
	});

	async function handleAvatarUpload(e: Event) {
		const target = e.target as HTMLInputElement;
		if (!target.files || target.files.length === 0) return;

		const oldAvatar = avatarUrl;
		const file = target.files[0];
		avatarUploading = true;
		const res = await userService.uploadAvatar(file);
		avatarUploading = false;

		if (res.ok) {
			if (oldAvatar && oldAvatar !== res.data.url) {
				await userService.deleteFile(oldAvatar);
			}
			avatarUrl = res.data.url;
			toastStore.success('Avatar berhasil diperbarui!');
		} else {
			toastStore.error('Gagal mengunggah avatar.');
		}
	}

	async function handleSaveProfile(e: Event) {
		e.preventDefault();
		try {
			updateProfileSchema().parse({ name, email, avatarUrl, saweriaUrl, githubUrl, linkedinUrl, youtubeUrl });
			profileErrors = {};
		} catch (err) {
			if (err instanceof z.ZodError) {
				const errs: Record<string, string> = {};
				err.issues.forEach((i) => { errs[i.path.join('.')] = i.message; });
				profileErrors = errs;
			}
			return;
		}

		profileLoading = true;
		const res = await userService.updateProfile({ name, email, avatarUrl, saweriaUrl, githubUrl, linkedinUrl, youtubeUrl });
		profileLoading = false;

		if (res.ok) {
			authStore.setAuth(res.data);
			toastStore.success('Profil berhasil diperbarui.');
		} else if (res.error?.errors) {
			const errs: Record<string, string> = {};
			for (const [k, v] of Object.entries(res.error.errors)) {
				errs[k] = v[0];
			}
			profileErrors = errs;
		}
	}

	async function handleChangePassword(e: Event) {
		e.preventDefault();
		try {
			changePasswordSchema().parse({ oldPassword, newPassword, confirmPassword });
			passwordErrors = {};
		} catch (err) {
			if (err instanceof z.ZodError) {
				const errs: Record<string, string> = {};
				err.issues.forEach((i) => { errs[i.path.join('.')] = i.message; });
				passwordErrors = errs;
			}
			return;
		}

		passwordLoading = true;
		const res = await userService.changePassword({ oldPassword, newPassword, confirmPassword });
		passwordLoading = false;

		if (res.ok) {
			toastStore.success('Password berhasil diperbarui.');
			oldPassword = '';
			newPassword = '';
			confirmPassword = '';
		} else if (res.error?.errors) {
			const errs: Record<string, string> = {};
			for (const [k, v] of Object.entries(res.error.errors)) {
				errs[k] = v[0];
			}
			passwordErrors = errs;
		} else if (res.error?.message) {
			toastStore.error(res.error.message);
		}
	}
</script>

<svelte:head>
	<title>Pengaturan Profil - Dashboard</title>
</svelte:head>

<section class="min-h-screen px-4 py-8 sm:px-6 md:px-10 lg:px-16 xl:px-24">
	<div class="mx-auto max-w-4xl space-y-8">
		<!-- Navigation Header -->
		<div class="flex items-center justify-between">
			<a href="/admin/post" class="btn btn-ghost btn-sm gap-2">
				<ArrowLeft size={16} />
				<span>Kembali ke Postingan</span>
			</a>
			<h1 class="text-xl font-bold text-base-content">Pengaturan Akun</h1>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			<!-- Left Column: Avatar & Basic Info Card -->
			<div class="md:col-span-1 space-y-6">
				<div class="card bg-base-100 border border-base-300 shadow-sm p-6 text-center">
					<div class="relative inline-block mx-auto mb-4">
						<div class="w-28 h-28 rounded-full overflow-hidden border-2 border-primary/20 bg-base-200 flex items-center justify-center">
							{#if avatarUrl}
								<img src={getImageUrl(avatarUrl)} alt={name} class="w-full h-full object-cover" />
							{:else}
								<UserIcon size={48} class="text-base-content/40" />
							{/if}
						</div>
						<label
							class="absolute bottom-0 right-0 btn btn-circle btn-primary btn-xs cursor-pointer shadow-md"
							title="Ubah Foto Profil"
						>
							<Camera size={12} />
							<input type="file" accept="image/*" class="hidden" onchange={handleAvatarUpload} />
						</label>
					</div>

					<h2 class="font-bold text-lg">{name || 'Admin'}</h2>
					<p class="text-xs text-base-content/60">{email}</p>

					{#if avatarUploading}
						<div class="mt-2 text-xs text-primary font-semibold animate-pulse">Mengunggah foto...</div>
					{/if}
				</div>
			</div>

			<!-- Right Column: Profile Edit & Change Password Forms -->
			<div class="md:col-span-2 space-y-8">
				<!-- Form 1: Edit Profile -->
				<div class="card bg-base-100 border border-base-300 shadow-sm p-6 sm:p-8 space-y-6">
					<div class="border-b border-base-200 pb-4">
						<h3 class="font-bold text-lg flex items-center gap-2">
							<UserIcon size={20} class="text-primary" />
							<span>Informasi Profil & Tautan Sosial</span>
						</h3>
						<p class="text-xs text-base-content/60 mt-1">Perbarui profil dan link media sosial / dukungan Anda.</p>
					</div>

					<form onsubmit={handleSaveProfile} class="space-y-4">
						<FormField label="Nama Lengkap" id="name" error={profileErrors['name']}>
							<input
								id="name"
								type="text"
								bind:value={name}
								class="input input-bordered w-full"
								required
							/>
						</FormField>

						<FormField label="Alamat Email" id="email" error={profileErrors['email']}>
							<input
								id="email"
								type="email"
								bind:value={email}
								class="input input-bordered w-full"
								required
							/>
						</FormField>

						<div class="divider text-xs text-base-content/40 my-2">Media Sosial & Dukungan</div>

						<FormField label="Link Saweria / Support" id="saweriaUrl" error={profileErrors['saweriaUrl']}>
							<input
								id="saweriaUrl"
								type="url"
								placeholder="https://saweria.co/username"
								bind:value={saweriaUrl}
								class="input input-bordered w-full"
							/>
						</FormField>

						<FormField label="Link GitHub" id="githubUrl" error={profileErrors['githubUrl']}>
							<input
								id="githubUrl"
								type="url"
								placeholder="https://github.com/username"
								bind:value={githubUrl}
								class="input input-bordered w-full"
							/>
						</FormField>

						<FormField label="Link LinkedIn" id="linkedinUrl" error={profileErrors['linkedinUrl']}>
							<input
								id="linkedinUrl"
								type="url"
								placeholder="https://linkedin.com/in/username"
								bind:value={linkedinUrl}
								class="input input-bordered w-full"
							/>
						</FormField>

						<FormField label="Link YouTube" id="youtubeUrl" error={profileErrors['youtubeUrl']}>
							<input
								id="youtubeUrl"
								type="url"
								placeholder="https://youtube.com/@username"
								bind:value={youtubeUrl}
								class="input input-bordered w-full"
							/>
						</FormField>

						<div class="flex justify-end pt-2">
							<button type="submit" class="btn btn-primary btn-sm px-6" disabled={profileLoading}>
								{#if profileLoading}
									<span class="loading loading-spinner loading-xs"></span>
								{/if}
								Simpan Profil
							</button>
						</div>
					</form>
				</div>

				<!-- Form 2: Change Password -->
				<div class="card bg-base-100 border border-base-300 shadow-sm p-6 sm:p-8 space-y-6">
					<div class="border-b border-base-200 pb-4">
						<h3 class="font-bold text-lg flex items-center gap-2">
							<Lock size={20} class="text-accent" />
							<span>Ubah Password</span>
						</h3>
						<p class="text-xs text-base-content/60 mt-1">Pastikan password baru Anda kuat dan aman.</p>
					</div>

					<form onsubmit={handleChangePassword} class="space-y-4">
						<FormField label="Password Lama" id="oldPassword" error={passwordErrors['oldPassword']}>
							<input
								id="oldPassword"
								type="password"
								bind:value={oldPassword}
								class="input input-bordered w-full"
								required
							/>
						</FormField>

						<FormField label="Password Baru" id="newPassword" error={passwordErrors['newPassword']}>
							<input
								id="newPassword"
								type="password"
								bind:value={newPassword}
								class="input input-bordered w-full"
								required
							/>
						</FormField>

						<FormField label="Konfirmasi Password Baru" id="confirmPassword" error={passwordErrors['confirmPassword']}>
							<input
								id="confirmPassword"
								type="password"
								bind:value={confirmPassword}
								class="input input-bordered w-full"
								required
							/>
						</FormField>

						<div class="flex justify-end pt-2">
							<button type="submit" class="btn btn-accent btn-sm px-6" disabled={passwordLoading}>
								{#if passwordLoading}
									<span class="loading loading-spinner loading-xs"></span>
								{/if}
								Ubah Password
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</section>
