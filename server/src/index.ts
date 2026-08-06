import { app } from './app';
import { config } from './config';

console.log(`🚀 Server berjalan di http://localhost:${config.PORT}`);

export default {
  port: config.PORT,
  fetch: app.fetch
};
