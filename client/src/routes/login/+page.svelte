<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { LucideMail } from '@lucide/svelte';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Breadcrumb from '$lib/components/ui/Breadcrumb.svelte';
	import FormField from '$lib/components/ui/FormField.svelte';
	import { loginSchema, type LoginFormData } from '$lib/validators/auth';
	import { authService } from '$lib/services/auth.service';
	import { goto } from '$app/navigation';
	import { z } from 'zod';

	let email = $state('');
	let password = $state('');
	let showPassword = $state(false);
	let loading = $state(false);
	let errors = $state<Record<string, string>>({});

	function validate(): boolean {
		try {
			loginSchema().parse({ email, password });
			errors = {};
			return true;
		} catch (err) {
			if (err instanceof z.ZodError) {
				const newErrors: Record<string, string> = {};
				err.issues.forEach((issue) => {
					const key = issue.path.join('.');
					if (!newErrors[key]) newErrors[key] = issue.message;
				});
				errors = newErrors;
			}
			return false;
		}
	}

	/** Re-validate entire form, but only show errors for previously touched fields */
	function validateField(field: 'email' | 'password') {
		try {
			if (field === 'email') {
				z.string().min(1).email().parse(email);
			} else {
				z.string().min(6).parse(password);
			}
			const { [field]: _, ...rest } = errors;
			errors = rest;
		} catch (err) {
			if (err instanceof z.ZodError) {
				errors = { ...errors, [field]: err.issues[0]?.message ?? '' };
			}
		}
	}

	async function login() {
		if (!validate()) return;

		loading = true;
		const result = await authService.login(email, password);
		loading = false;

		if (result.ok) {
			goto('/admin/post');
		} else if (result.error.errors) {
			// Map backend field errors
			const backendErrors: Record<string, string> = {};
			for (const [key, messages] of Object.entries(result.error.errors)) {
				backendErrors[key] = messages[0] ?? '';
			}
			errors = { ...errors, ...backendErrors };
		}
	}
</script>

<svelte:head>
	<title>{m.meta_login_title()}</title>
</svelte:head>

<Header />
<Breadcrumb />

<div class="min-h-screen flex items-center justify-center px-4">
	<div class="card w-full max-w-md bg-base-100 border border-base-300 shadow-sm p-6 rounded-box">
		<div class="card-body">
			<!-- Header -->
			<div class="text-center mb-6">
				<h1 class="text-3xl font-bold text-base-content">{m.login_title()}</h1>
				<p class="mt-2 text-base-content/60">{m.login_subtitle()}</p>
			</div>

			<!-- Form -->
			<form
				class="space-y-5"
				onsubmit={(e) => {
					e.preventDefault();
					login();
				}}
			>
				<!-- Email -->
				<FormField label={m.login_email_label()} id="email" error={errors['email']}>
					<input
						type="email"
						id="email"
						bind:value={email}
						placeholder={m.login_email_placeholder()}
						class="input input-bordered w-full {errors['email'] ? 'input-error' : ''}"
						oninput={() => validateField('email')}
					/>
				</FormField>

				<!-- Password -->
				<FormField label={m.login_password_label()} id="password" error={errors['password']}>
					<div class="join w-full">
						<input
							type={showPassword ? 'text' : 'password'}
							id="password"
							bind:value={password}
							placeholder={m.login_password_placeholder()}
							class="input input-bordered join-item flex-1 {errors['password'] ? 'input-error' : ''}"
							oninput={() => validateField('password')}
						/>
						<button
							type="button"
							class="btn btn-accent join-item"
							onclick={() => (showPassword = !showPassword)}
						>
							{showPassword ? m.login_hide_password() : m.login_show_password()}
						</button>
					</div>
				</FormField>

				<!-- Remember -->
				<label class="label cursor-pointer justify-start gap-3">
					<input type="checkbox" class="checkbox checkbox-primary" />
					<span class="label-text">{m.login_remember_me()}</span>
				</label>

				<button class="btn btn-primary w-full" type="submit" disabled={loading}>
					{#if loading}
						<span class="loading loading-spinner loading-sm"></span>
					{:else}
						<LucideMail class="h-5 w-5" />
					{/if}
					{m.login_submit()}
				</button>
			</form>
		</div>
	</div>
</div>

<Footer />
