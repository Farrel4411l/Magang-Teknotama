import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#021861",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://teknotama.com"),
  title: {
    default: "Tekno Game - Portal Game Web HTML5 Resmi PT Teknotama Prakarsa Mulia",
    template: "%s | Tekno Game",
  },
  description:
    "Portal resmi game web HTML5 instan persembahan PT Teknotama Prakarsa Mulia. Mainkan game petualangan, arcade, puzzle, dan aksi gratis langsung di browser tanpa instalasi.",
  keywords: [
    "Tekno Game",
    "game web",
    "game online gratis",
    "game html5 indonesia",
    "teknotama game",
    "PT Teknotama Prakarsa Mulia",
    "game browser gratis",
    "game tanpa install",
  ],
  authors: [{ name: "PT Teknotama Prakarsa Mulia", url: "https://teknotama.com" }],
  creator: "PT Teknotama Prakarsa Mulia",
  publisher: "PT Teknotama Prakarsa Mulia",
  alternates: {
    canonical: "/games",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/games/Teknogame_logo_only.png", type: "image/png" },
      { url: "/games/favicon.ico", sizes: "any" },
    ],
    shortcut: "/games/Teknogame_logo_only.png",
    apple: "/games/Teknogame_logo_only.png",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://teknotama.com/games",
    siteName: "Tekno Game",
    title: "Tekno Game - Portal Game Web HTML5 Resmi PT Teknotama Prakarsa Mulia",
    description:
      "Mainkan aneka game web HTML5 seru dan gratis di Tekno Game, sub-portal resmi PT Teknotama Prakarsa Mulia.",
    images: [
      {
        url: "/games/Teknogame_logo_only.png",
        width: 800,
        height: 800,
        alt: "Logo Resmi Tekno Game",
      },
    ],
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
      className={`${spaceGrotesk.variable} ${plusJakartaSans.variable} antialiased dark`}
    >
      <head>
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://teknotama.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://teknotama.com" />
        <link rel="icon" href="/games/Teknogame_logo_only.png" type="image/png" />
        <link rel="shortcut icon" href="/games/Teknogame_logo_only.png" type="image/png" />
        <link rel="apple-touch-icon" href="/games/Teknogame_logo_only.png" />
      </head>
      <body className="min-h-full text-[#F8FAFC]" suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
