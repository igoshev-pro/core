import {heroui} from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './packages/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        gray: "var(--color-gray)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      boxShadow: {
				custom: "0 8px 30px rgba(0,0,0,0.3)",
				"custom-light": "0 8px 30px rgba(0,0,0,0.1)",
			},
    },
  },
  darkMode: "class",
  plugins: [heroui({
    defaultTheme: "light",
    themes: {
				light: {
					colors: {
						primary: {
							DEFAULT: "var(--color-primary)",
							foreground: "#FFFFFF",
						},
						focus: "var(--color-primary)",
            			// secondary: {
						// 	DEFAULT: "#333F4E",
						// 	foreground: "#FFFFFF",
						// },
						// focus: "#333F4E",
					},
				},
				dark: {
					colors: {
						primary: {
							DEFAULT: "var(--color-primary)",
							foreground: "#FFFFFF",
						},
						focus: "var(--color-primary)",
					},
				},
			},
  })],
}

module.exports = config;