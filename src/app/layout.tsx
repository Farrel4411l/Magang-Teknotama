import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";
import {
  GAME_BASE_PATH,
  getGamePortalUrl,
  SITE_URL,
} from "@/lib/site";

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
  themeColor: "#0B0E17",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Tekno Game - Portal Permainan Web HTML5 Resmi PT Teknotama Prakarsa Mulia",
    template: "%s | Tekno Game",
  },
  description:
    "Portal resmi permainan web HTML5 persembahan PT Teknotama Prakarsa Mulia. Mainkan petualangan, arkade, teka-teki, dan aksi gratis langsung di peramban tanpa instalasi.",
  keywords: [
    "Tekno Game",
    "permainan web",
    "permainan daring gratis",
    "permainan html5 indonesia",
    "Tekno Game Teknotama",
    "PT Teknotama Prakarsa Mulia",
    "permainan peramban gratis",
    "permainan tanpa instalasi",
  ],
  authors: [{ name: "PT Teknotama Prakarsa Mulia", url: "https://teknotama.com" }],
  creator: "PT Teknotama Prakarsa Mulia",
  publisher: "PT Teknotama Prakarsa Mulia",
  alternates: {
    canonical: GAME_BASE_PATH || "/",
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
    icon: [{ url: `${GAME_BASE_PATH}/Teknogame_logo_only.png`, type: "image/png" }],
    shortcut: `${GAME_BASE_PATH}/Teknogame_logo_only.png`,
    apple: `${GAME_BASE_PATH}/Teknogame_logo_only.png`,
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: getGamePortalUrl(),
    siteName: "Tekno Game",
    title: "Tekno Game - Portal Permainan Web HTML5 Resmi PT Teknotama Prakarsa Mulia",
    description:
      "Mainkan aneka permainan web HTML5 gratis di Tekno Game, sub-portal resmi PT Teknotama Prakarsa Mulia.",
    images: [
      {
        url: getGamePortalUrl("/Teknogame_logo_only.png"),
        width: 800,
        height: 800,
        alt: "Logo resmi Tekno Game",
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
      </head>
      <body className="min-h-full text-[#F8FAFC]" suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
