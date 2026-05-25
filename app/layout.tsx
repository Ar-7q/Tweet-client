import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "./providers";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Koo",
  description: "Tooting Sharing next app",
  icons: {
    icon: "/amy.png",
  },

  other: {
    "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
    <meta
      httpEquiv="Cross-Origin-Opener-Policy"
      content="same-origin-allow-popups"
    />
  </head>
      <body className={`${inter.className} min-h-full flex flex-col`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}