"use client";

import React from "react";
import { Game } from "@/types/game";
import GameCard from "./GameCard";
import AdNativeTile from "../ads/AdNativeTile";
import { Gamepad2 } from "lucide-react";

interface GameGridProps {
  games: Game[];
  title?: string;
}

export default function GameGrid({
  games,
  title = "Katalog Game Pilihan",
}: GameGridProps) {
  if (!games || games.length === 0) {
    return (
      <div className="py-16 text-center rounded-3xl bg-gradient-to-b from-[#021861]/60 to-[#010B2E] border border-[#255dce]/40 p-8 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-[#021861] border border-[#255dce]/60 text-[#3b82f6] flex items-center justify-center mx-auto mb-4 shadow-md">
          <Gamepad2 className="w-8 h-8 text-cyan-400" />
        </div>
        <h3 className="font-heading text-lg font-bold text-white">
          Tidak Ada Game Ditemukan
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-sm mx-auto">
          Coba pilih kategori lain atau gunakan kolom pencarian untuk menemukan game favoritmu.
        </p>
      </div>
    );
  }

  return (
    <section className="mb-14">
      {/* Header Grid Section */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] shadow-[0_0_10px_rgba(56,189,248,0.8)] inline-block" />
          <h3 className="font-heading text-lg sm:text-xl font-bold tracking-tight text-white">
            {title}
          </h3>
          <span className="text-xs font-semibold text-slate-400 bg-[#021861] px-2.5 py-0.5 rounded-full border border-[#255dce]/30">
            {games.length} Game
          </span>
        </div>
      </div>

      {/* Grid Katalog Responsif 3 Ukuran Layar: Mobile (2 Kolom), Tablet (3 Kolom), Desktop (4 Kolom) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {games.map((game, index) => {
          // Sisipkan slot native ad sponsor di index ke-7 (menempati slot ke-8)
          if (index === 7) {
            return (
              <React.Fragment key="sponsored-tile-native">
                <GameCard game={game} />
                <AdNativeTile />
              </React.Fragment>
            );
          }
          return <GameCard key={game.id} game={game} />;
        })}
      </div>
    </section>
  );
}
