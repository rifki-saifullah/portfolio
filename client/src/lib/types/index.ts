/** Supported content languages */
export type Lang = 'id' | 'en' | 'ja';

/** Multilingual text field — one value per supported language */
export interface LocalizedText {
	id: string;
	en: string;
	ja: string;
}

/** Authenticated user */
export interface User {
	id: string;
	name: string;
	email: string;
	avatarUrl?: string;
	saweriaUrl?: string;
	githubUrl?: string;
	linkedinUrl?: string;
	youtubeUrl?: string;
}

/** JWT authentication tokens */
export interface AuthTokens {
	accessToken: string;
}

/** Login credentials */
export interface LoginCredentials {
	email: string;
	password: string;
}

/** Blog/novel category */
export interface Category {
	id: number;
	name: LocalizedText;
	_count?: {
		posts: number;
	};
	createdAt?: string;
	updatedAt?: string;
}

/** Content block types for the post editor */
export type ContentBlockType = 'paragraph' | 'code' | 'rich-text' | 'image';

/** A single content block within a post */
export interface ContentBlock {
	id?: string;
	type: ContentBlockType;
	value: LocalizedText;
}

/** Blog post */
export interface Post {
	id: string;
	title: LocalizedText;
	categoryId: number;
	category?: Category | null;
	isDraft: boolean;
	youtubeId?: string;
	contentBlocks: ContentBlock[];
	createdAt?: string;
	updatedAt?: string;
}

/** Generic pagination metadata */
export interface PaginationMeta {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	perPage: number;
}

/** Paginated data wrapper */
export interface PaginatedData<T> {
	items: T[];
	meta: PaginationMeta;
}
