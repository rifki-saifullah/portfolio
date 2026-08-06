<script lang="ts">
	import { apiClient } from '$lib/api/client';
	import { Send, CheckCircle2, AlertCircle, Loader2 } from '@lucide/svelte';
	import { Turnstile } from 'svelte-turnstile';
	import { PUBLIC_TURNSTILE_SITE_KEY } from '$env/static/public';
	import * as m from '$lib/paraglide/messages';

	let name = $state('');
	let email = $state('');
	let subject = $state('');
	let message = $state('');
	let website_hp = $state(''); // Honeypot field for bot protection
	let turnstileToken = $state<string | undefined>(undefined);

	let isSubmitting = $state(false);
	let successMessage = $state<string | null>(null);
	let errorMessage = $state<string | null>(null);
	let fieldErrors = $state<Record<string, string[]>>({});

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		isSubmitting = true;
		successMessage = null;
		errorMessage = null;
		fieldErrors = {};

		const res = await apiClient.post<{ id: string }>('/contact', {
			name,
			email,
			subject,
			message,
			turnstileToken,
			website_hp
		});

		isSubmitting = false;

		if (res.ok) {
			successMessage = res.message || 'Pesan Anda telah berhasil dikirim. Terima kasih!';
			name = '';
			email = '';
			subject = '';
			message = '';
			website_hp = '';
			turnstileToken = undefined; // Reset turnstile token after success
		} else {
			if (res.error?.errors) {
				fieldErrors = res.error.errors as Record<string, string[]>;
			}
			errorMessage = res.error?.message || 'Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.';
		}
	}
</script>

<div class="mx-auto w-full max-w-2xl rounded-3xl border border-base-300 bg-base-200/90 p-8 shadow-xl backdrop-blur-md md:p-12">
	<div class="mb-8 text-center space-y-2">
		<h3 class="font-serif text-3xl font-bold text-primary md:text-4xl">
			Kirim Pesan Email
		</h3>
		<p class="font-sans text-sm text-base-content/75 md:text-base">
			Punya pertanyaan, tawaran proyek, atau sekadar ingin menyapa? Silakan isi form di bawah ini.
		</p>
	</div>

	{#if successMessage}
		<div class="alert alert-success mb-6 rounded-2xl shadow-sm animate-fade-in flex items-start gap-3">
			<CheckCircle2 class="h-6 w-6 shrink-0 text-success-content" />
			<div>
				<h4 class="font-bold text-sm">Pesan Terkirim!</h4>
				<p class="text-xs">{successMessage}</p>
			</div>
		</div>
	{/if}

	{#if errorMessage}
		<div class="alert alert-error mb-6 rounded-2xl shadow-sm animate-fade-in flex items-start gap-3">
			<AlertCircle class="h-6 w-6 shrink-0 text-error-content" />
			<div>
				<h4 class="font-bold text-sm">Gagal Mengirim</h4>
				<p class="text-xs">{errorMessage}</p>
			</div>
		</div>
	{/if}

	<form onsubmit={handleSubmit} class="space-y-6">
		<!-- Honeypot Field (Hidden from real users, visible to spambots) -->
		<div class="hidden" aria-hidden="true">
			<label for="website_hp">Leave this field blank</label>
			<input type="text" id="website_hp" name="website_hp" bind:value={website_hp} tabindex="-1" autocomplete="off" />
		</div>

		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
			<!-- Nama -->
			<div class="form-control w-full space-y-2">
				<label for="contact-name" class="label-text font-sans text-xs font-semibold uppercase tracking-wider text-base-content/80">
					Nama Lengkap <span class="text-error">*</span>
				</label>
				<input
					id="contact-name"
					type="text"
					bind:value={name}
					required
					placeholder="Masukkan nama Anda"
					class="input input-bordered w-full rounded-xl bg-base-100 font-sans transition-all focus:border-primary focus:outline-none"
					class:input-error={fieldErrors.name}
				/>
				{#if fieldErrors.name}
					<span class="text-xs text-error">{fieldErrors.name[0]}</span>
				{/if}
			</div>

			<!-- Email -->
			<div class="form-control w-full space-y-2">
				<label for="contact-email" class="label-text font-sans text-xs font-semibold uppercase tracking-wider text-base-content/80">
					Alamat Email <span class="text-error">*</span>
				</label>
				<input
					id="contact-email"
					type="email"
					bind:value={email}
					required
					placeholder="nama@email.com"
					class="input input-bordered w-full rounded-xl bg-base-100 font-sans transition-all focus:border-primary focus:outline-none"
					class:input-error={fieldErrors.email}
				/>
				{#if fieldErrors.email}
					<span class="text-xs text-error">{fieldErrors.email[0]}</span>
				{/if}
			</div>
		</div>

		<!-- Subjek -->
		<div class="form-control w-full space-y-2">
			<label for="contact-subject" class="label-text font-sans text-xs font-semibold uppercase tracking-wider text-base-content/80">
				Subjek <span class="text-error">*</span>
			</label>
			<input
				id="contact-subject"
				type="text"
				bind:value={subject}
				required
				placeholder="Topik atau judul pesan Anda"
				class="input input-bordered w-full rounded-xl bg-base-100 font-sans transition-all focus:border-primary focus:outline-none"
				class:input-error={fieldErrors.subject}
			/>
			{#if fieldErrors.subject}
				<span class="text-xs text-error">{fieldErrors.subject[0]}</span>
			{/if}
		</div>

		<!-- Pesan -->
		<div class="form-control w-full space-y-2">
			<label for="contact-message" class="label-text font-sans text-xs font-semibold uppercase tracking-wider text-base-content/80">
				Pesan Anda <span class="text-error">*</span>
			</label>
			<textarea
				id="contact-message"
				bind:value={message}
				required
				rows="5"
				placeholder="Tuliskan detail pesan Anda di sini..."
				class="textarea textarea-bordered w-full rounded-xl bg-base-100 font-sans leading-relaxed transition-all focus:border-primary focus:outline-none"
				class:textarea-error={fieldErrors.message}
			></textarea>
			{#if fieldErrors.message}
				<span class="text-xs text-error">{fieldErrors.message[0]}</span>
			{/if}
		</div>

		<!-- Cloudflare Turnstile -->
		<div class="flex justify-center py-2">
			<Turnstile 
				siteKey={PUBLIC_TURNSTILE_SITE_KEY}
				on:turnstile-callback={(e) => turnstileToken = e.detail.token}
				on:turnstile-error={() => turnstileToken = undefined}
				on:turnstile-expired={() => turnstileToken = undefined}
				theme="auto"
			/>
		</div>

		<!-- Submit Button -->
		<button
			type="submit"
			disabled={isSubmitting || !turnstileToken}
			class="btn btn-primary w-full gap-2 rounded-xl text-base font-semibold shadow-md transition-all hover:shadow-lg disabled:opacity-70"
		>
			{#if isSubmitting}
				<Loader2 class="h-5 w-5 animate-spin" />
				<span>Mengirim Pesan...</span>
			{:else}
				<Send class="h-5 w-5" />
				<span>Kirim Pesan Sekarang</span>
			{/if}
		</button>
	</form>
</div>
