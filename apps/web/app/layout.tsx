import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "@workspace/ui/globals.css";
import { Providers } from "@workspace/ui/providers";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.dugble.com"),
  title: {
    default: "Dugble - Payments & Invoices, Simplified",
    template: "%s | Dugble",
  },
  description:
    "Dugble helps businesses accept payments, send invoices, and manage transactions securely.",
  authors: [{ name: "Kane Vidzro", url: "https://kanevidzro.com" }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Dugble - Payments & Invoices, Simplified",
    description:
      "Dugble helps businesses accept payments, send invoices, and manage transactions securely.",
    url: "https://www.dugble.com",
    siteName: "Dugble",
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
