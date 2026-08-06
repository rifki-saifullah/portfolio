import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Nama minimal 2 karakter').max(100, 'Nama maksimal 100 karakter'),
  email: z.string().trim().email('Format email tidak valid'),
  subject: z.string().trim().min(3, 'Subjek minimal 3 karakter').max(200, 'Subjek maksimal 200 karakter'),
  message: z.string().trim().min(10, 'Pesan minimal 10 karakter').max(5000, 'Pesan maksimal 5000 karakter'),
  turnstileToken: z.string().optional(),
  website_hp: z.string().optional() // Honeypot field
});

export type ContactInput = z.infer<typeof contactSchema>;
