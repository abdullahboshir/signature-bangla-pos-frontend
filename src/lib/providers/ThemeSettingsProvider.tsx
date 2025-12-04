"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from "@/redux/api/userApi";

type ThemeSettings = {
  primary?: string;
  secondary?: string;
  background?: string;
  foreground?: string;
  radius?: number;
  fontScale?: number;
};

type ThemeSettingsContextType = {
  theme: ThemeSettings;
  isLoading: boolean;
  isSaving: boolean;
  updateTheme: (partial: ThemeSettings) => Promise<void>;
};

const ThemeSettingsContext = createContext<
  ThemeSettingsContextType | undefined
>(undefined);

const DEFAULT_THEME: ThemeSettings = {
  primary: "oklch(0.205 0 0)",
  secondary: "oklch(0.97 0 0)",
  background: "oklch(92.571% 0.00106 11.689)",
  foreground: "oklch(0.145 0 0)",
  radius: 10,
  fontScale: 1,
};

function applyThemeToDocument(theme: ThemeSettings) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  if (theme.primary) root.style.setProperty("--primary", theme.primary);
  if (theme.secondary) root.style.setProperty("--secondary", theme.secondary);
  if (theme.background)
    root.style.setProperty("--background", theme.background);
  if (theme.foreground)
    root.style.setProperty("--foreground", theme.foreground);

  if (typeof theme.radius === "number") {
    root.style.setProperty("--radius", `${theme.radius}px`);
  }

  if (typeof theme.fontScale === "number") {
    root.style.setProperty("--sb-font-scale", String(theme.fontScale));
  }
}

export function ThemeSettingsProvider({ children }: { children: ReactNode }) {
  const {
    data,
    isLoading: loadingSettings,
  } = useGetSettingsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [updateSettings, { isLoading: saving }] = useUpdateSettingsMutation();

  const initialTheme: ThemeSettings = useMemo(() => {
    const raw = (data as any)?.data ?? data;
    const theme = raw?.theme ?? raw?.uiTheme ?? {};

    return {
      ...DEFAULT_THEME,
      ...theme,
    };
  }, [data]);

  const [theme, setTheme] = useState<ThemeSettings>(DEFAULT_THEME);

  useEffect(() => {
    setTheme(initialTheme);
    applyThemeToDocument(initialTheme);
  }, [initialTheme]);

  const updateTheme = async (partial: ThemeSettings) => {
    const next = { ...theme, ...partial };
    setTheme(next);
    applyThemeToDocument(next);

    try {
      await updateSettings({ theme: next }).unwrap();
    } catch (err) {
      // Silently ignore API failure but keep local theme
      console.error("Failed to update theme settings", err);
    }
  };

  return (
    <ThemeSettingsContext.Provider
      value={{
        theme,
        isLoading: loadingSettings,
        isSaving: saving,
        updateTheme,
      }}
    >
      {children}
    </ThemeSettingsContext.Provider>
  );
}

export function useThemeSettings() {
  const ctx = useContext(ThemeSettingsContext);
  if (!ctx) {
    throw new Error(
      "useThemeSettings must be used within a ThemeSettingsProvider"
    );
  }
  return ctx;
}


