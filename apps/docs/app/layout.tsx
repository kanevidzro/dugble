import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "@dugble/ui/globals.css";
import { Providers } from "@dugble/ui/providers";

const fontSans = Geist({
	subsets: ["latin"],
	variable: "--font-sans",
});

const fontMono = Geist_Mono({
	subsets: ["latin"],
	variable: "--font-mono",
});

export const metadata: Metadata = {
	metadataBase: new URL("https://docs.dugble.com"),
	title: {
		default: "Dugble Docs | Dugble",
		template: "%s | Dugble Docs",
	},
	description:
		"Official documentation for Dugble APIs, SDKs, payments, and integrations.",
	authors: [{ name: "Kane Vidzro", url: "https://kanevidzro.com" }],
	robots: {
		index: true,
		follow: true,
	},
	openGraph: {
		title: "Dugble Docs",
		description:
			"Official documentation for Dugble APIs, SDKs, payments, and integrations.",
		url: "https://docs.dugble.com",
		siteName: "Dugble Docs",
		type: "website",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}
			>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
