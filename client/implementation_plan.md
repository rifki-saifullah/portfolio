# Portfolio SvelteKit — Full Overhaul Implementation Plan

## Audit Summary

After thorough codebase review, here are the key findings:

### Current State
- **11 components** in `src/lib/components/` — flat structure, no subdirectories
- **7 routes**: `/`, `/login`, `/post`, `/post/[id]`, `/admin/post`, `/admin/post/create`, `/admin/post/[id]/edit`, `/admin/category`
- **No `src/lib/` subdirectories** for services, stores, types, validators, api, mocks, or utils
- **Paraglide** configured with `id`, `en`, `ja` — ~43 message keys exist
- **DaisyUI v5** with custom Solarized Green light/dark themes
- **Svelte 5** with runes mode enabled

### Critical Issues Found

| # | Issue | Location |
|---|-------|----------|
| 1 | **Hardcoded Indonesian text** throughout login, admin/category, admin/post, admin/post/create, admin/post/[id]/edit, post/[id] | Multiple pages |
| 2 | **Inconsistent message translations** — `en.json` has Indonesian text for `header_nav_home`, `header_nav_writer`, `homepage_about_description`; `ja.json` has Indonesian text for multiple keys | `messages/*.json` |
| 3 | **Duplicated Header/Footer** — `Header.svelte` vs `HeaderHomepage.svelte`, `Footer.svelte` vs `FooterHomepage.svelte` — nearly identical with minor nav differences | `src/lib/components/` |
| 4 | **Duplicated layout** — `post/+layout.svelte` and `admin/+layout.svelte` are identical | Routes |
| 5 | **Legacy Svelte 4 syntax** — `on:click` used in `post/+page.svelte` (should be `onclick`) | `post/+page.svelte` |
| 6 | **No auth middleware** — admin routes unprotected | `hooks.server.ts` |
| 7 | **No API layer** — all data is inline mock data | Everywhere |
| 8 | **No validation** — forms use only HTML `required` | Forms |
| 9 | **No breadcrumbs** on any page | All pages |
| 10 | **No stores** — no auth store, no toast store | `src/lib/` |
| 11 | **Business logic in components** — CRUD operations directly in page components | Admin pages |
| 12 | **Unused imports** — `Folder`, `Tag` imported but unused in category page | `admin/category` |
| 13 | **No error handling** — no toast system, no global error handler | Everywhere |
| 14 | **No tests** — only example test files exist | `src/lib/vitest-examples/` |
| 15 | **No Docker files** | Root |
| 16 | **No SEO** — missing meta descriptions, title tags hardcoded | All pages |
| 17 | **`storybook` config present** but not required — will keep but not focus on | Config |
| 18 | **Empty divs** for "3D hover effect" with no actual CSS implementation | Post pages |
| 19 | **`data-theme` hardcoded** in `app.html` — won't persist theme changes | `app.html` |
| 20 | **Missing `ja.json` / `en.json` translations** for post detail, admin pages | Messages |

---

> [!IMPORTANT]
> ## User Review Required
> 
> 1. **Backend API URL**: What will be the production backend URL? I'll use `PUBLIC_API_URL` env var — is that acceptable?
> 2. **Authentication**: The spec mentions JWT. Should the token be stored in `localStorage`, `cookie` (HttpOnly), or both? I recommend **HttpOnly cookie** set by backend + in-memory token for SPA, but localStorage is simpler for MVP.
> 3. **Storybook**: The project has Storybook configured. Should I keep it, or remove it to simplify the project?
> 4. **`jp` vs `ja`**: The inlang config uses `ja` for Japanese, but admin forms use `jp`. I'll standardize to `ja` throughout — is that correct?
> 5. **Novel/Post domain**: The content seems to be a **novel/fiction writing** platform (chapters, novels). Should I keep this domain or change it to a generic "blog" domain?
> 6. **Adapter**: Currently using `adapter-auto`. Should I switch to `adapter-node` for Docker deployment?

---

## Open Questions

> [!NOTE]
> - Should the public pages (`/post`, `/post/[id]`) also be protected or remain public?
> - Is there a preference for toast library (I plan to use a custom Svelte 5 toast store + DaisyUI alert styling)?
> - For MSW (Mock Service Worker) — should I use MSW v2 with the `msw/browser` worker approach?

---

## Proposed Changes

The implementation is divided into **10 phases** executed sequentially.

---

### Phase 1 — Project Structure & Foundation

Establish the clean architecture foundation before any feature work.

