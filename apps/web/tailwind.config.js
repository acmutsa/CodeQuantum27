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
				// Tri Nguyen: Sword click. Tiny wind up, fast strike, then snaps straight back, like an attack in a game.
				"cq-sword-swing": {
					"0%, 100%": { transform: "rotate(0deg)" },
					"15%": { transform: "rotate(-18deg)" },
					"45%": { transform: "rotate(32deg)" },
				},
				// Tri Nguyen: Staff click. Same quick press with a small glow pulse at the end.
				"cq-staff-cast": {
					"0%, 100%": { transform: "rotate(0deg) scale(1)" },
					"40%": { transform: "rotate(-8deg) scale(0.88)" },
					"75%": { transform: "rotate(2deg) scale(1.06)" },
				},
				// Tri Nguyen: Slash sprite. Steps through the 4 frames in sword-slash.svg and ends on empty space, so it cuts in and out with no fading.
				"cq-slash": {
					from: { objectPosition: "0 0" },
					to: { objectPosition: "-256px 0" },
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
				"cq-sword-swing": "cq-sword-swing 170ms cubic-bezier(0.2, 0.9, 0.3, 1)",
				"cq-staff-cast": "cq-staff-cast 180ms ease-out",
				"cq-slash": "cq-slash 140ms steps(4, end) forwards",
				"cq-spark": "cq-spark 320ms ease-out forwards",
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
