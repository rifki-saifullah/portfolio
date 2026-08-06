import { z } from 'zod';
import * as m from '$lib/paraglide/messages';

export const loginSchema = () =>
	z.object({
		email: z
			.string()
			.min(1, m.validation_required({ field: m.login_email_label() }))
			.email(m.validation_email()),
		password: z
			.string()
			.min(1, m.validation_required({ field: m.login_password_label() }))
			.min(6, m.validation_min_length({ field: m.login_password_label(), min: '6' }))
	});

export type LoginFormData = z.infer<ReturnType<typeof loginSchema>>;
