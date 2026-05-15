import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "./providers";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Koo",
  description: "Blogging Shairng next app",
  icons: {
    icon: "/amy.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${inter.className} min-h-full flex flex-col`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}