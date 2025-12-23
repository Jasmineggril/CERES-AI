import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "1rem",     /* Mais arredondado para um visual moderno */
        md: "0.75rem",
        sm: "0.5rem",
      },
      colors: {
        background: "hsl(120, 15%, 98%)", /* Um creme muito leve, quase branco */
        foreground: "hsl(140, 30%, 10%)", /* Verde quase preto para textos */
        border: "hsl(140, 20%, 90%)",
        input: "hsl(140, 20%, 90%)",
        primary: {
          DEFAULT: "#2d5a27", /* Verde Floresta Profundo (do seu PDF) */
          foreground: "#ffffff",
          border: "#1e3d1a",
        },
        secondary: {
          DEFAULT: "#e8f5e9", /* Verde menta muito claro para fundos de cards */
          foreground: "#2d5a27",
          border: "#c8e6c9",
        },
        accent: {
          DEFAULT: "#f57c00", /* Laranja terra para alertas de fogo */
          foreground: "#ffffff",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#1a2e1a",
          border: "#e0ede0",
        },
        sidebar: {
          DEFAULT: "#1a2e1a", /* Sidebar verde escuro elegante */
          foreground: "#e8f5e9",
          border: "#2d5a27",
        },
      },
      fontFamily: {
        /* Usando fontes que transmitem natureza e tecnologia simultaneamente */
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Outfit", "sans-serif"], 
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(45, 90, 39, 0.05)', /* Sombra verde sutil */
      }
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;