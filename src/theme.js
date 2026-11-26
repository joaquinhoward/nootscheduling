/**
 * Light / dark theme. The choice is saved in localStorage; with no saved
 * choice, the page follows the system setting. index.html applies the same
 * rule before React loads, so the page never flashes the wrong theme.
 */

export const THEME_KEY = 'theme'

/**
 * @param {string | null} stored value saved in localStorage
 * @param {boolean} prefersDark whether the system asks for dark mode
 * @returns {'light' | 'dark'}
 */
export function resolveTheme(stored, prefersDark) {
  if (stored === 'light' || stored === 'dark') return stored
  return prefersDark ? 'dark' : 'light'
}

export function currentTheme() {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

export function applyTheme(theme) {
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {
    // Storage can be blocked (private mode); the theme still applies for this visit.
  }
}
