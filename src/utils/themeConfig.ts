// Theme configuration for Quest Forger
export type ThemeColor = 'purple' | 'blue' | 'green' | 'orange' | 'rose' | 'cyan';

export interface Theme {
  name: string;
  value: ThemeColor;
  description: string;
  preview: {
    primary: string;
    secondary: string;
    accent: string;
  };
  colors: {
    primary: string;
    primaryForeground: string;
    primaryGlow: string;
    primaryDark: string;
    primaryLight: string;
    secondary: string;
    secondaryForeground: string;
    secondaryGlow: string;
    accent: string;
    accentForeground: string;
    accentGlow: string;
    accentLight: string;
  };
}

export const themes: Theme[] = [
  {
    name: 'Purple Magic',
    value: 'purple',
    description: 'Original mystical purple theme',
    preview: {
      primary: '#a78bfa',
      secondary: '#fbbf24',
      accent: '#22c55e',
    },
    colors: {
      primary: '270 75% 65%',
      primaryForeground: '210 40% 98%',
      primaryGlow: '270 80% 75%',
      primaryDark: '270 75% 50%',
      primaryLight: '270 75% 80%',
      secondary: '43 96% 58%',
      secondaryForeground: '222 28% 7%',
      secondaryGlow: '43 100% 70%',
      accent: '142 72% 55%',
      accentForeground: '210 40% 98%',
      accentGlow: '142 80% 65%',
      accentLight: '142 72% 75%',
    },
  },
  {
    name: 'Ocean Blue',
    value: 'blue',
    description: 'Calm and focused blue theme',
    preview: {
      primary: '#3b82f6',
      secondary: '#fbbf24',
      accent: '#10b981',
    },
    colors: {
      primary: '217 91% 60%',
      primaryForeground: '210 40% 98%',
      primaryGlow: '217 91% 70%',
      primaryDark: '217 91% 45%',
      primaryLight: '217 91% 75%',
      secondary: '43 96% 58%',
      secondaryForeground: '222 28% 7%',
      secondaryGlow: '43 100% 70%',
      accent: '160 84% 39%',
      accentForeground: '210 40% 98%',
      accentGlow: '160 84% 49%',
      accentLight: '160 84% 60%',
    },
  },
  {
    name: 'Forest Green',
    value: 'green',
    description: 'Natural and energizing green theme',
    preview: {
      primary: '#22c55e',
      secondary: '#fbbf24',
      accent: '#06b6d4',
    },
    colors: {
      primary: '142 72% 55%',
      primaryForeground: '210 40% 98%',
      primaryGlow: '142 80% 65%',
      primaryDark: '142 72% 40%',
      primaryLight: '142 72% 70%',
      secondary: '43 96% 58%',
      secondaryForeground: '222 28% 7%',
      secondaryGlow: '43 100% 70%',
      accent: '189 94% 43%',
      accentForeground: '210 40% 98%',
      accentGlow: '189 94% 53%',
      accentLight: '189 94% 63%',
    },
  },
  {
    name: 'Sunset Orange',
    value: 'orange',
    description: 'Warm and motivating orange theme',
    preview: {
      primary: '#f97316',
      secondary: '#fbbf24',
      accent: '#ec4899',
    },
    colors: {
      primary: '24 95% 53%',
      primaryForeground: '210 40% 98%',
      primaryGlow: '24 95% 63%',
      primaryDark: '24 95% 38%',
      primaryLight: '24 95% 68%',
      secondary: '43 96% 58%',
      secondaryForeground: '222 28% 7%',
      secondaryGlow: '43 100% 70%',
      accent: '330 81% 60%',
      accentForeground: '210 40% 98%',
      accentGlow: '330 81% 70%',
      accentLight: '330 81% 75%',
    },
  },
  {
    name: 'Rose Pink',
    value: 'rose',
    description: 'Elegant and creative rose theme',
    preview: {
      primary: '#ec4899',
      secondary: '#fbbf24',
      accent: '#8b5cf6',
    },
    colors: {
      primary: '330 81% 60%',
      primaryForeground: '210 40% 98%',
      primaryGlow: '330 81% 70%',
      primaryDark: '330 81% 45%',
      primaryLight: '330 81% 75%',
      secondary: '43 96% 58%',
      secondaryForeground: '222 28% 7%',
      secondaryGlow: '43 100% 70%',
      accent: '258 90% 66%',
      accentForeground: '210 40% 98%',
      accentGlow: '258 90% 76%',
      accentLight: '258 90% 81%',
    },
  },
  {
    name: 'Cyber Cyan',
    value: 'cyan',
    description: 'Modern and tech-inspired cyan theme',
    preview: {
      primary: '#06b6d4',
      secondary: '#fbbf24',
      accent: '#a855f7',
    },
    colors: {
      primary: '189 94% 43%',
      primaryForeground: '210 40% 98%',
      primaryGlow: '189 94% 53%',
      primaryDark: '189 94% 28%',
      primaryLight: '189 94% 63%',
      secondary: '43 96% 58%',
      secondaryForeground: '222 28% 7%',
      secondaryGlow: '43 100% 70%',
      accent: '271 81% 66%',
      accentForeground: '210 40% 98%',
      accentGlow: '271 81% 76%',
      accentLight: '271 81% 81%',
    },
  },
];

export const getTheme = (color: ThemeColor): Theme => {
  return themes.find(t => t.value === color) || themes[0];
};

export const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  
  Object.entries(theme.colors).forEach(([key, value]) => {
    // Convert camelCase to kebab-case
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    root.style.setProperty(`--${cssKey}`, value);
  });
  
  // Store in localStorage
  localStorage.setItem('quest-forger-theme', theme.value);
};

export const getStoredTheme = (): ThemeColor => {
  const stored = localStorage.getItem('quest-forger-theme');
  return (stored as ThemeColor) || 'purple';
};

export const initializeTheme = () => {
  const storedTheme = getStoredTheme();
  const theme = getTheme(storedTheme);
  applyTheme(theme);
};
