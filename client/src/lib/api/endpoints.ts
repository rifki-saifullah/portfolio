export const ENDPOINTS = {
	AUTH: {
		LOGIN: '/auth/login',
		LOGOUT: '/auth/logout',
		ME: '/auth/me'
	},
	USER: {
		PROFILE: '/user/profile',
		PUBLIC_PROFILE: '/user/public-profile',
		CHANGE_PASSWORD: '/user/change-password'
	},
	UPLOAD: {
		IMAGE: '/upload/image',
		AVATAR: '/upload/avatar'
	},
	POSTS: {
		BASE: '/posts',
		BY_ID: (id: string) => `/posts/${id}`
	},
	CATEGORIES: {
		BASE: '/categories',
		BY_ID: (id: number) => `/categories/${id}`
	}
} as const;
