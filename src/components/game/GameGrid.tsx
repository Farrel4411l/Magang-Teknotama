import React from "react";
import { Game } from "@/types/game";
import GameCard from "./GameCard";
import AdNativeTile from "../ads/AdNativeTile";

interface GameGridProps {
  games: Game[];
  title?: string;
}

export default function GameGrid({ games, title = "Arena Game Populer" }: GameGridProps) {
  if (!games || games.length === 0) {
    return (
      <div className="py-16 text-center bg-[#0B1222] rounded-3xl border border-slate-800">
        <div className="text-5xl mb-3">🎮</div>
        <h3 className="text-base font-bold text-slate-200">Tidak ada game ditemukan</h3>
        <p className="text-xs text-slate-400 mt-1">Coba pilih kategori lain atau kata kunci pencarian yang berbeda.</p>
      </div>
    );
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.8)] inline-block" />
          <span>{title}</span>
          <span className="text-xs font-semibold text-slate-400 font-normal">
            ({games.length} game)
          </span>
        </h3>
      </div>

      {/* The Tekno Matrix Friv Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-3 sm:gap-4">
        {games.map((game, index) => {
          // Sisipkan slot native ad sponsor di index ke-8 (baris kedua)
          if (index === 7) {
            return (
              <React.Fragment key="sponsored-tile-1">
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
