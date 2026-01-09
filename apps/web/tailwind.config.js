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
		"primary-50": "var(--color-primary)",
		"primary-100": "var(--color-primary)",
		"primary-200": "var(--color-primary)",
		"primary-300": "var(--color-primary)",
		"primary-400": "var(--color-primary)",
		"primary-500": "var(--color-primary)",
		"primary-2": "var(--color-primary-2)",
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
      backgroundImage: {
        "primary-gradient": "linear-gradient(to bottom right, var(--color-primary), var(--color-primary-2))",
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