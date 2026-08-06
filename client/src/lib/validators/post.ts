import { z } from 'zod';
import * as m from '$lib/paraglide/messages';

const titleLocalizedTextSchema = () =>
	z.object({
		id: z
			.string()
			.min(1, m.validation_required({ field: m.admin_post_title_label() }))
			.max(150, m.validation_max_length?.({ field: m.admin_post_title_label(), max: '150' }) || 'Maksimal 150 karakter.'),
		en: z
			.string()
			.max(150, m.validation_max_length?.({ field: m.admin_post_title_label(), max: '150' }) || 'Maksimal 150 karakter.')
			.optional()
			.default(''),
		ja: z
			.string()
			.max(150, m.validation_max_length?.({ field: m.admin_post_title_label(), max: '150' }) || 'Maksimal 150 karakter.')
			.optional()
			.default('')
	});

const localizedTextOptionalSchema = () =>
	z.object({
		id: z.string().max(10000, 'Maksimal 10000 karakter.').optional().default(''),
		en: z.string().max(10000, 'Maksimal 10000 karakter.').optional().default(''),
		ja: z.string().max(10000, 'Maksimal 10000 karakter.').optional().default('')
	});

export const postSchema = () =>
	z.object({
		title: titleLocalizedTextSchema(),
		categoryId: z
			.number({ required_error: m.admin_post_category_required?.() || 'Kategori wajib dipilih.' })
			.positive(m.admin_post_category_required?.() || 'Kategori wajib dipilih.'),
		isDraft: z.boolean().optional().default(false),
		youtubeId: z
			.string()
			.max(
				20,
				m.validation_max_length?.({ field: m.admin_post_youtube_label(), max: '20' }) ||
					'Maksimal 20 karakter.'
			)
			.optional()
			.default(''),
		contentBlocks: z.array(
			z.object({
				id: z.string().optional(),
				type: z.enum(['paragraph', 'code', 'rich-text', 'image']),
				value: localizedTextOptionalSchema()
			})
		)
	});

export type PostFormData = z.infer<ReturnType<typeof postSchema>>;
