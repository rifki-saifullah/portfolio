import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { config } from './config';
import { langMiddleware } from './middlewares/lang';
import { globalErrorHandler } from './middlewares/error';
import { authRoutes } from './modules/auth/auth.routes';
import { categoryRoutes } from './modules/category/category.routes';
import { postRoutes } from './modules/post/post.routes';
import { contactRoutes } from './modules/contact/contact.routes';

export const app = new Hono();

// Global Middlewares
app.use('*', logger());
app.use(
  '*',
  cors({
    origin: (origin) => {
      if (!origin) return config.CORS_ORIGIN;
      const origins = config.CORS_ORIGIN.split(',').map((o) => o.trim());
      if (origins.includes('*') || origins.includes(origin)) {
        return origin;
      }
      return origins[0];
    },
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept-Language']
  })
);
app.use('*', langMiddleware);

import { serveStatic } from 'hono/bun';
import { uploadRoutes } from './modules/upload/upload.routes';
import { userRoutes } from './modules/auth/user.routes';

// Serve uploaded static files
app.use('/uploads/*', serveStatic({ root: './' }));

// Health check endpoint
app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Register Module Routes
app.route('/api/auth', authRoutes);
app.route('/api/user', userRoutes);
app.route('/api/upload', uploadRoutes);
app.route('/api/categories', categoryRoutes);
app.route('/api/posts', postRoutes);
app.route('/api/contact', contactRoutes);

// Global Error Handler
app.onError(globalErrorHandler);

// Global 404 Handler
app.notFound((c) =>
  c.json(
    {
      success: false,
      code: 'NOT_FOUND',
      message: `Route ${c.req.method} ${c.req.path} tidak ditemukan.`
    },
    404
  )
);
