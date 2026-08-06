import type { User } from '$lib/types';

const AUTH_USER_KEY = 'portfolio_auth_user';

function createAuthStore() {
	let user = $state<User | null>(null);
	let initialized = $state(false);

	/**
	 * Load persisted user info from sessionStorage.
	 * Token is now stored in httpOnly cookie managed by the server.
	 */
	function initialize(): void {
		if (typeof window === 'undefined') return;

		const savedUser = sessionStorage.getItem(AUTH_USER_KEY);
		if (savedUser) {
			try {
				user = JSON.parse(savedUser) as User;
			} catch {
				clearAuth();
			}
		}
		initialized = true;
	}

	/** Set user state after successful login */
	function setAuth(newUser: User): void {
		user = newUser;
		// Persist user info (non-sensitive) across page reloads.
		// Token is in httpOnly cookie — not accessible here by design.
		sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
	}

	/** Clear auth state on logout or 401 */
	function clearAuth(): void {
		user = null;
		sessionStorage.removeItem(AUTH_USER_KEY);
	}

	return {
		get user() { return user; },
		get isAuthenticated() { return !!user; },
		get initialized() { return initialized; },
		initialize,
		setAuth,
		clearAuth
	};
}

export const authStore = createAuthStore();
