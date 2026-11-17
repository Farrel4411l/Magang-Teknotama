"use client";

import React, { useState, useEffect } from "react";
import { ExternalLink, Trophy, ShieldCheck, Sparkles, Flame, Play, Gamepad2, ArrowRight } from "lucide-react";
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

  // JSON-LD Schema untuk Homepage (WebSite & Publisher PT Teknotama Prakarsa Mulia)
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

      {/* 1. Hero Section & Showcase Ekosistem Teknotama */}
      <GameHero featuredGames={featuredGames} />

      {/* 2. Jelajahi Kategori Filter Chips */}
      <CategoryChips
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* 3. The Tekno Game Matrix Grid (2 Kolom Mobile, 3 Kolom Tablet, 4 Kolom Desktop) */}
      <GameGrid
        games={displayGames}
        title={
          selectedCategory === "all"
            ? "Semua Koleksi Game Tekno Game"
            : `Koleksi Game: ${selectedCategory.toUpperCase()}`
        }
      />

      {/* 4. Sorotan Papan Skor Terbaik (Leaderboard Highlight) */}
      <section className="mb-14 rounded-3xl card-elevated p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b border-[#255dce]/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8A0045] to-[#660033] flex items-center justify-center text-amber-300 shadow-md shrink-0">
              <Trophy className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-white">
                Sorotan Papan Skor &amp; Rekor Terbaik
              </h3>
              <p className="text-xs text-slate-300">
                Pencapaian skor tertinggi yang tercatat langsung pada perangkat Anda
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold text-cyan-300 bg-[#021861] px-3 py-1.5 rounded-xl border border-[#255dce]/40">
            Tersimpan Otomatis di Browser
          </span>
        </div>

        {topScores.length === 0 ? (
          <div className="py-8 text-center bg-[#010B2E]/60 rounded-2xl border border-[#255dce]/30">
            <p className="text-xs sm:text-sm text-slate-300">
              Belum ada skor yang dicatat. Mainkan salah satu game sekarang dan pecahkan rekor tertinggi Anda!
            </p>
            <div className="mt-3">
              <Link
                href="/play/nusantara-runner"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl btn-burgundy text-xs font-bold"
              >
                <span>Mulai Main Nusantara Runner</span>
                <Play className="w-3.5 h-3.5 fill-current" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {topScores.map((item, idx) => (
              <div
                key={item.gameId}
                className="p-4 rounded-2xl bg-[#010B2E]/80 border border-[#255dce]/40 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-7 h-7 rounded-lg bg-[#255dce]/30 text-cyan-300 text-xs font-black flex items-center justify-center shrink-0 border border-[#255dce]/40">
                    #{idx + 1}
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                      {item.title}
                    </h4>
                    <span className="text-xs font-extrabold text-amber-300 block">
                      {item.score.toLocaleString("id-ID")} poin
                    </span>
                  </div>
                </div>

                <Link
                  href={`/play/${item.slug}`}
                  className="p-2 rounded-xl btn-burgundy text-white shrink-0 hover:scale-105 transition-transform"
                  title="Mainkan game ini lagi"
                >
                  <Play className="w-3 h-3 fill-current" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. Section Branding & Visi Resmi Tekno Game */}
      <section className="rounded-3xl card-elevated p-6 sm:p-8 mb-8 relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#255dce]/30 text-cyan-300 border border-[#255dce]/50">
              PORTAL RESMI
            </span>
            <span className="text-xs text-slate-400 font-medium">teknotama.com/games</span>
          </div>

          <h2 className="font-heading text-xl sm:text-2xl font-bold text-white leading-snug">
            Tentang Tekno Game
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
            Tekno Game adalah portal game web HTML5 instan terkemuka yang dioperasikan sebagai sub-direktori resmi dari <strong className="text-white">PT Teknotama Prakarsa Mulia</strong> (<a href="https://teknotama.com" target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline font-semibold">teknotama.com</a>). Kami menghadirkan hiburan interaktif berkinerja tinggi yang dirancang khusus untuk kenyamanan pengguna tanpa perlu download atau instalasi aplikasi tambahan.
          </p>
        </div>
      </section>

      {/* 6. Section Sinergi Ekosistem & Solusi IT Teknotama */}
      <section className="mb-8 rounded-3xl bg-gradient-to-r from-[#021861] via-[#010B2E] to-[#255dce]/30 border border-[#255dce]/50 p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 text-left z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#255dce]/30 text-cyan-300 text-[11px] font-black uppercase tracking-wider border border-[#255dce]/50">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" />
            <span>PARTNER TEKNOLOGI RESMI</span>
          </div>
          <h3 className="font-heading text-lg sm:text-2xl font-bold text-white leading-tight">
            Akselerasi Bisnis &amp; Transformasi Digital Bersama Teknotama
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            PT Teknotama Prakarsa Mulia menghadirkan layanan perancangan infrastruktur jaringan, cloud system modern, keamanan siber dan data, serta pengembangan software kustom enterprise berkualitas tinggi.
          </p>
        </div>
        <div className="z-10 shrink-0 w-full md:w-auto">
          <a
            href="https://teknotama.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3.5 rounded-xl btn-sponsor text-xs sm:text-sm font-black text-white shadow-xl cursor-pointer"
          >
            <span>Kunjungi teknotama.com</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
