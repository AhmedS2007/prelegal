import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "'Times New Roman'", "serif"],
      },
      colors: {
        paper: "#fffdf8",
      },
      boxShadow: {
        document:
          "0 1px 3px rgba(0,0,0,0.05), 0 6px 20px rgba(0,0,0,0.09), 0 20px 60px rgba(0,0,0,0.13), 0 1px 0px rgba(255,255,255,0.6) inset",
      },
    },
  },
  plugins: [],
};
export default config;
