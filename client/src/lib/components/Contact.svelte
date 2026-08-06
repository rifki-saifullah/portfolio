<script lang="ts">
	let name = $state('');
	let email = $state('');
	let message = $state('');

	function handleSubmit(event: Event) {
		event.preventDefault();
		console.log('Pesan dikirim:', { name, email, message });
		alert('Terima kasih! Pesan Anda telah terkirim.');
		// Reset form
		name = '';
		email = '';
		message = '';
	}
</script>

<div class="min-h-screen bg-[#F7F2E8] p-6 md:p-20 text-[#1A2E33]">
	<div class="max-w-2xl mx-auto">
		<!-- Header -->
		<div class="mb-12">
			<h1 class="text-4xl font-serif font-bold mb-4">Kontak</h1>
			<p class="text-[#4A5D61]">
				Ada pertanyaan atau ingin berkolaborasi? Jangan ragu untuk mengirimkan pesan melalui
				formulir di bawah ini.
			</p>
		</div>

		<!-- Form Kontak -->
		<form
			onsubmit={handleSubmit}
			class="space-y-6 bg-[#EFEADF] p-8 md:p-10 rounded-2xl border border-[#D1CCC0]/50 shadow-sm"
		>
			<div class="form-control">
				<label class="label font-semibold text-xs uppercase tracking-wider text-[#7A7468]"
					>Nama</label
				>
				<input
					type="text"
					bind:value={name}
					class="input input-bordered w-full bg-[#F7F2E8]/50"
					required
				/>
			</div>

			<div class="form-control">
				<label class="label font-semibold text-xs uppercase tracking-wider text-[#7A7468]"
					>Email</label
				>
				<input
					type="email"
					bind:value={email}
					class="input input-bordered w-full bg-[#F7F2E8]/50"
					required
				/>
			</div>

			<div class="form-control">
				<label class="label font-semibold text-xs uppercase tracking-wider text-[#7A7468]"
					>Pesan</label
				>
				<textarea
					bind:value={message}
					class="textarea textarea-bordered w-full min-h-[150px] bg-[#F7F2E8]/50"
					required></textarea>
			</div>

			<button
				type="submit"
				class="btn btn-primary w-full text-white bg-[#1A2E33] hover:bg-[#2a4a52] border-none"
			>
				Kirim Pesan
			</button>
		</form>

		<!-- Informasi Tambahan -->
		<div class="mt-12 flex justify-center gap-6 text-[#7A7468]">
			<a
				href="mailto:email@example.com"
				class="hover:text-[#1A2E33] transition-colors font-mono text-sm">Email</a
			>
			<a href="https://twitter.com" class="hover:text-[#1A2E33] transition-colors font-mono text-sm"
				>Twitter</a
			>
			<a href="https://github.com" class="hover:text-[#1A2E33] transition-colors font-mono text-sm"
				>GitHub</a
			>
		</div>
	</div>
</div>
