import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hauzart",
  description: "Interior design, implementation and fitout management."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
