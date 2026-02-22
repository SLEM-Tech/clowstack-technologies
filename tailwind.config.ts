import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		// Updated to heroui path
		"./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				poppins: ["var(--font-poppins)", "sans-serif"],
			},
			colors: {
				transparent: "transparent",
				current: "currentColor",

				/* ========== Nestora Brand Foundation ========== */
				// The deep navy blue seen in the "Maintenance" banner
				brand: {
					navy: "#002D5B",
					blue: "#004B93", // Standard blue for buttons/icons
					light: "#E6F0F9", // Light blue for hover states/bg
				},

				background: "#FFFFFF", // Main site background
				surface: "#FFFFFF", // Product cards
				panel: "#FDFBFA", // The soft off-white/beige "Services" section
				dark: "#0A0A0A", // For high-contrast text and footers

				// Shop primary green – used for buttons, badges, highlights across all pages
				shop: {
					DEFAULT: "#3DBD7F",
					dark: "#2ea86f",
					light: "#e8f7f0",
				},

				primary: {
					100: "#3DBD7F", // Updated to shop green for consistency
					200: "#2ea86f",
					300: "#26905E",
					400: "#1e7a4f",
					DEFAULT: "#3DBD7F",
				},

				// Tech-focused Grays
				gray: {
					50: "#F9FAFB",
					100: "#F3F4F6",
					200: "#E5E7EB",
					300: "#D1D5DB",
					400: "#9CA3AF",
					500: "#6B7280",
					600: "#4B5563",
					700: "#374151",
					800: "#1F2937",
					900: "#111827",
				},

				// Standard E-commerce feedback colors
				success: {
					light: "#E6F9F0",
					DEFAULT: "#10B981",
					dark: "#059669",
				},
				danger: {
					light: "#FEF2F2",
					DEFAULT: "#EF4444",
					dark: "#DC2626",
				},

				// Accents
				accent: "#3DBD7F",
				price: "#1a1a1a", // Dark for price text
				whatsapp: "#25D366",
			},

			animation: {
				"spin-slow": "spin 8s linear infinite",
				"fade-in": "fadeIn 0.5s ease-in-out",
			},
			keyframes: {
				fadeIn: {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
			},
		},
		screens: {
			xs: "400px",
			xmd: "800px",
			slg: "999px",
			...require("tailwindcss/defaultTheme").screens,
		},
	},
	darkMode: "class",
	plugins: [
		heroui({
			themes: {
				light: {
					colors: {
						primary: {
							DEFAULT: "#3DBD7F",
							foreground: "#FFFFFF",
						},
						focus: "#2ea86f",
					},
				},
			},
		}),
	],
};
export default config;
