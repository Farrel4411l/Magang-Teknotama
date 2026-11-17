import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getGameBySlug, INITIAL_GAMES } from "@/lib/games-data";
import GameFrame from "@/components/game/GameFrame";
import AdCompanion from "@/components/ads/AdCompanion";
import GameCard from "@/components/game/GameCard";
import {
  ArrowLeft,
  Keyboard,
  Smartphone,
  Info,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

interface PlayPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return INITIAL_GAMES.map((game) => ({
    slug: game.slug,
  }));
}

export async function generateMetadata({
  params,
}: PlayPageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) {
    return {
      title: "Game Tidak Ditemukan | Tekno Game",
      robots: { index: false, follow: true },
    };
  }

  return {
    title: `${game.title} - Mainkan Gratis Tanpa Install di Tekno Game`,
    description: `${game.description} Mainkan langsung di browser secara gratis di portal resmi Tekno Game oleh PT Teknotama Prakarsa Mulia.`,
    alternates: {
      canonical: `/games/play/${game.slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    },
    openGraph: {
      title: `${game.title} - Tekno Game`,
      description: game.description,
      url: `https://teknotama.com/games/play/${game.slug}`,
      type: "video.other",
      images: [
        {
          url: "/games/Teknogame_logo_only.png",
          width: 800,
          height: 800,
          alt: game.title,
        },
      ],
    },
  };
}

export default async function PlayPage({ params }: PlayPageProps) {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) {
    notFound();
  }

  const relatedGames = INITIAL_GAMES.filter(
    (g) => g.id !== game.id && (g.category === game.category || g.featured)
  ).slice(0, 4);

  // JSON-LD Skema VideoGame & BreadcrumbList
  const jsonLdGame = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: game.title,
    description: game.description,
    genre: game.category,
    applicationCategory: "Game",
    operatingSystem: "Any Modern Web Browser (HTML5)",
    url: `https://teknotama.com/games/play/${game.slug}`,
    inLanguage: "id",
    author: {
      "@type": "Organization",
      name: "PT Teknotama Prakarsa Mulia",
      url: "https://teknotama.com",
    },
    publisher: {
      "@type": "Organization",
      name: "PT Teknotama Prakarsa Mulia",
      url: "https://teknotama.com",
    },
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Teknotama",
        item: "https://teknotama.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tekno Game",
        item: "https://teknotama.com/games",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: game.category.toUpperCase(),
        item: `https://teknotama.com/games/category/${game.category}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: game.title,
        item: `https://teknotama.com/games/play/${game.slug}`,
      },
    ],
  };

  return (
    <div className="pt-6 space-y-6">
      {/* Skrip Structured Data JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGame) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      {/* Navigasi Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-xs font-semibold text-slate-400"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-1 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Semua Game</span>
        </Link>
        <span>/</span>
        <Link
          href={`/category/${game.category}`}
          className="uppercase text-[#3b82f6] hover:text-cyan-300 font-bold transition-colors"
        >
          {game.category}
        </Link>
        <span>/</span>
        <span className="text-white font-bold truncate max-w-xs">{game.title}</span>
      </nav>

      {/* Tata Letak Gameplay: Layar Game + Sidebar Companion */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Kolom Kiri: Iframe Container (Span 3) */}
        <div className="xl:col-span-3 space-y-6">
          <GameFrame game={game} />

          {/* Kartu Informasi & Panduan Tombol Kendali */}
          <div className="rounded-3xl card-elevated p-6 shadow-xl space-y-4 text-slate-300">
            <div>
              <h3 className="font-heading text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Info className="w-4 h-4 text-cyan-400" />
                <span>Tentang {game.title}</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                {game.description}
              </p>
            </div>

            {/* Petunjuk Kontrol */}
            {game.controlsGuide && (
              <div className="pt-4 border-t border-[#255dce]/30">
                <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Keyboard className="w-3.5 h-3.5" />
                  <span>Petunjuk Kontrol Permainan</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {game.controlsGuide.keyboard && (
                    <div className="bg-[#010B2E] p-3.5 rounded-2xl border border-[#255dce]/40">
                      <span className="font-bold text-white flex items-center gap-1.5 mb-1.5">
                        <Keyboard className="w-3.5 h-3.5 text-[#3b82f6]" />
                        <span>Keyboard Komputer:</span>
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-slate-300">
                        {game.controlsGuide.keyboard.map((k, idx) => (
                          <li key={idx}>{k}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {game.controlsGuide.touch && (
                    <div className="bg-[#010B2E] p-3.5 rounded-2xl border border-[#255dce]/40">
                      <span className="font-bold text-white flex items-center gap-1.5 mb-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Layar Sentuh (Smartphone / Tablet):</span>
                      </span>
                      <p className="text-slate-300 leading-relaxed">
                        {game.controlsGuide.touch}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Companion Ad (300x250) + Showcase Sponsor Teknotama */}
        <div className="xl:col-span-1 space-y-6 flex flex-col items-center xl:items-start">
          <AdCompanion />

          {/* Kartu Promo Solusi IT Teknotama */}
          <div className="w-[300px] rounded-2xl card-elevated p-5 shadow-xl space-y-3">
            <span className="text-[10px] uppercase font-black bg-[#255dce]/30 text-cyan-300 px-2.5 py-0.5 rounded-full inline-block border border-[#255dce]/50">
              SPONSOR RESMI
            </span>
            <h4 className="font-heading text-sm font-bold leading-tight text-white">
              Solusi IT &amp; Transformasi Digital Enterprise
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Konsultasikan kebutuhan infrastruktur jaringan, sistem cloud, keamanan data, dan pembuatan aplikasi kustom bisnis bersama PT Teknotama Prakarsa Mulia.
            </p>
            <div className="pt-1">
              <a
                href="https://teknotama.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-2.5 text-center rounded-xl btn-sponsor text-xs font-black text-white shadow-md cursor-pointer"
              >
                <span>Kunjungi teknotama.com</span>
                <ExternalLink className="w-3.5 h-3.5 inline ml-1" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Rekomendasi Game Pilihan Lainnya */}
      <section className="pt-8">
        <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
          <span>Game Seru Lainnya Untuk Anda</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5">
          {relatedGames.map((g) => (
            <GameCard key={g.id} game={g} />
          ))}
        </div>
      </section>
    </div>
  );
}
