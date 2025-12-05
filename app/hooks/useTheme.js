'use client';

import { useState, useEffect, useCallback } from 'react';
import { getTheme, setTheme as saveTheme } from '../lib/storage';

export function useTheme() {
  const [theme, setThemeState] = useState('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setThemeState(getTheme());
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
    }
  }, [theme, mounted]);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setThemeState(newTheme);
    saveTheme(newTheme);
  }, [theme]);

  return {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
  };
}
