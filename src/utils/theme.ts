export type AppTheme = 'medical' | 'dark' | 'light';

const THEME_STORAGE_KEY = 'nsn_app_theme';

export const getStoredTheme = (): AppTheme => {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light' || saved === 'medical') {
      return saved;
    }
  } catch {
    // fallback
  }
  return 'medical';
};

export const applyAppTheme = (theme: AppTheme) => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  } catch (err) {
    console.error('Error applying theme:', err);
  }
};
