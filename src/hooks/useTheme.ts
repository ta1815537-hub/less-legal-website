import { useState, useEffect } from 'react';

export function useTheme() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      // Explicitly default to Light/White theme
      return false;
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const themeColor = isDark ? '#080808' : '#F8FAFC';

    if (isDark) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
      localStorage.setItem('theme', 'light');
    }

    // Dynamically update browser theme-color meta tags for Android Chrome & mobile viewports
    const themeMetaTags = document.querySelectorAll('meta[name="theme-color"]');
    if (themeMetaTags.length > 0) {
      themeMetaTags.forEach((meta) => {
        meta.setAttribute('content', themeColor);
      });
    } else {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = themeColor;
      document.head.appendChild(meta);
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return { isDark, toggleTheme };
}
