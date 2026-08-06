import { z } from 'zod';
import * as m from '$lib/paraglide/messages';

export const categorySchema = () =>
	z.object({
		name: z.object({
			id: z
				.string()
				.min(1, m.validation_required({ field: m.category_name_label() }))
				.max(50, m.validation_max_length?.({ field: m.category_name_label(), max: '50' }) || 'Maksimal 50 karakter.'),
			en: z
				.string()
				.max(50, m.validation_max_length?.({ field: m.category_name_label(), max: '50' }) || 'Maksimal 50 karakter.')
				.optional()
				.default(''),
			ja: z
				.string()
				.max(50, m.validation_max_length?.({ field: m.category_name_label(), max: '50' }) || 'Maksimal 50 karakter.')
				.optional()
				.default('')
		})
	});

export type CategoryFormData = z.infer<ReturnType<typeof categorySchema>>;
