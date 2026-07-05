import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
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
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        jurisdictionFederal: {
          DEFAULT: "hsl(var(--jurisdiction-federal))",
          foreground: "hsl(var(--jurisdiction-federal-foreground))",
        },
        jurisdictionState: {
          DEFAULT: "hsl(var(--jurisdiction-state))",
          foreground: "hsl(var(--jurisdiction-state-foreground))",
        },
        jurisdictionCourt: {
          DEFAULT: "hsl(var(--jurisdiction-court))",
          foreground: "hsl(var(--jurisdiction-court-foreground))",
        },
        jurisdictionLocal: {
          DEFAULT: "hsl(var(--jurisdiction-local))",
          foreground: "hsl(var(--jurisdiction-local-foreground))",
        },
      },
      boxShadow: {
        panel: "0 16px 40px -24px rgb(15 23 42 / 0.38)",
      },
    },
  },
  plugins: [],
};

export default config;
