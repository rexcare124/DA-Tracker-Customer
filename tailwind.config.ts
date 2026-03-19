import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate"; // <--- 1. Import the plugin here

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        "dm-sans": [
          "DM Sans",
          "-apple-system",
          "Roboto",
          "Helvetica",
          "sans-serif",
        ],
        roboto: [
          "Roboto",
          "-apple-system",
          "Roboto",
          "Helvetica",
          "sans-serif",
        ],
        inter: ["Inter", "-apple-system", "Roboto", "Helvetica", "sans-serif"],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        brand: {
          red: "#971a1d",
          blue: "#2d4093",
          darkblue: "#262c5b",
        },
        // Place-picker design colors
        "main-bg": "#6A757A",
        "brand-red": "#971a1d",
        "text-gray": "#535862",
        "card-bg": "#FBFCFD",
        "tag-blue": "rgba(0, 0, 255, 0.60)",
        "tag-orange": "rgba(255, 165, 0, 0.60)",
        "tag-gray": "#AAA",
        "dot-gray": "#9CA3AF",
        "modal-bg": "#232D3E",
        "warning-bg": "#EBEDF0",
        primary: {
          "50": "#fcfcfc",
          "100": "#f1f1f2",
          "200": "#e0e0e2",
          "300": "#c7c7cc",
          "400": "#a8a8af",
          "500": "#82828b",
          "600": "#57575f",
          "700": "#27272a",
          "800": "#111113",
          "900": "#040405",
          "950": "#000000",
        },
        secondary: {
          "50": "#fefcfc",
          "100": "#fdf2f2",
          "200": "#fae1e1",
          "300": "#f6c9c9",
          "400": "#f1abab",
          "500": "#eb8686",
          "600": "#e45a5a",
          "700": "#dc2828",
          "800": "#7c1414",
          "900": "#400a0a",
          "950": "#2c0707",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      height: {
        screen_minus_top_nav: "[calc(100dvh-7rem)]", // 7rem is height of the top nav
      },
    },
  },
  // 2. Use the imported variable instead of require()
  plugins: [tailwindcssAnimate],
};
export default config;
