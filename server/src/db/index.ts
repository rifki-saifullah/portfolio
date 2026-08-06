import { PrismaClient } from '@prisma/client';

declare global {
  var prismaSingleton: PrismaClient | undefined;
}

export const db = globalThis.prismaSingleton ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaSingleton = db;
}
