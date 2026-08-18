import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FFFFFF",
        grid: "#E5E8EB",
        ink: "#191F28",
        inkSoft: "#8B95A1",
        stamp: "#3182F6",
        stampSoft: "#E8F3FF",
        positive: "#00C471",
        negative: "#F04452",
        surface: "#F2F4F6",
      },
      fontFamily: {
        sans: ["var(--font-pretendard)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        card: "0 2px 8px rgba(25, 31, 40, 0.04)",
        cardHover: "0 4px 16px rgba(25, 31, 40, 0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
