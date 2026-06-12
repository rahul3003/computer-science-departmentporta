export const applyCustomStyles = (settings) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  if (settings.theme === 'dark') {
    root.style.setProperty('--background', '#121212');
    root.style.setProperty('--foreground', '#faf7f2');
    root.style.setProperty('--card-bg', '#1e1e1e');
    root.style.setProperty('--card-border', '#2d2d2d');
    root.style.setProperty('--primary-brown', '#8d6e63');
    root.style.setProperty('--primary-brown-hover', '#a1887f');
    root.style.setProperty('--primary-brown-light', '#2d2522');
  } else if (settings.theme === 'light') {
    root.style.setProperty('--background', '#ffffff');
    root.style.setProperty('--foreground', '#2d1b18');
    root.style.setProperty('--card-bg', '#faf7f2');
    root.style.setProperty('--card-border', '#ede6dc');
    root.style.setProperty('--primary-brown', '#4a2c2a');
    root.style.setProperty('--primary-brown-hover', '#5d3a37');
    root.style.setProperty('--primary-brown-light', '#f3ede2');
  } else if (settings.theme === 'sepia') {
    root.style.setProperty('--background', '#f4ecd8');
    root.style.setProperty('--foreground', '#5b4636');
    root.style.setProperty('--card-bg', '#fdf6e3');
    root.style.setProperty('--card-border', '#e6dbbf');
    root.style.setProperty('--primary-brown', '#855c33');
    root.style.setProperty('--primary-brown-hover', '#9c6f42');
    root.style.setProperty('--primary-brown-light', '#fbf9f4');
  } else if (settings.theme === 'forest') {
    root.style.setProperty('--background', '#f1f6f0');
    root.style.setProperty('--foreground', '#1c301b');
    root.style.setProperty('--card-bg', '#f7faf6');
    root.style.setProperty('--card-border', '#dbe6da');
    root.style.setProperty('--primary-brown', '#2e5b2d');
    root.style.setProperty('--primary-brown-hover', '#3e753c');
    root.style.setProperty('--primary-brown-light', '#ebf2eb');
  } else if (settings.theme === 'custom') {
    root.style.setProperty('--background', settings.bgColor || '#ffffff');
    root.style.setProperty('--foreground', settings.textColor || '#2d1b18');
    root.style.setProperty('--card-bg', settings.cardBg || '#faf7f2');
    root.style.setProperty('--card-border', settings.cardBorder || '#ede6dc');
    root.style.setProperty('--primary-brown', settings.primaryColor || '#4a2c2a');
    root.style.setProperty('--primary-brown-hover', settings.primaryColorHover || '#5d3a37');
    root.style.setProperty('--primary-brown-light', settings.primaryColorLight || '#f3ede2');
  }

  // Apply custom font-family
  if (settings.fontFamily) {
    root.style.setProperty('--font-custom', settings.fontFamily);
  } else {
    root.style.removeProperty('--font-custom');
  }
};

export const getThemeSettings = () => {
  if (typeof window === 'undefined') return { theme: 'light' };
  const saved = localStorage.getItem('custom-theme-settings');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  const isDark = localStorage.getItem('theme-mode') === 'dark';
  return { theme: isDark ? 'dark' : 'light' };
};

export const setThemeSettings = (settings) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('custom-theme-settings', JSON.stringify(settings));
  // Keep theme-mode in sync for simple dark/light checks
  if (settings.theme === 'dark' || settings.theme === 'light') {
    localStorage.setItem('theme-mode', settings.theme);
  } else if (settings.theme === 'custom') {
    // If customized, choose dark/light based on background brightness (rough estimate)
    // to keep any fallback components happy
    localStorage.setItem('theme-mode', 'custom');
  }
  window.dispatchEvent(new Event('theme-settings-changed'));
};
