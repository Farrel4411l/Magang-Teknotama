"use client";

import React, { useState } from "react";
import { ExternalLink } from "lucide-react";
import GameHero from "@/components/game/GameHero";
import CategoryChips from "@/components/game/CategoryChips";
import GameGrid from "@/components/game/GameGrid";
import { INITIAL_GAMES } from "@/lib/games-data";
import { GameCategory } from "@/types/game";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<GameCategory>("all");

  const featuredGames = INITIAL_GAMES.filter((g) => g.featured);
  const displayGames =
    selectedCategory === "all"
      ? INITIAL_GAMES
      : INITIAL_GAMES.filter((g) => g.category === selectedCategory);

  return (
    <div className="pt-6">
      {/* 1. Hero Section (Cyber Spotlight: 1 Large + 2 Stacked) */}
      <GameHero featuredGames={featuredGames} />

      {/* 2. Jelajahi Kategori Filter Chips */}
      <CategoryChips
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* 3. The Tekno Matrix Game Grid */}
      <GameGrid
        games={displayGames}
        title={
          selectedCategory === "all"
            ? "Arena Game Populer"
            : `Kategori: ${selectedCategory.toUpperCase()}`
        }
      />

      {/* 4. Section Branding & Visi TeknoGame */}
      <section className="bg-[#0B1222] rounded-3xl border border-cyan-500/20 p-6 sm:p-8 mt-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <h2 className="text-lg sm:text-xl font-black text-white mb-2 flex items-center gap-2">
          <span>Selamat Datang di TeknoGame</span>
          <span className="text-xs font-bold uppercase tracking-widest bg-cyan-500/20 text-cyan-400 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
            PLAY. EVOLVE. CONQUER.
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
          TeknoGame adalah portal game web HTML5 instan terkemuka yang menghadirkan pengalaman bermain seru, modern, dan berkecepatan tinggi. Nikmati koleksi game aksi, petualangan, balap malam, strategi, dan puzzle asah otak terbaik secara gratis langsung di browsermu tanpa instalasi aplikasi tambahan!
        </p>
      </section>

      {/* 5. Section Promo & Solusi IT Teknotama */}
      <section className="mt-8 rounded-3xl bg-gradient-to-r from-blue-950/70 via-[#0B1222] to-cyan-950/50 border border-cyan-500/30 p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 text-left z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-[11px] font-black uppercase tracking-wider border border-cyan-500/40">
            <span>🌐 PARTNER TEKNOLOGI RESMI</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
            Akselerasi Bisnis &amp; Transformasi Digital Bersama Teknotama
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            PT Teknotama Prakarsa Mulia menghadirkan solusi infrastruktur jaringan, cloud computing, keamanan data, dan pengembangan aplikasi kustom enterprise berkinerja tinggi.
          </p>
        </div>
        <div className="z-10 shrink-0 w-full md:w-auto">
          <a
            href="https://teknotama.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 active:scale-95 text-slate-950 text-xs sm:text-sm font-black shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all cursor-pointer"
          >
            <span>Kunjungi teknotama.com</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