#### [NEW] `src/lib/types/index.ts`
Central type definitions: `ApiResponse`, `ApiError`, `PaginatedResponse`, `User`, `AuthTokens`, `Post`, `Category`, `ContentBlock`, `Lang`.

#### [NEW] `src/lib/types/api.ts`
HTTP-specific types: `RequestConfig`, `HttpMethod`, `ApiErrorCode`.

#### [NEW] `src/lib/api/client.ts`
HTTP client wrapper around `fetch`. Configurable base URL, automatic JSON handling, typed responses.

#### [NEW] `src/lib/api/interceptor.ts`
Global HTTP interceptor: Authorization header injection, Accept-Language header, error handling per HTTP status code (400→field errors, 401→logout+redirect, 403/404/409/429→toast, 500+→toast with fallback).

#### [NEW] `src/lib/api/endpoints.ts`
Centralized endpoint constants: `AUTH`, `POSTS`, `CATEGORIES`.

#### [NEW] `src/lib/stores/auth.ts`
Svelte 5 rune-based auth store: `user`, `token`, `isAuthenticated`, `login()`, `logout()`, `clearAuth()`.

#### [NEW] `src/lib/stores/toast.ts`
Toast notification store: `toasts[]`, `addToast()`, `removeToast()`, auto-dismiss. Supports `success`, `error`, `warning`, `info` types.

#### [NEW] `src/lib/stores/theme.ts`
Theme persistence store: reads/writes `data-theme` attribute, persists to `localStorage`.

#### [NEW] `src/lib/utils/route.ts`
Route utilities: `buildBreadcrumbs()`, `getRouteLabel()`, route path constants.

#### [NEW] `src/lib/utils/format.ts`
Formatting utilities: date formatting, text truncation.

#### [NEW] `src/lib/validators/auth.ts`
Zod schemas for login form validation with i18n error messages.

#### [NEW] `src/lib/validators/post.ts`
Zod schemas for post create/edit form validation.

#### [NEW] `src/lib/validators/category.ts`
Zod schemas for category CRUD validation.

#### [MODIFY] `package.json`
Add dependencies: `zod`, `msw` (dev).
Remove unused dev dependencies if identified.

---

### Phase 2 — Localization Completion (Task 3)

Comprehensive i18n coverage across all pages.

#### [MODIFY] `messages/id.json`
Add ~80+ new message keys covering: login page, admin pages, category CRUD, post CRUD, breadcrumbs, validation messages, dialogs, toasts, pagination, empty states, loading states, error states, form labels, placeholders, buttons.

#### [MODIFY] `messages/en.json`
Complete English translations for all keys. Fix existing keys with Indonesian text (`header_nav_home`, `header_nav_writer`, `homepage_about_description`, `list_post_*`, `detail_post_*`).

#### [MODIFY] `messages/ja.json`
Complete Japanese translations for all keys. Fix existing keys with Indonesian text (same as en.json issues + `homepage_about_description`).

---

### Phase 3 — Component Refactor (Task 4)

Consolidate duplicated components, create reusable ones.

#### [DELETE] `src/lib/components/HeaderHomepage.svelte`
#### [DELETE] `src/lib/components/FooterHomepage.svelte`
#### [DELETE] `src/lib/components/Hero.svelte`
#### [DELETE] `src/lib/components/Intern.svelte`
#### [DELETE] `src/lib/components/Portfolio.svelte`
#### [DELETE] `src/lib/components/Skills.svelte`
#### [DELETE] `src/lib/components/Contact.svelte`

#### [MODIFY] `src/lib/components/Header.svelte`
Refactor into a single unified header. Accept `variant` prop (`'homepage' | 'default'`) to handle different navigation sets. Remove duplicated GSAP code.

#### [MODIFY] `src/lib/components/Footer.svelte`
Refactor into a single unified footer. Accept `variant` prop. Show login/logout conditionally based on auth state.

#### [NEW] `src/lib/components/ui/Breadcrumb.svelte`
Auto-generated breadcrumb from current route. Uses DaisyUI breadcrumb styling. Supports localization. Responsive (collapses on mobile). Uses `$page.url.pathname` to generate crumbs.

#### [NEW] `src/lib/components/ui/Toast.svelte`
Toast notification container component. Reads from toast store. DaisyUI alert styling with auto-dismiss animation.

#### [NEW] `src/lib/components/ui/FormField.svelte`
Reusable form field wrapper: label, input slot, error message display. Supports real-time validation feedback.

#### [NEW] `src/lib/components/ui/LangInput.svelte`
Reusable multi-language input component (extracts the repeated language-switcher+input pattern from category/post forms into a single component).

