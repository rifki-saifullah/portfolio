import { Hono } from 'hono';
import { contactSchema } from './contact.schema';
import { ContactService } from './contact.service';
import { redis } from '../../db/redis';
import { config } from '../../config';

export const contactRoutes = new Hono();

// Helper verifikasi Cloudflare Turnstile Token
async function verifyTurnstileToken(token?: string, remoteIp?: string): Promise<boolean> {
  // Jika secret key tidak dikonfigurasi (misal di dev), izinkan pass-through
  if (!config.TURNSTILE_SECRET_KEY) {
    return true;
  }

  if (!token) {
    return false;
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', config.TURNSTILE_SECRET_KEY);
    formData.append('response', token);
    if (remoteIp) formData.append('remoteip', remoteIp);

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData
    });

    const outcome = (await res.json()) as { success: boolean };
    return outcome.success;
  } catch (err) {
    console.error('❌ Cloudflare Turnstile verification error:', err);
    return false;
  }
}

contactRoutes.post('/', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const clientIp = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || '127.0.0.1';

  // 1. Honeypot Validation (Spam Bot Protection)
  if (body.website_hp && body.website_hp.trim() !== '') {
    console.warn(`🤖 Spambot detected from IP: ${clientIp}`);
    // Silently return success to mislead the bot
    return c.json({
      success: true,
      message: 'Pesan Anda telah berhasil terkirim!'
    });
  }

  // 2. Redis Rate Limiter (Maksimal 3 request per 10 menit per IP)
  const rateLimitKey = `ratelimit:contact:${clientIp}`;
  const attempts = await redis.incr(rateLimitKey);

  if (attempts === 1) {
    await redis.expire(rateLimitKey, 600); // 10 menit
  }

  if (attempts > 3) {
    return c.json(
      {
        success: false,
        code: 'TOO_MANY_REQUESTS',
        message: 'Terlalu banyak mencoba mengirim pesan. Silakan coba lagi dalam 10 menit.'
      },
      429
    );
  }

  // 3. Cloudflare Turnstile Captcha Check
  const isTurnstileValid = await verifyTurnstileToken(body.turnstileToken, clientIp);
  if (!isTurnstileValid) {
    return c.json(
      {
        success: false,
        code: 'INVALID_CAPTCHA',
        message: 'Verifikasi keamanan Turnstile Captcha gagal. Silakan coba lagi.'
      },
      400
    );
  }

  // 4. Zod Input Validation
  const parseResult = contactSchema.safeParse(body);
  if (!parseResult.success) {
    return c.json(
      {
        success: false,
        code: 'VALIDATION_ERROR',
        message: 'Input pesan tidak valid.',
        errors: parseResult.error.flatten().fieldErrors
      },
      400
    );
  }

  // 5. Process Message (Save to DB & Send Email)
  const savedMessage = await ContactService.processContactMessage(parseResult.data, clientIp);

  return c.json(
    {
      success: true,
      data: {
        id: savedMessage.id,
        createdAt: savedMessage.createdAt
      },
      message: 'Pesan Anda berhasil terkirim. Terima kasih telah menghubungi!'
    },
    201
  );
});
