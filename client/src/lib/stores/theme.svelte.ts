const THEME_KEY = 'portfolio_theme';
const LIGHT_THEME = 'solarized-green';
const DARK_THEME = 'solarized-green-dark';

function createThemeStore() {
	let current = $state(LIGHT_THEME);

	/** Load theme from localStorage and apply to document */
	function initialize(): void {
		if (typeof window === 'undefined') return;

		const saved = localStorage.getItem(THEME_KEY);
		if (saved === LIGHT_THEME || saved === DARK_THEME) {
			current = saved;
		}
		applyTheme();
	}

	function toggle(): void {
		current = current === LIGHT_THEME ? DARK_THEME : LIGHT_THEME;
		localStorage.setItem(THEME_KEY, current);
		applyTheme();
	}

	function applyTheme(): void {
		if (typeof document === 'undefined') return;
		document.documentElement.setAttribute('data-theme', current);
	}

	return {
		get current() { return current; },
		get isDark() { return current === DARK_THEME; },
		LIGHT_THEME,
		DARK_THEME,
		initialize,
		toggle
	};
}

export const themeStore = createThemeStore();
