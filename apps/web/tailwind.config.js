/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			backgroundImage: {
				"gradient-radial":
					"radial-gradient(ellipse_at_center, var(--gradient-color-stops))",
			},
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
				nav: "hsl(var(--nav))",
				hackathon: "hsl(var(--hackathon-primary))",
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				sidebar: {
					DEFAULT: "hsl(var(--sidebar-background))",
					foreground: "hsl(var(--sidebar-foreground))",
					primary: "hsl(var(--sidebar-primary))",
					"primary-foreground":
						"hsl(var(--sidebar-primary-foreground))",
					accent: "hsl(var(--sidebar-accent))",
					"accent-foreground":
						"hsl(var(--sidebar-accent-foreground))",
					border: "hsl(var(--sidebar-border))",
					ring: "hsl(var(--sidebar-ring))",
				},
				// Tri Nguyen: CodeQuantum 27 storybook palette used by the sky schedule page.
				cq: {
					plum: "#68396B",
					ink: "#3D2340",
					title: "#4E2B4F",
					muted: "#6E5270",
					gold: "#D7A33D",
					parchment: "#F6ECD6",
					sand: "#EBDDBF",
					path: "#FFFDF3",
					rope: "#E2CC9C",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: {
						height: 0,
					},
					to: {
						height: "var(--radix-accordion-content-height)",
					},
				},
				"accordion-up": {
					from: {
						height: "var(--radix-accordion-content-height)",
					},
					to: {
						height: 0,
					},
				},
				// Tri Nguyen: Gentle up and down hover with a tiny tilt for dragons.
				"cq-float": {
					"0%, 100%": { transform: "translateY(0) rotate(0deg)" },
					"50%": { transform: "translateY(-12px) rotate(-1.5deg)" },
				},
				// Tri Nguyen: Slow sideways drift for the small background clouds.
				"cq-drift": {
					"0%, 100%": { transform: "translateX(0)" },
					"50%": { transform: "translateX(24px)" },
				},
				// Tri Nguyen: Soft bob so event clouds feel like they are floating.
				"cq-bob": {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-6px)" },
				},
				// Tri Nguyen: Fade and rise used when content first appears.
				"cq-rise": {
					from: { opacity: "0", transform: "translateY(24px)" },
					to: { opacity: "1", transform: "translateY(0)" },
				},
				// Tri Nguyen: Sword click swing. Winds back, strikes forward, then settles. Pivot is set on the element with origin-[...].
				"cq-sword-swing": {
					"0%": { transform: "rotate(0deg)" },
					"35%": { transform: "rotate(-40deg)" },
					"65%": { transform: "rotate(25deg)" },
					"100%": { transform: "rotate(0deg)" },
				},
				// Tri Nguyen: Staff click cast. Small tilt back then forward with a quick scale pulse.
				"cq-staff-cast": {
					"0%": { transform: "rotate(0deg) scale(1)" },
					"35%": { transform: "rotate(-15deg) scale(1)" },
					"65%": { transform: "rotate(10deg) scale(1.1)" },
					"100%": { transform: "rotate(0deg) scale(1)" },
				},
				// Tri Nguyen: Slash arc left at the click point. Fades in, grows, turns a little, fades out.
				"cq-slash": {
					"0%": { opacity: "0", transform: "scale(0.6) rotate(-15deg)" },
					"30%": { opacity: "1" },
					"100%": { opacity: "0", transform: "scale(1.15) rotate(10deg)" },
				},
				// Tri Nguyen: Magic burst at the click point. Grows, spins a quarter turn, fades out.
				"cq-spark": {
					"0%": { opacity: "1", transform: "scale(0.3) rotate(0deg)" },
					"100%": { opacity: "0", transform: "scale(1.4) rotate(45deg)" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"cq-float": "cq-float 7s ease-in-out infinite",
				"cq-float-slow": "cq-float 10s ease-in-out infinite",
				"cq-drift": "cq-drift 18s ease-in-out infinite",
				"cq-bob": "cq-bob 6s ease-in-out infinite",
				"cq-rise": "cq-rise 0.8s ease-out both",
				"cq-sword-swing": "cq-sword-swing 280ms ease-out",
				"cq-staff-cast": "cq-staff-cast 320ms ease-out",
				"cq-slash": "cq-slash 350ms ease-out forwards",
				"cq-spark": "cq-spark 450ms ease-out forwards",
			},
			fontFamily: {
				oswald: ["var(--font-oswald)"],
				grenze: ["var(--font-grenze)"],
				gotisch: ["var(--font-grenze-gotisch)"],
			},
		},
	},
	plugins: [
		require("tailwindcss-animate"),
		plugin(function ({ matchUtilities, theme }) {
			matchUtilities(
				{
					"translate-z": (value) => ({
						"--tw-translate-z": value,
						transform: ` translate3d(var(--tw-translate-x), var(--tw-translate-y), var(--tw-translate-z)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))`,
					}), // this is actual CSS
				},
				{ values: theme("translate"), supportsNegativeValues: true },
			);
		}),
	],
};
