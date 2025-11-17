"use client";
import { store } from "@/redux/store/store";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Provider } from "react-redux";

const Providers = ({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) => {
  return (
    <Provider store={store}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        {...props}
      >
        {children}
      </NextThemesProvider>
    </Provider>
  );
};

export default Providers;
