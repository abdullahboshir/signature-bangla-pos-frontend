import { type Config } from "tailwindcss";
import fontFamily from "tailwindcss/defaultTheme";

const fontFamilyWithType: any = fontFamily;

const config: Config = {
  darkMode: ["class"] as any,
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Glatic", ...fontFamilyWithType.sans], // ✅ make Glatic default
      },
    },
  },
  plugins: [],
};

export default config;
