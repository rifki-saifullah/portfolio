// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			/** Authenticated user, set by auth middleware */
			user?: {
				id: string;
				name: string;
				email: string;
			};
			/** JWT token from cookie or header */
			token?: string;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
