"use client";

import React from "react";
import Link from "next/link";
import { Game } from "@/types/game";
import { Play, Flame, Star, Sparkles, Users, Zap } from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface GameHeroProps {
  featuredGames: Game[];
}

export default function GameHero({ featuredGames }: GameHeroProps) {
  if (!featuredGames || featuredGames.length < 3) return null;

  const mainHero = featuredGames[0];
  const sideHeroes = featuredGames.slice(1, 3);

  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Hero Card (Large - Span 2 Columns) */}
        <div className="lg:col-span-2 relative h-[320px] sm:h-[380px] rounded-3xl overflow-hidden bg-gradient-to-tr from-[#070B14] via-[#0B1222] to-[#1E3A8A]/50 border border-cyan-500/30 shadow-2xl group">
          {/* Visual Background Illustration with Cyber Radial */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-500/20 via-blue-600/10 to-transparent pointer-events-none" />
          <div className="absolute right-4 bottom-4 opacity-15 text-[140px] sm:text-[180px] select-none pointer-events-none filter drop-shadow-2xl">
            ⚡
          </div>

          {/* Content Container */}
          <div className="relative z-10 h-full flex flex-col justify-between p-6 sm:p-8 text-white">
            {/* Top Badges */}
            <div className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                <Flame className="w-3.5 h-3.5 fill-slate-950" />
                <span>GAME OF THE WEEK</span>
              </span>
              <span className="bg-slate-900/60 backdrop-blur-md text-slate-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-cyan-500/30 shadow-sm">
                <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>{mainHero.rating.toFixed(1)} Rating</span>
              </span>
            </div>

            {/* Bottom Info & Play CTA */}
            <div className="max-w-xl">
              <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider">
                {mainHero.category} • ARENA UNGGULAN
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mt-1 leading-tight tracking-tight drop-shadow-md">
                {mainHero.title}
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-2 line-clamp-2 leading-relaxed">
                {mainHero.description}
              </p>

              <div className="flex items-center gap-4 mt-5">
                <Link
                  href={`/play/${mainHero.slug}`}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 text-sm font-black rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Main Sekarang</span>
                </Link>

                <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-semibold bg-slate-900/70 px-3.5 py-2 rounded-xl border border-slate-800">
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{formatNumber(mainHero.playCount)} pemain aktif</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side Stacked Heroes (2 Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          {sideHeroes.map((hero, idx) => (
            <div
              key={hero.id}
              className="relative h-[155px] sm:h-[182px] rounded-3xl overflow-hidden bg-[#0F172A] border border-slate-800 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all duration-300 p-5 flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-950 text-cyan-300 border border-blue-800 flex items-center gap-1">
                  {idx === 0 ? <Zap className="w-3 h-3 text-cyan-400" /> : <Flame className="w-3 h-3 text-amber-400" />}
                  <span>{idx === 0 ? "POPULER" : "TRENDING"}</span>
                </span>
                <div className="flex items-center gap-1 text-[11px] font-bold text-amber-300">
                  <Star className="w-3 h-3 fill-amber-300" />
                  <span>{hero.rating.toFixed(1)}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-cyan-400/80 font-bold uppercase block">
                  {hero.category}
                </span>
                <h3 className="text-sm font-black text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                  {hero.title}
                </h3>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] text-slate-400">
                    {formatNumber(hero.playCount)} main
                  </span>
                  <Link
                    href={`/play/${hero.slug}`}
                    className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    <span>Mainkan</span>
                    <Play className="w-2.5 h-2.5 fill-cyan-400" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
