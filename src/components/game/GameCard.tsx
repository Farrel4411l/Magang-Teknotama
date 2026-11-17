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

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  const getGameVectorIcon = (game: Game) => {
    switch (game.slug) {
      case "nusantara-runner":
      case "kapal-feri":
      case "lembah-bromo":
      case "pasar-terapung":
      case "kamus-kelana":
        return <Compass className="w-10 h-10 text-cyan-200" />;
      case "packing-master":
      case "batik-flow":
        return <Puzzle className="w-10 h-10 text-sky-200" />;
      case "becak-drift":
      case "werewolf":
        return <Zap className="w-10 h-10 text-amber-200" />;
      case "candi-stacker":
      case "kopi-klotok":
      case "layangan-sanur":
        return <Coffee className="w-10 h-10 text-rose-200" />;
      default:
        switch (game.category) {
          case "arcade":
            return <Gamepad2 className="w-10 h-10 text-cyan-200" />;
          case "adventure":
            return <Compass className="w-10 h-10 text-emerald-200" />;
          case "puzzle":
            return <Puzzle className="w-10 h-10 text-sky-200" />;
          case "action":
            return <Zap className="w-10 h-10 text-rose-200" />;
          case "casual":
            return <Coffee className="w-10 h-10 text-amber-200" />;
          case "sports":
            return <Trophy className="w-10 h-10 text-yellow-200" />;
          default:
            return <Gamepad2 className="w-10 h-10 text-blue-200" />;
        }
    }
  };

  return (
    <Link
      href={`/play/${game.slug}`}
      className="group relative rounded-2xl overflow-hidden card-natural flex flex-col justify-between aspect-square select-none cursor-pointer p-4 transition-all duration-200"
    >
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-black/30 group-hover:from-white/[0.08] transition-colors" />

      {/* Top Header: Hanya Kategori (Tanpa Rating & Tanpa Badge Hot/Baru) */}
      <div className="relative z-10 flex items-center justify-between w-full">
        <span className="text-[11px] font-medium text-slate-300 capitalize">
          {game.category}
        </span>
      </div>

      {/* Center Icon Illustration */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto transition-transform duration-200 group-hover:scale-105">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center shadow-md">
          {getGameVectorIcon(game)}
        </div>
      </div>

      {/* Bottom Info & Play Action Button */}
      <div className="relative z-10 w-full pt-2">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h4 className="font-heading text-sm font-semibold text-white group-hover:text-rose-200 transition-colors truncate">
              {game.title}
            </h4>
          </div>

          <div className="shrink-0 w-7 h-7 rounded-lg btn-primary-clean flex items-center justify-center shadow-sm opacity-90 group-hover:opacity-100 transition-opacity">
            <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
