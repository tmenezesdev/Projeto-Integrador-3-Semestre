'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeCtx = createContext({ isDark: true, toggle: () => {} });

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('sb_theme');
    const html = document.documentElement;
    if (saved === 'light') {
      setIsDark(false);
      html.classList.remove('dark');
      html.classList.add('light-mode');
    } else {
      html.classList.add('dark');
      html.classList.remove('light-mode');
    }
  }, []);

  const toggle = () => {
    const html = document.documentElement;
    html.classList.add('theme-transitioning');
    setIsDark(prev => {
      const next = !prev;
      if (next) {
        html.classList.add('dark');
        html.classList.remove('light-mode');
        localStorage.setItem('sb_theme', 'dark');
      } else {
        html.classList.remove('dark');
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
