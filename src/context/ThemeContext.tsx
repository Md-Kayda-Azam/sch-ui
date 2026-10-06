import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'light' | 'dark';
export type ColorTheme = 'blue' | 'emerald' | 'violet' | 'amber' | 'rose';

export interface ColorThemeOption {
  id: ColorTheme;
  name: string;
  swatch: string;
  lightColor: string;
  darkColor: string;
}

export const COLOR_THEMES: ColorThemeOption[] = [
  {
    id: 'blue',
    name: 'Ocean Blue',
    swatch: '#2563eb',
    lightColor: '#2563eb',
    darkColor: '#3b82f6',
  },
  {
    id: 'emerald',
    name: 'Emerald Green',
    swatch: '#059669',
    lightColor: '#059669',
    darkColor: '#10b981',
  },
  {
    id: 'violet',
    name: 'Royal Violet',
    swatch: '#7c3aed',
    lightColor: '#7c3aed',
    darkColor: '#8b5cf6',
  },
  {
    id: 'amber',
    name: 'Amber Gold',
    swatch: '#d97706',
    lightColor: '#d97706',
    darkColor: '#f59e0b',
  },
  {
    id: 'rose',
    name: 'Crimson Rose',
    swatch: '#e11d48',
    lightColor: '#e11d48',
    darkColor: '#f43f5e',
  },
];

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  colorTheme: ColorTheme;
  setColorTheme: (colorTheme: ColorTheme) => void;
  activeColorHex: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const applyThemeToDOM = (theme: Theme, colorTheme: ColorTheme) => {
  const root = document.documentElement;
  const body = document.body;
  const isDark = theme === 'dark';

  if (isDark) {
    root.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
    root.style.colorScheme = 'dark';
    if (body) {
      body.classList.add('dark');
      body.setAttribute('data-theme', 'dark');
    }
  } else {
    root.classList.remove('dark');
    root.setAttribute('data-theme', 'light');
    root.style.colorScheme = 'light';
    if (body) {
      body.classList.remove('dark');
      body.setAttribute('data-theme', 'light');
    }
  }

  root.setAttribute('data-color-theme', colorTheme);
  if (body) {
    body.setAttribute('data-color-theme', colorTheme);
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Independent theme state: strictly 'light' or 'dark'
  // Ignores browser/system theme completely
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('app_theme');
      return saved === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  const [colorTheme, setColorThemeState] = useState<ColorTheme>(() => {
    try {
      return (localStorage.getItem('app_color_theme') as ColorTheme) || 'blue';
    } catch {
      return 'blue';
    }
  });

  const isDark = theme === 'dark';

  // Apply dark or light theme strictly based on user selection
  useEffect(() => {
    applyThemeToDOM(theme, colorTheme);
    try {
      localStorage.setItem('app_theme', theme);
    } catch {}
  }, [theme, colorTheme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyThemeToDOM(newTheme, colorTheme);
    try {
      localStorage.setItem('app_theme', newTheme);
    } catch {}
  };

  const setColorTheme = (newColorTheme: ColorTheme) => {
    setColorThemeState(newColorTheme);
    applyThemeToDOM(theme, newColorTheme);
    try {
      localStorage.setItem('app_color_theme', newColorTheme);
    } catch {}
  };

  const activeColorOption = COLOR_THEMES.find((c) => c.id === colorTheme) || COLOR_THEMES[0];
  const activeColorHex = isDark ? activeColorOption.darkColor : activeColorOption.lightColor;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        setTheme,
        colorTheme,
        setColorTheme,
        activeColorHex,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
