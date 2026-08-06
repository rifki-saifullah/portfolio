import type { Context, Next } from 'hono';

export async function langMiddleware(c: Context, next: Next) {
  const acceptLang = c.req.header('Accept-Language');
  let lang = 'id';

  if (acceptLang) {
    if (acceptLang.includes('en')) {
      lang = 'en';
    } else if (acceptLang.includes('ja')) {
      lang = 'ja';
    } else if (acceptLang.includes('id')) {
      lang = 'id';
    }
  }

  c.set('lang', lang);
  await next();
}