#### [NEW] `src/lib/components/ui/Pagination.svelte`
Reusable pagination component (extracts repeated pagination from category and post pages).

#### [NEW] `src/lib/components/ui/EmptyState.svelte`
Reusable empty state with icon, title, description.

#### [NEW] `src/lib/components/ui/ConfirmDialog.svelte`
Reusable confirmation dialog (extracts repeated delete modals).

#### [NEW] `src/lib/components/ui/LoadingSkeleton.svelte`
Reusable skeleton loading component using DaisyUI's `skeleton` class. Supports variants: `text`, `card`, `table-row`, `form-field`, `avatar`. Accepts `lines`, `width`, `height` props for flexible placeholder layouts that match the shape of actual content.

#### [MODIFY] `src/lib/components/ThemeController.svelte`
Integrate with theme store for persistence.

#### [MODIFY] `src/lib/components/LangController.svelte`
Use localized language names from messages.

---

### Phase 4 — Breadcrumb Navigation (Task 1)

#### [NEW] `src/lib/components/ui/Breadcrumb.svelte`
(Created in Phase 3)

Implementation details:
- Parse `$page.url.pathname` into segments
- Map segments to localized labels using paraglide messages
- DaisyUI `breadcrumbs` component styling
- Home icon for root crumb
- Current page is non-clickable
- Responsive: truncate long labels on mobile

#### [MODIFY] All layouts except root `+layout.svelte`
Add `<Breadcrumb />` component after header, before main content.

---

### Phase 5 — Theme & UI Audit (Task 2)

#### [MODIFY] `src/routes/layout.css`
- Add status color content tokens if missing from DaisyUI v5
- Add utility classes for consistent spacing, typography

#### [MODIFY] `src/app.html`
- Remove hardcoded `data-theme`, let ThemeController manage it dynamically

#### [MODIFY] All page components
Audit and fix:
- Replace any hardcoded colors with DaisyUI tokens
- Ensure consistent `rounded-box` / `rounded-btn` usage
- Fix spacing inconsistencies
- Ensure dark mode works properly
- Add proper `<svelte:head>` with localized titles and meta descriptions

---

### Phase 6 — API Abstraction Layer (Task 5)

#### [NEW] `src/lib/services/auth.service.ts`
AuthService: `login()`, `logout()`, `getCurrentUser()`, `isAuthenticated()`.

#### [NEW] `src/lib/services/post.service.ts`
PostService: `getAll()`, `getById()`, `create()`, `update()`, `delete()`.

#### [NEW] `src/lib/services/category.service.ts`
CategoryService: `getAll()`, `create()`, `update()`, `delete()`.

#### [NEW] `src/lib/mocks/handlers/auth.ts`
MSW handlers for auth endpoints.

#### [NEW] `src/lib/mocks/handlers/post.ts`
MSW handlers for post CRUD endpoints.

#### [NEW] `src/lib/mocks/handlers/category.ts`
MSW handlers for category CRUD endpoints.

#### [NEW] `src/lib/mocks/data/posts.ts`
Mock post data with all three languages.

#### [NEW] `src/lib/mocks/data/categories.ts`
Mock category data.

#### [NEW] `src/lib/mocks/data/users.ts`
Mock user data.

#### [NEW] `src/lib/mocks/browser.ts`
MSW browser worker setup.

#### [NEW] `src/lib/mocks/handlers/index.ts`
Combined handler exports.

#### [NEW] `.env.development`
```
PUBLIC_API_URL=http://localhost:3000/api
PUBLIC_MOCK_API=true
```

#### [NEW] `.env.production.example`
```
PUBLIC_API_URL=https://api.example.com
PUBLIC_MOCK_API=false
```

---

### Phase 7 — Authentication & Middleware (Task 5 continued)

#### [MODIFY] `src/hooks.server.ts`
Add auth middleware using SvelteKit's `sequence()`:
- Check token for `/admin/**` routes → redirect to `/login` if invalid
- Check token for `/login` route → redirect to `/admin` if already authenticated

#### [MODIFY] `src/app.d.ts`
Extend `App.Locals` with `user` and `token` types.

#### [MODIFY] `src/routes/login/+page.svelte`
- Full localization
- Real-time Zod validation
- Connect to auth service
- Loading state
- Error display from backend

#### [NEW] `src/routes/login/+page.server.ts`
Server-side login action using SvelteKit form actions.

---

### Phase 8 — Route Refactoring (Tasks 1-5 combined)

