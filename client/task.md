# Portfolio SvelteKit — Task Tracker

## Phase 1 — Project Structure & Foundation
- [ ] Install dependencies (zod, msw)
- [ ] Create `src/lib/types/index.ts`
- [ ] Create `src/lib/types/api.ts`
- [ ] Create `src/lib/api/client.ts`
- [ ] Create `src/lib/api/interceptor.ts`
- [ ] Create `src/lib/api/endpoints.ts`
- [ ] Create `src/lib/stores/auth.ts`
- [ ] Create `src/lib/stores/toast.ts`
- [ ] Create `src/lib/stores/theme.ts`
- [ ] Create `src/lib/utils/route.ts`
- [ ] Create `src/lib/utils/format.ts`
- [ ] Create `src/lib/validators/auth.ts`
- [ ] Create `src/lib/validators/post.ts`
- [ ] Create `src/lib/validators/category.ts`
- [ ] Create `.env` and `.env.production`

## Phase 2 — Localization Completion
- [ ] Audit and update `messages/id.json`
- [ ] Audit and update `messages/en.json`
- [ ] Audit and update `messages/ja.json`

## Phase 3 — Component Refactor
- [ ] Unify Header (delete HeaderHomepage)
- [ ] Unify Footer (delete FooterHomepage)
- [ ] Create `ui/Breadcrumb.svelte`
- [ ] Create `ui/Toast.svelte`
- [ ] Create `ui/FormField.svelte`
- [ ] Create `ui/LangInput.svelte`
- [ ] Create `ui/Pagination.svelte`
- [ ] Create `ui/EmptyState.svelte`
- [ ] Create `ui/ConfirmDialog.svelte`
- [ ] Create `ui/LoadingSkeleton.svelte`
- [ ] Update ThemeController (persist)
- [ ] Update LangController (localized names)

## Phase 4 — Breadcrumb Integration
- [ ] Add breadcrumbs to all non-homepage layouts

## Phase 5 — Theme & UI Audit
- [ ] Audit all pages for hardcoded colors
- [ ] Fix `app.html` theme handling
- [ ] Add SEO meta tags to all pages
- [ ] Dark mode consistency check

## Phase 6 — API Abstraction Layer
- [ ] Create services (auth, post, category)
- [ ] Create MSW mock handlers
- [ ] Create mock data
- [ ] Create MSW browser worker setup

## Phase 7 — Authentication & Middleware
- [ ] Update `hooks.server.ts` with auth/guest middleware
- [ ] Update `app.d.ts` with App.Locals
- [ ] Refactor login page with validation
- [ ] Create login server action

## Phase 8 — Route Refactoring
- [ ] Update root layout (toast, MSW init, theme)
- [ ] Refactor homepage
- [ ] Refactor post list page
- [ ] Refactor post detail page
- [ ] Refactor admin layout
- [ ] Refactor admin category page
- [ ] Refactor admin post list page
- [ ] Refactor admin post create page
- [ ] Refactor admin post edit page

## Phase 9 — Testing
- [ ] Unit tests (utils, validators, stores, services)
- [ ] Component tests (Breadcrumb, Toast, FormField, etc.)
- [ ] Integration tests (auth flow, CRUD, mock API)
- [ ] Coverage verification (≥80%)

## Phase 10 — Docker & Documentation
- [ ] Create Dockerfile.dev
- [ ] Create Dockerfile.prod
- [ ] Create docker-compose.dev.yml
- [ ] Create docker-compose.prod.yml
- [ ] Write README.md
- [ ] Write BACKEND_SPECIFICATION.md
- [ ] Build verification
- [ ] Final walkthrough
