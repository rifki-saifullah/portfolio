import * as m from '$lib/paraglide/messages';

export interface BreadcrumbItem {
	label: string;
	href: string;
	isCurrentPage: boolean;
}

/**
 * Route segment → localized label map.
 * Keys are URL path segments, values are paraglide message functions.
 */
const SEGMENT_LABELS: Record<string, () => string> = {
	admin: () => m.breadcrumb_admin(),
	post: () => m.breadcrumb_post(),
	category: () => m.breadcrumb_category(),
	create: () => m.breadcrumb_create(),
	edit: () => m.breadcrumb_edit(),
	login: () => m.breadcrumb_login(),
	profile: () => 'Profil Saya'
};

/** Check if a segment looks like a UUID — skip it in breadcrumbs */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Build breadcrumb items from a URL pathname.
 * Skips locale prefixes (id, en, ja) and the root segment.
 */
export function buildBreadcrumbs(pathname: string): BreadcrumbItem[] {
	const segments = pathname.split('/').filter(Boolean);

	// Remove locale prefix if present
	const locales = ['id', 'en', 'ja'];
	if (segments.length > 0 && locales.includes(segments[0])) {
		segments.shift();
	}

	if (segments.length === 0) return [];

	const crumbs: BreadcrumbItem[] = [
		{ label: m.breadcrumb_home(), href: '/', isCurrentPage: false }
	];

	let currentPath = '';
	segments.forEach((segment, index) => {
		currentPath += `/${segment}`;
		const isLast = index === segments.length - 1;

		// Skip raw UUID segments — they are not meaningful to users
		if (UUID_REGEX.test(segment)) {
			return;
		}

		const labelFn = SEGMENT_LABELS[segment];
		const label = labelFn ? labelFn() : decodeURIComponent(segment);

		crumbs.push({
			label,
			href: currentPath,
			isCurrentPage: isLast
		});
	});

	return crumbs;
}