#### [MODIFY] `src/routes/+layout.svelte`
- Add toast container
- Initialize MSW in dev mode
- Initialize theme from store

#### [NEW] `src/routes/(public)/+layout.svelte`
Layout group for public pages (post list, post detail) with Header + Footer.

#### [MODIFY] `src/routes/+page.svelte` (Homepage)
- Replace duplicated HeaderHomepage/FooterHomepage with unified Header/Footer
- Full localization audit
- Remove hardcoded role tags
- SEO meta tags

#### [MODIFY] `src/routes/post/+page.svelte`
- Full localization
- Connect to post service
- Loading/error states
- Fix legacy `on:click` to `onclick`

#### [MODIFY] `src/routes/post/[id]/+page.svelte`
- Full localization
- Connect to post service for data fetching
- Hardcoded content replaced with dynamic data

#### [MODIFY] `src/routes/admin/+layout.svelte`
- Add breadcrumb
- Add admin sidebar navigation (optional)

#### [MODIFY] `src/routes/admin/category/+page.svelte`
- Full localization
- Connect to category service
- Zod real-time validation
- Use reusable components (LangInput, Pagination, ConfirmDialog, EmptyState)
- Loading states

#### [MODIFY] `src/routes/admin/post/+page.svelte`
- Full localization
- Connect to post service
- Use reusable components

#### [MODIFY] `src/routes/admin/post/create/+page.svelte`
- Full localization
- Connect to post service
- Zod real-time validation
- Use reusable components (LangInput, FormField)

#### [MODIFY] `src/routes/admin/post/[id]/edit/+page.svelte`
- Full localization
- Connect to post service for loading existing data
- Zod real-time validation
- Use reusable components

---

### Phase 9 — Testing (Task: Testing)

#### [NEW] `src/lib/utils/__tests__/route.test.ts`
#### [NEW] `src/lib/utils/__tests__/format.test.ts`
#### [NEW] `src/lib/validators/__tests__/auth.test.ts`
#### [NEW] `src/lib/validators/__tests__/post.test.ts`
#### [NEW] `src/lib/validators/__tests__/category.test.ts`
#### [NEW] `src/lib/services/__tests__/auth.service.test.ts`
#### [NEW] `src/lib/services/__tests__/post.service.test.ts`
#### [NEW] `src/lib/services/__tests__/category.service.test.ts`
#### [NEW] `src/lib/stores/__tests__/auth.test.ts`
#### [NEW] `src/lib/stores/__tests__/toast.test.ts`
#### [NEW] `src/lib/api/__tests__/client.test.ts`
#### [NEW] `src/lib/api/__tests__/interceptor.test.ts`
#### [NEW] Component tests for Breadcrumb, Toast, FormField, Pagination, LangInput
#### [NEW] Integration tests for auth flow, CRUD flow, mock API

#### [MODIFY] `vite.config.ts`
Adjust test configuration, add coverage thresholds.

---

### Phase 10 — Docker & Documentation

#### [NEW] `Dockerfile.dev`
Node-based, hot reload with volume mounts, MSW active.

#### [NEW] `Dockerfile.prod`
Multi-stage build: Node build → nginx/node serve. Optimized.

#### [NEW] `docker-compose.dev.yml`
Frontend service with hot reload, environment variables for mock mode.

#### [NEW] `docker-compose.prod.yml`
Frontend service with configurable `PUBLIC_API_URL`.

#### [NEW] `README.md` (overwrite)
Complete frontend documentation with all required sections.

#### [NEW] `BACKEND_SPECIFICATION.md`
Complete backend spec enabling another AI agent to build the backend.

---

## Verification Plan

### Automated Tests
```bash
# Run unit + component + integration tests
npm run test:unit -- --run --coverage

# Type checking
npm run check

# Build verification
npm run build

# Lint
npm run lint
```

### Manual Verification
- Start dev server (`npm run dev`) and verify all routes
- Test theme switching (light/dark) persistence
- Test language switching (id/en/ja) on all pages
- Test breadcrumb navigation on all pages except `/`
- Test login flow with mock API
- Test category CRUD with mock API
- Test post CRUD with mock API
- Test responsive design on mobile/tablet/desktop viewports
- Verify Docker builds:
  ```bash
  docker-compose -f docker-compose.dev.yml up
  docker-compose -f docker-compose.prod.yml build
  ```

### Coverage Target
- Minimum 80% code coverage across all testable modules
- All validators: 100%
- All services: 90%+
- All stores: 90%+
- All utils: 100%
- Components: 70%+ (browser-dependent tests are slower)
