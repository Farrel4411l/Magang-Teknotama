"use client";

import React from "react";
import Link from "next/link";
import { Game } from "@/types/game";
import {
  ArrowDown,
  ArrowRight,
  Coffee,
  Compass,
  Gamepad2,
  Play,
  Puzzle,
  Trophy,
  Zap,
} from "lucide-react";
import { getCategoryLabel } from "@/lib/games-data";

const featuredIcons = {
  all: Gamepad2,
  arcade: Gamepad2,
  adventure: Compass,
  puzzle: Puzzle,
  action: Zap,
  casual: Coffee,
  sports: Trophy,
};

interface GameHeroProps {
  featuredGames: Game[];
}

export default function GameHero({ featuredGames }: GameHeroProps) {
  if (!featuredGames || featuredGames.length < 3) return null;

  const [mainHero, ...sideHeroes] = featuredGames.slice(0, 3);
  const FeaturedIcon = featuredIcons[mainHero.category];

  return (
    <section className="mb-12 space-y-5">
      <div className="home-hero grid items-center gap-8 p-5 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:p-11">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#255dce]/30 bg-[#021861]/30 px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
            <span className="section-kicker !text-[0.62rem] !tracking-[0.16em]">
              Permainan web pilihan · Gratis · Tanpa memasang aplikasi
            </span>
          </div>

          <p className="section-kicker mb-3">Tekno Game / Portal bermain</p>
          <h1 className="max-w-xl text-4xl font-bold leading-[1.04] tracking-[-0.06em] text-white sm:text-5xl lg:text-6xl">
            Mainkan cerita.
            <br />
            <span className="text-[#8caeff]">Tantang rekor.</span>
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-7 text-slate-300 sm:text-base">
            Pilih permainan favorit dan langsung main di peramban. Petualangan
            lokal, tantangan arkade, dan teka-teki seru siap menemani waktu jedamu.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href={`/play/${mainHero.slug}`}
              className="inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-3 text-sm font-bold btn-primary-clean"
            >
              <Play className="h-4 w-4 fill-current" />
              Mainkan {mainHero.title.split(":")[0]}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
            <Link
              href="#catalog"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-[#255dce]/50 hover:text-white"
            >
              Jelajahi katalog
              <ArrowDown className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-2">
              <Gamepad2 className="h-4 w-4 text-[#8caeff]" />
              {featuredGames.length} permainan sorotan
            </span>
            <span>Skor tersimpan di peramban</span>
            <span>Persembahan PT Teknotama</span>
          </div>
        </div>

        <Link
          href={`/play/${mainHero.slug}`}
          aria-label={`Mainkan ${mainHero.title}`}
          className="hero-art group min-h-[19rem] sm:min-h-[25rem]"
        >
          <div className="hero-featured-art">
            <span className="hero-featured-icon">
              <FeaturedIcon className="h-14 w-14" strokeWidth={1.4} />
            </span>
            <span className="section-kicker !text-[0.62rem]">
              {getCategoryLabel(mainHero.category)}
            </span>
            <h2 className="hero-featured-title">{mainHero.title}</h2>
          </div>

          <div className="hero-art-overlay">
            <div className="absolute left-4 top-4 z-10 rounded-full border border-white/10 bg-[#07111f]/70 px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.17em] text-slate-300 backdrop-blur">
              Sorotan utama · 01
            </div>
            <div className="absolute right-4 top-4 z-10 flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-[#c2d1f6]/70">
              <span className="h-1.5 w-1.5 rounded-full bg-[#8caeff]" />
              Siap dimainkan
            </div>

            <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#07111f]/80 p-3.5 backdrop-blur-md transition-colors group-hover:border-[#255dce]/50 sm:bottom-5 sm:left-5 sm:right-5 sm:p-4">
              <div className="min-w-0">
                <span className="section-kicker !text-[0.58rem] !tracking-[0.16em]">
                  Permainan sorotan
                </span>
                <p className="mt-1 truncate text-sm font-bold text-white sm:text-base">
                  Mainkan sekarang
                </p>
              </div>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full btn-primary-clean">
                <Play className="ml-0.5 h-4 w-4 fill-current" />
              </span>
            </div>
          </div>
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {sideHeroes.map((game, index) => (
          <Link
            key={game.id}
            href={`/play/${game.slug}`}
            className="spotlight-card group flex items-center justify-between gap-4 p-4 sm:p-5"
          >
            <div className="flex min-w-0 items-center gap-3.5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-[#255dce]/20 bg-[#255dce]/10 text-[#8caeff]">
                <span className="font-mono text-sm font-semibold">
                  0{index + 2}
                </span>
              </span>
              <span className="min-w-0">
                <span className="section-kicker !text-[0.58rem]">
                  {getCategoryLabel(game.category)}
                </span>
                <span className="mt-0.5 block truncate text-sm font-bold text-white sm:text-base">
                  {game.title}
                </span>
                <span className="mt-1 block truncate text-xs text-slate-400">
                  {game.description}
                </span>
              </span>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-[#8caeff] transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
      </div>
    </section>
  );
}
