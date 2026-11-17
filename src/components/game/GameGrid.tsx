"use client";

import React from "react";
import { Game } from "@/types/game";
import GameCard from "./GameCard";
import AdNativeTile from "../ads/AdNativeTile";

interface GameGridProps {
  games: Game[];
  title?: string;
}

export default function GameGrid({
  games,
  title = "Koleksi Game",
}: GameGridProps) {
  if (!games || games.length === 0) {
    return (
      <div className="py-16 text-center rounded-2xl card-natural p-8">
        <h3 className="font-heading text-base font-semibold text-white">
          Tidak Ada Game Ditemukan
        </h3>
        <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
          Coba pilih kategori lain atau gunakan pencarian untuk menemukan game yang Anda cari.
        </p>
      </div>
    );
  }

  return (
    <section className="mb-14">
      {/* Header Grid Section */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-heading text-lg font-bold text-white">
            {title}
          </h3>
          <span className="text-xs text-white/60 bg-white/10 px-2 py-0.5 rounded-md font-medium">
            {games.length}
          </span>
        </div>
      </div>

      {/* Grid Responsif: 2 Kolom Mobile, 3 Kolom Tablet, 4 Kolom Desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {games.map((game, index) => {
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
