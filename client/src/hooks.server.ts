import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { getTextDirection } from '$lib/paraglide/runtime';
import { paraglideMiddleware } from '$lib/paraglide/server';

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) =>
				html
					.replace('%paraglide.lang%', locale)
					.replace('%paraglide.dir%', getTextDirection(locale))
		});
	});

let resolvedApiUrl: string | null = null;

/**
 * Dynamically resolves the internal backend API URL for server-side fetches.
 * Docker container: http://server_dev:3000/api
 * Host environment: http://localhost:3000/api
 */
async function getBackendApiUrl(): Promise<string> {
	if (resolvedApiUrl) return resolvedApiUrl;

	if (process.env.INTERNAL_API_URL) {
		resolvedApiUrl = process.env.INTERNAL_API_URL;
		return resolvedApiUrl;
	}

	const candidates: string[] = [];
	if (process.env.PUBLIC_API_URL && process.env.PUBLIC_API_URL.startsWith('http')) {
		candidates.push(process.env.PUBLIC_API_URL);
	}
	candidates.push('http://server_dev:3000/api');
	candidates.push('http://localhost:3000/api');

	for (const candidate of candidates) {
		try {
			const healthUrl = `${candidate.replace(/\/api$/, '')}/health`;
			const res = await fetch(healthUrl, { signal: AbortSignal.timeout(1500) });
			if (res.ok) {
				resolvedApiUrl = candidate;
				return candidate;
			}
		} catch {
			// continue to next candidate
		}
	}

	resolvedApiUrl = candidates[0];
	return resolvedApiUrl;
}

/**
 * Auth middleware — protects /admin/** routes.
 * Reads access_token from httpOnly cookie (set by backend on login/refresh).
 * If token expired → silently call /auth/refresh → set new cookie → continue.
 * If refresh fails → redirect to /login.
 */
const handleAuth: Handle = async ({ event, resolve }) => {
	const isAdminRoute = event.url.pathname.startsWith('/admin');
	const isLoginRoute =
		event.url.pathname === '/login' || event.url.pathname.match(/^\/[a-z]{2}\/login$/);

	// For non-admin and non-login routes, bypass auth check
	if (!isAdminRoute && !isLoginRoute) {
		return resolve(event);
	}

	const accessToken = event.cookies.get('access_token');
	const apiBase = await getBackendApiUrl();
	const cookieHeader = event.request.headers.get('cookie') ?? '';

	// --- Helper: verify token by calling /auth/me ---
	async function verifyToken(token: string) {
		try {
			const res = await fetch(`${apiBase}/auth/me`, {
				headers: {
					Authorization: `Bearer ${token}`,
					Cookie: cookieHeader
				}
			});
			if (res.ok) {
				const json = await res.json();
				return json.data ?? null;
			}
		} catch (err) {
			// network error
		}
		return null;
	}

	// --- Helper: try silent refresh ---
	async function tryRefresh(): Promise<{ user: unknown; newAccessToken: string; setCookieHeader: string | null } | null> {
		try {
			const res = await fetch(`${apiBase}/auth/refresh`, {
				method: 'POST',
				headers: {
					Cookie: cookieHeader
				}
			});
			if (res.ok) {
				const json = await res.json();
				const setCookieHeader = res.headers.get('set-cookie');
				return {
					user: json.data?.user ?? null,
					newAccessToken: json.data?.accessToken ?? '',
					setCookieHeader
				};
			}
		} catch (err) {
			// network error
		}
		return null;
	}

	let user: App.Locals['user'] | null = null;
	let refreshedCookieHeader: string | null = null;

	if (accessToken) {
		user = (await verifyToken(accessToken)) as App.Locals['user'] | null;
	}

	// Token expired or missing — try silent refresh via refresh_token cookie
	if (!user) {
		const refreshResult = await tryRefresh();
		if (refreshResult?.user) {
			user = refreshResult.user as App.Locals['user'];
			refreshedCookieHeader = refreshResult.setCookieHeader;
		}
	}

	if (user) {
		event.locals.user = user;
	}

	// Auth guard: protect /admin/**
	if (isAdminRoute && !event.locals.user) {
		return new Response(null, {
			status: 302,
			headers: { Location: '/login' }
		});
	}

	// Guest guard: redirect authenticated users away from /login
	if (isLoginRoute && event.locals.user) {
		return new Response(null, {
			status: 302,
			headers: { Location: '/admin/post' }
		});
	}

	const response = await resolve(event);

	// Forward new cookies from silent refresh to browser
	if (refreshedCookieHeader) {
		response.headers.append('set-cookie', refreshedCookieHeader);
	}

	return response;
};

export const handle: Handle = sequence(handleParaglide, handleAuth);
