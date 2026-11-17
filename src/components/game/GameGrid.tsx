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
  title = "Koleksi Permainan",
}: GameGridProps) {
  if (!games || games.length === 0) {
    return (
      <div className="card-natural rounded-2xl p-8 py-16 text-center">
        <h3 className="font-heading text-base font-semibold text-white">
          Permainan Tidak Ditemukan
        </h3>
        <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
          Coba pilih kategori lain atau gunakan pencarian untuk menemukan permainan yang Anda cari.
        </p>
      </div>
    );
  }

  return (
    <section id="catalog" className="mb-14 scroll-mt-28">
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="section-kicker mb-2">Pilih permainan</p>
          <h2 className="section-heading">{title}</h2>
        </div>
        <span className="w-fit rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-xs text-slate-400">
          {games.length} judul tersedia
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3.5 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
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
