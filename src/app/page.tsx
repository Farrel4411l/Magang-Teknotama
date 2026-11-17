"use client";

import React, { useState, useEffect } from "react";
import { ExternalLink, Trophy, Play } from "lucide-react";
import GameHero from "@/components/game/GameHero";
import CategoryChips from "@/components/game/CategoryChips";
import GameGrid from "@/components/game/GameGrid";
import { INITIAL_GAMES } from "@/lib/games-data";
import { GameCategory } from "@/types/game";
import { getLocalScores } from "@/lib/local-storage";
import Link from "next/link";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<GameCategory>("all");
  const [topScores, setTopScores] = useState<
    { gameId: string; title: string; slug: string; score: number }[]
  >([]);

  useEffect(() => {
    const scores = getLocalScores();
    const parsed = Object.entries(scores)
      .map(([gameId, score]) => {
        const game = INITIAL_GAMES.find((g) => g.id === gameId);
        return {
          gameId,
          title: game?.title || gameId.replace(/-/g, " "),
          slug: game?.slug || gameId,
          score,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);

    setTopScores(parsed);
  }, []);

  const featuredGames = INITIAL_GAMES.filter((g) => g.featured);
  const displayGames =
    selectedCategory === "all"
      ? INITIAL_GAMES
      : INITIAL_GAMES.filter((g) => g.category === selectedCategory);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Tekno Game",
    alternateName: "Tekno Game Web Portal",
    url: "https://teknotama.com/games",
    description:
      "Portal game web HTML5 resmi persembahan PT Teknotama Prakarsa Mulia. Mainkan game seru gratis tanpa install.",
    publisher: {
      "@type": "Organization",
      name: "PT Teknotama Prakarsa Mulia",
      url: "https://teknotama.com",
      logo: "https://teknotama.com/games/Teknogame_logo_only.png",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: "https://teknotama.com/games/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div className="pt-6">
      {/* Skrip SEO JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Hero Section & Showcase Alami */}
      <GameHero featuredGames={featuredGames} />

      {/* 2. Jelajahi Kategori Filter Chips */}
      <CategoryChips
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* 3. The Tekno Game Catalog Grid (2 Kolom Mobile, 3 Kolom Tablet, 4 Kolom Desktop) */}
      <GameGrid
        games={displayGames}
        title={
          selectedCategory === "all"
            ? "Semua Koleksi Game"
            : `Koleksi Game: ${selectedCategory.toUpperCase()}`
        }
      />

      {/* 4. Rekor Skor Tertinggi Saya (Tersimpan Lokal di Browser) */}
      <section className="mb-14 rounded-2xl card-natural p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-amber-300 shrink-0">
              <Trophy className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-white">
                Rekor Skor Saya
              </h3>
              <p className="text-xs text-slate-300">
                Pencapaian skor Anda yang tersimpan di browser ini
              </p>
            </div>
          </div>
        </div>

        {topScores.length === 0 ? (
          <div className="py-8 text-center bg-white/[0.03] rounded-xl border border-white/10">
            <p className="text-xs sm:text-sm text-slate-300">
              Belum ada skor yang dicatat. Mainkan salah satu game sekarang untuk mulai mencatat skor terbaik Anda.
            </p>
            <div className="mt-3">
              <Link
                href="/play/nusantara-runner"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl btn-primary-clean text-xs font-semibold"
              >
                <span>Mainkan Nusantara Runner</span>
                <Play className="w-3.5 h-3.5 fill-current" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {topScores.map((item, idx) => (
              <div
                key={item.gameId}
                className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-6 h-6 rounded-md bg-white/10 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-white truncate">
                      {item.title}
                    </h4>
                    <span className="text-xs font-bold text-amber-300 block">
                      {item.score.toLocaleString("id-ID")} poin
                    </span>
                  </div>
                </div>

                <Link
                  href={`/play/${item.slug}`}
                  className="p-2 rounded-lg btn-primary-clean text-white shrink-0"
                  title="Mainkan lagi"
                >
                  <Play className="w-3 h-3 fill-current" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. Section Branding Resmi Tekno Game */}
      <section className="rounded-2xl card-natural p-6 sm:p-8 mb-8">
        <h2 className="font-heading text-lg sm:text-xl font-bold text-white mb-2">
          Tentang Tekno Game
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
          Tekno Game adalah portal game web HTML5 resmi yang dioperasikan sebagai sub-direktori dari <strong className="text-white">PT Teknotama Prakarsa Mulia</strong> (<a href="https://teknotama.com" target="_blank" rel="noopener noreferrer" className="text-rose-200 underline font-medium">teknotama.com</a>). Portal ini menyajikan berbagai game web instan yang dapat dimainkan secara gratis langsung melalui browser tanpa memerlukan instalasi aplikasi.
        </p>
      </section>

      {/* 6. Section Kemitraan Resmi Teknotama */}
      <section className="mb-8 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10 shadow-lg"
        style={{
          background: "linear-gradient(135deg, rgba(27, 37, 99, 0.75) 0%, rgba(80, 29, 90, 0.75) 60%, rgba(150, 18, 80, 0.8) 100%)"
        }}
      >
        <div className="space-y-1.5 text-left max-w-2xl">
          <span className="text-[11px] font-semibold text-rose-200 uppercase tracking-wide">
            Partner Teknologi Resmi
          </span>
          <h3 className="font-heading text-lg sm:text-xl font-bold text-white">
            Solusi Transformasi Digital Bersama PT Teknotama Prakarsa Mulia
          </h3>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            PT Teknotama Prakarsa Mulia menyediakan layanan infrastruktur jaringan, cloud system modern, keamanan data, serta pengembangan software kustom enterprise berkualitas tinggi.
          </p>
        </div>
        <div className="shrink-0 w-full md:w-auto">
          <a
            href="https://teknotama.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-5 py-2.5 rounded-xl btn-sponsor-clean text-xs sm:text-sm font-semibold shadow-md cursor-pointer"
          >
            <span>Kunjungi teknotama.com</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
