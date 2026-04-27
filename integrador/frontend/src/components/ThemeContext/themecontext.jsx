'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeCtx = createContext({ isDark: true, toggle: () => {} });

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('sb_theme');
    if (saved === 'light') {
      setIsDark(false);
      document.documentElement.classList.add('light-mode');
    }
  }, []);

  const toggle = () => {
    const html = document.documentElement;
    html.classList.add('theme-transitioning');
    setIsDark(prev => {
      const next = !prev;
      if (next) {
        html.classList.remove('light-mode');
        localStorage.setItem('sb_theme', 'dark');
      } else {
        html.classList.add('light-mode');
        localStorage.setItem('sb_theme', 'light');
      }
      return next;
    });
    setTimeout(() => html.classList.remove('theme-transitioning'), 650);
  };

  return <ThemeCtx.Provider value={{ isDark, toggle }}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => useContext(ThemeCtx);
