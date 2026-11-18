import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        lora: ["var(--font-lora)", "Georgia", "serif"],
        serif: ["var(--font-lora)", "Georgia", "serif"],
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#fdf2f2",
          100: "#fde8e8",
          200: "#fbd5d5",
          300: "#f8b4b4",
          400: "#f98080",
          500: "#e02424",
          600: "#c81e1e",
          700: "#9b1c1c",
          800: "#8B1E1E", // Primary Nâu đỏ Triều Châu / Trăm Rưỡi
          900: "#6B1414",
          950: "#450a0a",
        },
        gold: {
          400: "#e6b763",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          brass: "#C9963F", // Vàng đồng chuẩn Option A
        },
        tramruoi: {
          gold: "#C9963F", // Vàng đồng Option A
          cinnabar: "#8E1B24", // Đỏ son Option A
          dark: "#3A0910", // Đỏ thẫm / Đen đỏ Option A
        },
        surface: "#F8F9FA",
      },
      backgroundImage: {
        "radial-tramruoi": "radial-gradient(circle at center, #C9963F 0%, #8E1B24 55%, #3A0910 100%)",
        "radial-tramruoi-subtle": "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(201, 150, 63, 0.22), transparent 70%)",
        "linear-tramruoi": "linear-gradient(135deg, #3A0910 0%, #8E1B24 50%, #C9963F 100%)",
        "linear-tramruoi-bar": "linear-gradient(to right, #3A0910 0%, #8E1B24 40%, #C9963F 50%, #8E1B24 60%, #3A0910 100%)",
      },
      borderRadius: {
        "2xl": "16px",
      },
      boxShadow: {
        card: "0 2px 12px 0 rgba(0, 0, 0, 0.06)",
        "card-hover": "0 8px 24px 0 rgba(0, 0, 0, 0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
