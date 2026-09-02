const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: "#080808",
          light: "#0B0B0B",
          card: "#111111",
        },
        primary: {
          DEFAULT: "#D50000",
          light: "#FF1A1A",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "var(--font-manrope)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 30px rgba(213, 0, 0, 0.6)",
        "glow-sm": "0 0 15px rgba(213, 0, 0, 0.5)",
        card: "0 10px 40px rgba(0, 0, 0, 0.6)",
      },
      keyframes: {
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-15px)" },
        },
        shine: {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(220%)" },
        },
        pulse: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "spin-slow": "spin-slow 20s linear infinite",
        float: "float 6s ease-in-out infinite",
        shine: "shine 1.6s ease-in-out infinite",
        pulse: "pulse 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;