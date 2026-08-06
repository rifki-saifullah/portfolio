import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().default('3000').transform((v) => parseInt(v, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().default('6379').transform((v) => parseInt(v, 10)),
  REDIS_PASSWORD: z.string().optional().default(''),
  REDIS_DB: z.string().default('0').transform((v) => parseInt(v, 10)),

  PASETO_SECRET_KEY: z.string().min(1, 'PASETO_SECRET_KEY is required'),
  PASETO_PUBLIC_KEY: z.string().min(1, 'PASETO_PUBLIC_KEY is required'),
  ACCESS_TOKEN_EXPIRES_IN: z.string().default('15m'),
  REFRESH_TOKEN_EXPIRES_DAYS: z.string().default('7').transform((v) => parseInt(v, 10)),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),

  // Email & Turnstile Config
  SMTP_HOST: z.string().optional().default(''),
  SMTP_PORT: z.string().optional().default('587').transform((v) => parseInt(v, 10)),
  SMTP_USER: z.string().optional().default(''),
  SMTP_PASS: z.string().optional().default(''),
  SMTP_FROM: z.string().optional().default('noreply@rifki-saifullah.codes'),
  ADMIN_EMAIL: z.string().optional().default('admin@rifki-saifullah.codes'),
  TURNSTILE_SECRET_KEY: z.string().optional().default('')
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables');
}

export const config = parsed.data;
