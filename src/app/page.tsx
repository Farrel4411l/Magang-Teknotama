"use client";

import React, { useState } from "react";
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
    </div>
  );
}
