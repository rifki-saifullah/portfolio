# Portfolio

Project portfolio full-stack dengan frontend SvelteKit, backend Bun/Hono, dan Docker untuk development maupun production.

## Struktur Singkat

- `client/` - aplikasi frontend SvelteKit
- `server/` - API backend Bun/Hono
- `docker-compose.dev.yml` - stack lokal
- `docker-compose.prod.yml` - stack production dengan Caddy

## Env

Root repo memakai tiga file utama:

- `.env.development.example` - template env lokal
- `.env.development` - env lokal aktif
- `.env.production.example` - template env produksi

File env lama di `client/` dan `server/` sudah dihapus supaya sumber konfigurasi tidak terpecah.

## Menjalankan

Development:

```bash
make dev
```

Production:

```bash
make prod
```

## Dokumentasi Tambahan

- [Docker guide](README.docker.md)
- [Backend env example](server/src/config/index.ts)
