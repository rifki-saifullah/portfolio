import { env } from '$env/dynamic/public';

/**
 * Format a date string into a locale-aware display format.
 */
export function formatDate(dateStr: string, locale: string = 'id'): string {
	try {
		const date = new Date(dateStr);
		return date.toLocaleDateString(locale === 'ja' ? 'ja-JP' : locale === 'en' ? 'en-US' : 'id-ID', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	} catch {
		return dateStr;
	}
}

/**
 * Truncate text to a maximum length with ellipsis.
 */
export function truncateText(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	return text.slice(0, maxLength).trimEnd() + '…';
}

/**
 * Resolve full image URL for relative upload paths.
 */
export function getImageUrl(path?: string): string {
	if (!path) return '';
	if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
		return path;
	}
	const apiBase = env.PUBLIC_API_URL || 'http://localhost:3000/api';
	const baseUrl = apiBase.replace(/\/api\/?$/, '');
	const cleanPath = path.startsWith('/') ? path : `/${path}`;
	return `${baseUrl}${cleanPath}`;
}
