import React, { createContext, useContext, useState, useEffect } from 'react';

const THEMES = [
  {
    id: 'obsidian-cyan',
    name: 'Obsidian Cyan',
    tagline: 'Technical • Forensic (Default)',
    swatches: ['#06080A', '#00E5FF', '#0A84FF'],
    accentColor: '#00E5FF',
    isDark: true
  },
  {
    id: 'midnight-violet',
    name: 'Midnight Violet',
    tagline: 'Research • Intelligence',
    swatches: ['#090B14', '#C084FC', '#818CF8'],
    accentColor: '#C084FC',
    isDark: true
  },
  {
    id: 'graphite-emerald',
    name: 'Graphite Emerald',
    tagline: 'Analytical • Security',
    swatches: ['#060B08', '#10B981', '#059669'],
    accentColor: '#10B981',
    isDark: true
  },
  {
    id: 'arctic-sapphire',
    name: 'Arctic Sapphire',
    tagline: 'Academic • Clean (Light)',
    swatches: ['#F8FAFC', '#0284C7', '#2563EB'],
    accentColor: '#0284C7',
    isDark: false
  }
];

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    try {
      const saved = localStorage.getItem('stringxpert_theme');
      if (saved && THEMES.some(t => t.id === saved)) {
        return saved;
      }
    } catch (e) {
      // localStorage may be unavailable in some restricted environments
    }
    return 'obsidian-cyan';
  });

  const setTheme = (themeId) => {
    if (THEMES.some(t => t.id === themeId)) {
      setThemeState(themeId);
      try {
        localStorage.setItem('stringxpert_theme', themeId);
      } catch (e) {}
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const currentThemeObj = THEMES.find(t => t.id === theme) || THEMES[0];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES, currentThemeObj }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
