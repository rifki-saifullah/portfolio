# 🐳 Docker Deployment & Development Guide (with Caddy & Aliases)

Dokumentasi ini menjelaskan cara menjalankan seluruh stack aplikasi (MySQL, Redis, Backend Server Bun/Hono, Frontend Client SvelteKit, dan Caddy Reverse Proxy) untuk **Development** dan **Production**.

File env utama ada di root repo: `.env.development.example` untuk template lokal, `.env.development` untuk nilai lokal aktif, dan `.env.production.example` untuk template produksi.

---

## ⚡ 1. Tabel Alias Perintah (Shortcuts)

Anda dapat menggunakan **`bun run <alias>`**, **`npm run <alias>`**, atau **`make <alias>`** dari root folder project:

| Perintah Alias (Bun / NPM) | Perintah Alias (`make`) | Perintah Lengkap Docker | Deskripsi |
| :--- | :--- | :--- | :--- |
| `bun run dev` | `make dev` | `docker compose -f docker-compose.dev.yml up --build` | Jalankan stack Dev (Foreground) |
| `bun run dev:d` | `make dev-d` | `docker compose -f docker-compose.dev.yml up -d --build` | Jalankan stack Dev (Background) |
| `bun run dev:down` | `make dev-down` | `docker compose -f docker-compose.dev.yml down` | Hentikan stack Dev |
| `bun run dev:logs` | `make dev-logs` | `docker compose -f docker-compose.dev.yml logs -f` | Cek log stack Dev |
| **`bun run dev:seed`** | **`make seed`** | **`docker compose -f docker-compose.dev.yml exec -it server_dev bun prisma/seed.ts`** | **Jalankan Database Seeder** |
| `bun run dev:db-push` | `make db-push` | `docker compose -f docker-compose.dev.yml exec -it server_dev bun prisma db push` | Push skema Prisma ke MySQL Dev |
| `bun run prod` | `make prod` | `docker compose -f docker-compose.prod.yml up -d --build` | Build & jalankan Prod + Caddy |
| `bun run prod:down` | `make prod-down` | `docker compose -f docker-compose.prod.yml down` | Hentikan stack Prod |

---

## 🔧 2. Solusi Error "Table `users` does not exist" saat Seeding

Secara otomatis, `server/Dockerfile.dev` kini mengeksekusi `bun prisma db push` setiap kali container dinyalakan.

Jika Anda ingin melakukan synchronisasi database/tabel secara manual sebelum seeding:

```bash
# Opsi 1: Menggunakan Alias Shortcut
bun run dev:db-push
bun run dev:seed

# Opsi 2: Menggunakan Make Shortcut
make db-push
make seed
```

---

## 🌐 3. Konfigurasi DNS A Record untuk VPS (Production)

Production memakai Caddy untuk HTTPS otomatis. Pastikan `DOMAIN` diisi dengan domain utama Anda saat menyalin `.env.production.example` menjadi `.env.production`.

| Host / Subdomain | Type | Target IP | Deskripsi |
| :--- | :--- | :--- | :--- |
| `@` (`rifki-saifullah.codes`) | `A` | `<IP_VPS_ANDA>` | Main Frontend Web App |
| `www` (`www.rifki-saifullah.codes`) | `A` | `<IP_VPS_ANDA>` | Main Frontend Web App (Alias) |
| `api` (`api.rifki-saifullah.codes`) | `A` | `<IP_VPS_ANDA>` | Backend API Server |
