import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./hooks/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          primary: "#C9A84C",
          light: "#E8C97A",
          dark: "#9B7B2F",
          muted: "#C9A84C22"
        },
        black: {
          primary: "#0A0A0A",
          surface: "#111111",
          elevated: "#1A1A1A",
          border: "#2A2A2A"
        },
        white: {
          primary: "#FAFAFA",
          secondary: "#B0B0B0",
          muted: "#6B6B6B"
        },
        profit: "#00D084",
        loss: "#FF4444"
      },
      fontFamily: {
        body: ["var(--font-inter)", "Inter", "sans-serif"],
        display: ["var(--font-playfair)", "Playfair Display", "serif"]
      },
      boxShadow: {
        gold: "0 0 20px rgba(201, 168, 76, 0.3)",
        deep: "0 24px 80px rgba(0,0,0,0.45)"
      },
      borderRadius: {
        sw: "8px",
        modal: "16px"
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.16, 1, 0.3, 1)"
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 rgba(201,168,76,0.15)" },
          "50%": { boxShadow: "0 0 28px rgba(201,168,76,0.35)" }
        },
        flashGreen: {
          "0%": { backgroundColor: "rgba(0,208,132,0.18)" },
          "100%": { backgroundColor: "transparent" }
        }
      },
      animation: {
        marquee: "marquee 28s linear infinite",
        pulseGlow: "pulseGlow 2.5s ease-in-out infinite",
        flashGreen: "flashGreen 1.2s ease-out"
      }
    }
  },
  plugins: []
};

export default config;

