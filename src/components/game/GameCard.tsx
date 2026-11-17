"use client";

import React from "react";
import Link from "next/link";
import { Game } from "@/types/game";
import {
  Play,
  Gamepad2,
  Compass,
  Puzzle,
  Zap,
  Coffee,
  Trophy,
} from "lucide-react";
import { getCategoryLabel } from "@/lib/games-data";

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  const getGameVectorIcon = (item: Game) => {
    switch (item.slug) {
      case "nusantara-runner":
      case "kapal-feri":
      case "lembah-bromo":
      case "pasar-terapung":
      case "kamus-kelana":
        return <Compass className="h-9 w-9 text-[#c2d1f6]" strokeWidth={1.6} />;
      case "packing-master":
      case "batik-flow":
        return <Puzzle className="h-9 w-9 text-sky-100" strokeWidth={1.6} />;
      case "becak-drift":
      case "werewolf":
        return <Zap className="h-9 w-9 text-amber-100" strokeWidth={1.6} />;
      case "candi-stacker":
      case "kopi-klotok":
      case "layangan-sanur":
        return <Coffee className="h-9 w-9 text-amber-100" strokeWidth={1.6} />;
      default:
        switch (item.category) {
          case "arcade":
            return <Gamepad2 className="h-9 w-9 text-[#c2d1f6]" strokeWidth={1.6} />;
          case "adventure":
            return <Compass className="h-9 w-9 text-emerald-100" strokeWidth={1.6} />;
          case "puzzle":
            return <Puzzle className="h-9 w-9 text-sky-100" strokeWidth={1.6} />;
          case "action":
            return <Zap className="h-9 w-9 text-amber-100" strokeWidth={1.6} />;
          case "casual":
            return <Coffee className="h-9 w-9 text-amber-100" strokeWidth={1.6} />;
          case "sports":
            return <Trophy className="h-9 w-9 text-emerald-100" strokeWidth={1.6} />;
          default:
            return <Gamepad2 className="h-9 w-9 text-blue-100" strokeWidth={1.6} />;
        }
    }
  };

  return (
    <Link
      href={`/play/${game.slug}`}
      data-tilt
      className="game-card group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0e1728] transition-all duration-200 hover:border-[#255dce]/50 hover:shadow-[0_16px_40px_rgba(0,0,0,0.28)]"
    >
      <div className="game-card-art" data-category={game.category}>
        <span className="absolute left-3 top-3 z-10 rounded-full border border-white/15 bg-[#07111f]/70 px-2.5 py-1 text-[0.62rem] font-semibold capitalize text-slate-100 backdrop-blur">
          {getCategoryLabel(game.category)}
        </span>
        <span className="game-icon-tile">
          {getGameVectorIcon(game)}
        </span>
        <span className="absolute bottom-3 right-3 z-10 grid h-8 w-8 place-items-center rounded-full border border-white/15 bg-[#07111f]/70 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
          <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <h4 className="line-clamp-1 text-sm font-bold text-white transition-colors group-hover:text-[#c2d1f6] sm:text-[0.95rem]">
          {game.title}
        </h4>
        <p className="mt-1.5 line-clamp-2 min-h-9 text-xs leading-5 text-slate-400">
          {game.description}
        </p>
        <div className="mt-3 flex items-center justify-between border-t border-white/[0.08] pt-3">
          <span className="font-mono text-[0.65rem] text-slate-500">
            {game.playCount.toLocaleString("id-ID")} kali dimainkan
          </span>
        </div>
      </div>
    </Link>
  );
}
