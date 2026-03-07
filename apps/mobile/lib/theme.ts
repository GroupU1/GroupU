import { useEffect } from 'react';
import { useColorScheme, useUnstableNativeVariable } from 'nativewind';

const fallbackTokens = {
  background: {
    light: '216 50% 98%',
    dark: '224 35% 7%',
  },
  foreground: {
    light: '224 30% 10%',
    dark: '216 20% 95%',
  },
  card: {
    light: '0 0% 100%',
    dark: '224 30% 11%',
  },
  border: {
    light: '216 20% 90%',
    dark: '224 15% 18%',
  },
  primary: {
    light: '225 75% 47%',
    dark: '225 70% 60%',
  },
  destructive: {
    light: '0 72% 51%',
    dark: '0 65% 55%',
  },
  'muted-foreground': {
    light: '220 15% 46%',
    dark: '220 12% 60%',
  },
} as const;

type ThemeScheme = 'light' | 'dark';
type ThemeToken = keyof typeof fallbackTokens;

function toHslColor(value: string) {
  return `hsl(${value})`;
}

function resolveThemeToken(
  token: ThemeToken,
  scheme: ThemeScheme,
  value: string | number | undefined,
) {
  return toHslColor(typeof value === 'string' && value ? value : fallbackTokens[token][scheme]);
}

export function useSyncSystemColorScheme() {
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme('system');
  }, [setColorScheme]);
}

export function useSemanticTheme() {
  const { colorScheme } = useColorScheme();
  const background = useUnstableNativeVariable('--background');
  const foreground = useUnstableNativeVariable('--foreground');
  const card = useUnstableNativeVariable('--card');
  const border = useUnstableNativeVariable('--border');
  const primary = useUnstableNativeVariable('--primary');
  const destructive = useUnstableNativeVariable('--destructive');
  const mutedForeground = useUnstableNativeVariable('--muted-foreground');

  const scheme: ThemeScheme = colorScheme === 'dark' ? 'dark' : 'light';

  return {
    colorScheme: scheme,
    isDark: scheme === 'dark',
    colors: {
      background: resolveThemeToken('background', scheme, background),
      foreground: resolveThemeToken('foreground', scheme, foreground),
      card: resolveThemeToken('card', scheme, card),
      border: resolveThemeToken('border', scheme, border),
      primary: resolveThemeToken('primary', scheme, primary),
      destructive: resolveThemeToken('destructive', scheme, destructive),
      mutedForeground: resolveThemeToken('muted-foreground', scheme, mutedForeground),
    },
  };
}
