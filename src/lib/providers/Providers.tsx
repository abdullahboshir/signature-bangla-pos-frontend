"use client";
import { store } from "@/redux/store/store";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Provider } from "react-redux";
import { AuthProvider } from "./AuthProvider";
import { ThemeSettingsProvider } from "./ThemeSettingsProvider";

const Providers = ({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) => {
  return (
    <Provider store={store}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem={true}
        disableTransitionOnChange
        {...props}
      >
        <ThemeSettingsProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeSettingsProvider>
      </NextThemesProvider>
    </Provider>
  );
};

export default Providers;
