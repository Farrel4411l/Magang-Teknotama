"use client";

import React from "react";
import Link from "next/link";
import { Game } from "@/types/game";
import {
  Play,
  Star,
  Gamepad2,
  Compass,
  Puzzle,
  Zap,
  Coffee,
  Trophy,
  Flame,
  Sparkles,
} from "lucide-react";

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  // Mapping ikon vektor representatif berdasarkan slug atau kategori
  const getGameVectorIcon = (game: Game) => {
    switch (game.slug) {
      case "nusantara-runner":
      case "kapal-feri":
      case "lembah-bromo":
      case "pasar-terapung":
      case "kamus-kelana":
        return <Compass className="w-10 h-10 text-cyan-300 drop-shadow-[0_0_12px_rgba(56,189,248,0.6)]" />;
      case "packing-master":
      case "batik-flow":
        return <Puzzle className="w-10 h-10 text-sky-300 drop-shadow-[0_0_12px_rgba(14,165,233,0.6)]" />;
      case "becak-drift":
      case "werewolf":
        return <Zap className="w-10 h-10 text-amber-300 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]" />;
      case "candi-stacker":
      case "kopi-klotok":
      case "layangan-sanur":
        return <Coffee className="w-10 h-10 text-indigo-300 drop-shadow-[0_0_12px_rgba(129,140,248,0.6)]" />;
      default:
        switch (game.category) {
          case "arcade":
            return <Gamepad2 className="w-10 h-10 text-cyan-300" />;
          case "adventure":
            return <Compass className="w-10 h-10 text-emerald-300" />;
          case "puzzle":
            return <Puzzle className="w-10 h-10 text-sky-300" />;
          case "action":
            return <Zap className="w-10 h-10 text-purple-300" />;
          case "casual":
            return <Coffee className="w-10 h-10 text-amber-300" />;
          case "sports":
            return <Trophy className="w-10 h-10 text-yellow-300" />;
          default:
            return <Gamepad2 className="w-10 h-10 text-blue-300" />;
        }
    }
  };

  const getBadgeStyle = (badge: string) => {
    switch (badge) {
      case "HOT":
        return "bg-gradient-to-r from-[#8A0045] to-[#660033] text-white border-rose-400/50 shadow-[0_0_10px_rgba(138,0,69,0.5)]";
      case "BARU":
        return "bg-gradient-to-r from-[#255dce] to-[#1e40af] text-white border-blue-400/50 shadow-[0_0_10px_rgba(37,93,206,0.5)]";
      case "POPULAR":
      default:
        return "bg-[#021861] text-cyan-300 border-[#255dce]/60 shadow-[0_0_10px_rgba(2,24,97,0.5)]";
    }
  };

  return (
    <Link
      href={`/play/${game.slug}`}
      className="group relative rounded-2xl overflow-hidden card-elevated flex flex-col justify-between aspect-[4/3] sm:aspect-square select-none cursor-pointer p-3 sm:p-4 transition-all duration-300"
    >
      {/* Background Cyber Grid Accent & Ambient Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#021861]/70 via-[#010B2E]/90 to-[#255dce]/25 transition-transform duration-500 group-hover:scale-105" />

      {/* Decorative Circuit Lines SVG */}
      <svg
        className="absolute inset-0 w-full h-full opacity-15 pointer-events-none group-hover:opacity-25 transition-opacity"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="0" y1="20" x2="100%" y2="20" stroke="#255dce" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="20" y1="0" x2="20" y2="100%" stroke="#255dce" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="85%" cy="85%" r="35" stroke="#255dce" strokeWidth="1" fill="none" opacity="0.3" />
      </svg>

      {/* Top Bar: Badge & Rating */}
      <div className="relative z-10 flex items-start justify-between w-full">
        {game.badge && game.badge !== "NONE" ? (
          <span
            className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${getBadgeStyle(
              game.badge
            )}`}
          >
            {game.badge === "HOT" ? (
              <Flame className="w-2.5 h-2.5 text-rose-300 fill-rose-300" />
            ) : (
              <Sparkles className="w-2.5 h-2.5 text-cyan-300" />
            )}
            <span>{game.badge}</span>
          </span>
        ) : (
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-[#010B2E]/80 px-2 py-0.5 rounded-md border border-[#255dce]/30">
            {game.category}
          </span>
        )}

        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#010B2E]/90 border border-[#255dce]/40 text-amber-300 text-[11px] font-bold shadow-sm">
          <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
          <span>{game.rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Center Illustration with Glowing Orb */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto transition-transform duration-300 group-hover:scale-110">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#021861] to-[#255dce]/40 border border-[#255dce]/50 flex items-center justify-center shadow-lg group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(37,93,206,0.5)] transition-all">
          {getGameVectorIcon(game)}
        </div>
      </div>

      {/* Bottom Info & CTA Hover Transition */}
      <div className="relative z-10 w-full pt-2">
        <div className="flex items-end justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h4 className="font-heading text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
              {game.title}
            </h4>
            <span className="text-[10px] text-slate-400 font-medium block capitalize">
              {game.category}
            </span>
          </div>

          {/* Action Button: Burgundy Focal Point on Hover */}
          <div className="shrink-0 w-8 h-8 rounded-xl btn-burgundy flex items-center justify-center shadow-md opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all">
            <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
