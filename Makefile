.PHONY: dev dev-d dev-down dev-down-v dev-logs seed db-push \
        prod prod-d prod-down prod-down-v prod-logs prod-seed prod-migrate

# ── Development ───────────────────────────────────────────────────────────────

dev:
	docker compose -f docker-compose.dev.yml up --build

dev-d:
	docker compose -f docker-compose.dev.yml up -d --build

dev-down:
	docker compose -f docker-compose.dev.yml down

dev-down-v:
	docker compose -f docker-compose.dev.yml down -v

dev-logs:
	docker compose -f docker-compose.dev.yml logs -f

db-push:
	docker compose -f docker-compose.dev.yml exec server_dev bun prisma db push

seed:
	docker compose -f docker-compose.dev.yml exec server_dev bun prisma/seed.ts

# ── Production ────────────────────────────────────────────────────────────────

prod:
	docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build

prod-down:
	docker compose -f docker-compose.prod.yml --env-file .env.prod down

prod-down-v:
	docker compose -f docker-compose.prod.yml --env-file .env.prod down -v

prod-logs:
	docker compose -f docker-compose.prod.yml logs -f

prod-migrate:
	docker compose -f docker-compose.prod.yml --env-file .env.prod exec server_prod bun prisma migrate deploy

prod-seed:
	docker compose -f docker-compose.prod.yml --env-file .env.prod exec server_prod bun prisma/seed.ts
