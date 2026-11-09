import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { cookies } from "next/headers";
import type { Metadata } from "next";
import c, { defaultTheme } from "config";

// Tri Nguyen: Title, description, and link preview for browser tabs, Google, and shared links. Tab icons come from icon.png, apple-icon.png, and favicon.ico in this folder.
// Tri Nguyen: metadataBase uses siteUrl from the config, so set siteUrl to the live domain or link previews will point at localhost.
export const metadata: Metadata = {
	metadataBase: new URL(c.siteUrl),
	title: {
		default: `${c.hackathonName} 27`,
		template: `%s | ${c.hackathonName} 27`,
	},
	description: c.defaultMetaDataDescription,
	openGraph: {
		type: "website",
		siteName: `${c.hackathonName} 27`,
		title: `${c.hackathonName} 27`,
		description: c.defaultMetaDataDescription,
		images: [{ url: c.icon.lg, width: 640, height: 640 }],
	},
	twitter: {
		card: "summary",
		title: `${c.hackathonName} 27`,
		description: c.defaultMetaDataDescription,
		images: [c.icon.lg],
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const theme = cookies().get("hk_theme")?.value || defaultTheme;
	return (
		<ClerkProvider>
			<html lang="en">
				<body className={theme === "dark" ? "dark" : ""}>
					{children}
				</body>
			</html>
		</ClerkProvider>
	);
}
