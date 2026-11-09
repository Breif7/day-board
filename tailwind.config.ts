import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#fff7f8",
        panel: "#ffffff",
        border: "#f1dde1",
        accent: "#d96b85",
        ink: "#241f22",
      },
    },
  },
  plugins: [],
} satisfies Config;
