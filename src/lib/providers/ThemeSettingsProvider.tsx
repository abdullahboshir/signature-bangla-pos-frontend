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
} from "@/redux/api/iam/userApi";

import { authKey } from "@/constant/authKey";

type ThemeSettings = {
  primary?: string;
  secondary?: string;
  radius?: number;
  fontScale?: number;
  buttonScale?: number;
  tableRowHeight?: number; // New setting
};

type ThemeSettingsContextType = {
  theme: ThemeSettings;
  isLoading: boolean;
  isSaving: boolean;
  updateTheme: (partial: ThemeSettings) => Promise<void>;
  resetTheme: () => Promise<void>;
  previewTheme: (partial: ThemeSettings) => void;
};

const ThemeSettingsContext = createContext<
  ThemeSettingsContextType | undefined
>(undefined);

const DEFAULT_THEME: ThemeSettings = {
  radius: 10,
  fontScale: 1,
  buttonScale: 1,
  tableRowHeight: 56, // Default comfortable height
};

function applyThemeToDocument(theme: ThemeSettings) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;

  if (theme.primary) {
    root.style.setProperty("--primary", theme.primary);
  } else {
    root.style.removeProperty("--primary");
  }

  if (theme.secondary) {
    root.style.setProperty("--secondary", theme.secondary);
  } else {
    root.style.removeProperty("--secondary");
  }

  if (theme.radius !== undefined && theme.radius !== null) {
    root.style.setProperty("--radius", `${Number(theme.radius)}px`);
  }

  if (theme.fontScale !== undefined && theme.fontScale !== null) {
    root.style.setProperty("--sb-font-scale", String(Number(theme.fontScale)));
  }

  if (theme.buttonScale !== undefined && theme.buttonScale !== null) {
    root.style.setProperty("--sb-button-scale", String(Number(theme.buttonScale)));
  }

  if (theme.tableRowHeight !== undefined && theme.tableRowHeight !== null) {
    root.style.setProperty("--table-row-height", `${Number(theme.tableRowHeight)}px`);
  } else {
    root.style.removeProperty("--table-row-height");
  }
}

import { usePathname } from "next/navigation";

export function ThemeSettingsProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.includes("/auth");
  const hasToken = typeof window !== 'undefined' ? document.cookie.includes(authKey) : false;

  const shouldSkip = !hasToken || isAuthPage;

  const {
    data,
    isLoading: loadingSettings,
  } = useGetSettingsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    skip: shouldSkip,
  });
  const [updateSettings, { isLoading: saving }] = useUpdateSettingsMutation();

  const initialTheme: ThemeSettings = useMemo(() => {
    // Try to extract from API response
    const raw = (data as any)?.data ?? data;
    const apiTheme = raw?.theme ?? raw?.uiTheme ?? {};

    // Try to get from localStorage as fallback
    let localTheme = {};
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("theme-settings");
        if (stored) {
          localTheme = JSON.parse(stored);
        }
      } catch (e) {
        console.error("Failed to parse theme from localStorage", e);
      }
    }

    // Merge: API data takes precedence over localStorage
    const mergedTheme = {
      ...DEFAULT_THEME,
      ...localTheme,
      ...apiTheme,
    };

    console.log("Theme loaded:", { apiTheme, localTheme, mergedTheme });

    return mergedTheme;
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

    // Save to localStorage immediately
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("theme-settings", JSON.stringify(next));
      } catch (e) {
        console.error("Failed to save theme to localStorage", e);
      }
    }

    try {
      await updateSettings({ theme: next }).unwrap();
      console.log("Theme saved to backend:", next);
    } catch (err) {
      // Silently ignore API failure but keep local theme
      console.error("Failed to update theme settings", err);
    }
  };

  const resetTheme = async () => {
    setTheme(DEFAULT_THEME);
    applyThemeToDocument(DEFAULT_THEME);

    // Save to localStorage
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("theme-settings", JSON.stringify(DEFAULT_THEME));
      } catch (e) {
        console.error("Failed to save theme to localStorage", e);
      }
    }

    try {
      await updateSettings({ theme: DEFAULT_THEME }).unwrap();
    } catch (err) {
      console.error("Failed to reset theme settings", err);
    }
  };

  const previewTheme = (partial: ThemeSettings) => {
    const next = { ...theme, ...partial };
    applyThemeToDocument(next);
  };

  return (
    <ThemeSettingsContext.Provider
      value={{
        theme,
        isLoading: loadingSettings,
        isSaving: saving,
        updateTheme,
        resetTheme,
        previewTheme,
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



