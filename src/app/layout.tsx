import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#070B14",
};

export const metadata: Metadata = {
  title: "TeknoGame - Play. Evolve. Conquer.",
  description:
    "Portal game web HTML5 instan terkemuka! Mainkan ratusan game aksi, petualangan, balap, arcade, dan puzzle seru gratis tanpa install di TeknoGame.",
  keywords: [
    "teknogame",
    "game web",
    "game online gratis",
    "game friv",
    "game poki",
    "html5 games",
    "play evolve conquer",
    "free web games",
  ],
  authors: [{ name: "TeknoGame Studio" }],
  icons: {
    icon: [
      { url: "/game/teknogame-icon.png?v=3", type: "image/png" },
      { url: "/game/favicon.ico?v=3", sizes: "any" },
    ],
    shortcut: "/game/teknogame-icon.png?v=3",
    apple: "/game/teknogame-icon.png?v=3",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
    >
      <head>
        <link rel="icon" href="/game/teknogame-icon.png?v=3" type="image/png" />
        <link rel="shortcut icon" href="/game/teknogame-icon.png?v=3" type="image/png" />
        <link rel="apple-touch-icon" href="/game/teknogame-icon.png?v=3" />
      </head>
      <body className="min-h-full bg-[#070B14] text-[#F8FAFC]" suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
