import "./globals.css";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-manrope",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fikrimvaricmimarlik.com"),
  title: {
    default: "Hauzart",
    template: "%s | Hauzart"
  },
  description: "Hauzart - iç mimari tasarım, uygulama ve fitout management.",
  applicationName: "Hauzart",
  keywords: [
    "hauzart",
    "iç mimarlık",
    "interior design",
    "fitout management",
    "ankara iç mimarlık",
    "restaurant interior",
    "residential interior"
  ],
  authors: [{ name: "Hauzart" }],
  creator: "Hauzart",
  publisher: "Hauzart",
  openGraph: {
    title: "Hauzart",
    description: "İç mimari tasarım, uygulama ve fitout management.",
    url: "https://fikrimvaricmimarlik.com",
    siteName: "Hauzart",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Hauzart"
      }
    ],
    locale: "tr_TR",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Hauzart",
    description: "İç mimari tasarım, uygulama ve fitout management.",
    images: ["/og-image.jpg"]
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={manrope.variable}>
      <body>{children}</body>
    </html>
  );
}
