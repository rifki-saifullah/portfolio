<script lang="ts">
	import * as m from '$lib/paraglide/messages';

	interface Props {
		currentPage: number;
		totalPages: number;
		onPageChange: (page: number) => void;
	}

	let { currentPage, totalPages, onPageChange }: Props = $props();
</script>

{#if totalPages > 1}
	<div class="flex justify-center mt-8">
		<div class="join shadow-sm">
			<button
				class="join-item btn btn-sm"
				disabled={currentPage === 1}
				onclick={() => onPageChange(currentPage - 1)}
			>
				«
			</button>

			{#each Array(totalPages) as _, index}
				<button
					class="join-item btn btn-sm {currentPage === index + 1 ? 'btn-primary' : 'btn-ghost'}"
					onclick={() => onPageChange(index + 1)}
				>
					{index + 1}
				</button>
			{/each}

			<button
				class="join-item btn btn-sm"
				disabled={currentPage === totalPages}
				onclick={() => onPageChange(currentPage + 1)}
			>
				»
			</button>
		</div>
	</div>
{/if}
