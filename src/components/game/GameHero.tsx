"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Game } from "@/types/game";
import {
  Play,
  Flame,
  Star,
  Users,
  ExternalLink,
  ShieldCheck,
  Cpu,
  Database,
  Network,
  Sparkles,
  Gamepad2,
} from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface GameHeroProps {
  featuredGames: Game[];
}

export default function GameHero({ featuredGames }: GameHeroProps) {
  if (!featuredGames || featuredGames.length < 3) return null;

  const mainHero = featuredGames[0];
  const sideHeroes = featuredGames.slice(1, 3);

  return (
    <section className="mb-10 space-y-6">
      {/* 1. Hero Visual Showcase Banner: Orbit Geometris & Promosi Ekosistem Teknotama */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#021861] via-[#010B2E] to-[#255dce]/30 border border-[#255dce]/50 p-6 sm:p-8 md:p-10 shadow-2xl">
        {/* SVG Tech Visualization: Circuit Orbit & Grid Mesh */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hero-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1" fill="#38bdf8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-pattern)" />
            <circle cx="85%" cy="30%" r="180" stroke="#255dce" strokeWidth="1.5" fill="none" strokeDasharray="8 6" />
            <circle cx="85%" cy="30%" r="240" stroke="#8A0045" strokeWidth="1" fill="none" strokeDasharray="4 8" />
            <circle cx="85%" cy="30%" r="300" stroke="#38bdf8" strokeWidth="0.75" fill="none" />
          </svg>
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Kolom Kiri: Branding Tekno Game & Ajakan Bermain (Span 7) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#021861] border border-[#255dce]/60 text-cyan-300 text-xs font-bold shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <ShieldCheck className="w-3.5 h-3.5 text-[#3b82f6]" />
              <span>SUB-PORTAL RESMI PT TEKNOTAMA PRAKARSA MULIA</span>
            </div>

            <div className="flex items-center gap-4 pt-1">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-[#255dce] shadow-[0_0_25px_rgba(37,93,206,0.6)] shrink-0 bg-[#010B2E]">
                <Image
                  src="/games/Teknogame_logo_only.png"
                  alt="Logo Perisai Monogram GT Tekno Game"
                  fill
                  sizes="64px"
                  className="object-contain p-1.5"
                  priority
                />
              </div>
              <div>
                <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Tekno <span className="bg-gradient-to-r from-[#255dce] to-[#38bdf8] bg-clip-text text-transparent">Game</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  Portal Hiburan Game Web HTML5 Instan Tanpa Instalasi
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed max-w-xl">
              Selamat datang di <strong className="text-white">Tekno Game</strong>! Mainkan koleksi game kasual, petualangan Nusantara, arcade seru, dan asah otak terlengkap berkecepatan tinggi langsung di browser Anda secara gratis.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href={`/play/${mainHero.slug}`}
                className="px-6 py-3 rounded-xl btn-burgundy text-xs sm:text-sm font-black flex items-center gap-2 shadow-lg active:scale-95 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Mainkan Sekarang</span>
              </Link>

              <a
                href="https://teknotama.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-[#021861] hover:bg-[#255dce]/30 border border-[#255dce]/60 text-slate-200 hover:text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <span>Tentang Teknotama</span>
                <ExternalLink className="w-4 h-4 text-cyan-400" />
              </a>
            </div>
          </div>

          {/* Kolom Kanan: Kartu Showcase Layanan Teknologi Teknotama (Span 5) */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-gradient-to-br from-[#021861]/90 via-[#010B2E] to-[#255dce]/20 border border-[#255dce]/50 p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#255dce]/30 pb-3">
                <span className="text-[10px] uppercase font-black tracking-wider bg-[#255dce]/30 text-cyan-300 px-2.5 py-0.5 rounded-full border border-[#255dce]/50 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-300" />
                  <span>EKOSISTEM BISNIS</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium">teknotama.com</span>
              </div>

              <h3 className="font-heading text-sm sm:text-base font-bold text-white leading-snug">
                Solusi Transformasi Digital &amp; IT Enterprise
              </h3>

              <div className="grid grid-cols-2 gap-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-[#010B2E]/80 border border-[#255dce]/30">
                  <Network className="w-4 h-4 text-[#3b82f6] shrink-0" />
                  <span className="truncate">Infrastruktur IT</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-[#010B2E]/80 border border-[#255dce]/30">
                  <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="truncate">Cloud System</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-[#010B2E]/80 border border-[#255dce]/30">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">Data Security</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-[#010B2E]/80 border border-[#255dce]/30">
                  <Database className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="truncate">Custom Software</span>
                </div>
              </div>

              <a
                href="https://teknotama.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-2.5 text-center rounded-xl btn-sponsor text-xs font-black text-white shadow-md cursor-pointer"
              >
                <span>Konsultasikan Kebutuhan IT Anda</span>
                <ExternalLink className="w-3.5 h-3.5 inline ml-1.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Spotlight Game Unggulan: 1 Main Hero + 2 Stacked Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Hero Card (Large - Span 2 Columns) */}
        <div className="lg:col-span-2 relative h-[320px] sm:h-[380px] rounded-3xl overflow-hidden card-elevated p-6 sm:p-8 flex flex-col justify-between group">
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="btn-burgundy text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                <Flame className="w-3.5 h-3.5 text-white fill-white" />
                <span>GAME UTAMA PEKAN INI</span>
              </span>
              <span className="bg-[#010B2E]/80 text-amber-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-[#255dce]/40 shadow-sm">
                <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                <span>{mainHero.rating.toFixed(1)} / 5.0</span>
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-300 font-semibold bg-[#010B2E]/80 px-3 py-1 rounded-full border border-[#255dce]/30">
              <Users className="w-3.5 h-3.5 text-[#3b82f6]" />
              <span>{formatNumber(mainHero.playCount)} pemain</span>
            </div>
          </div>

          <div className="relative z-10 max-w-xl">
            <span className="text-cyan-300 text-xs font-extrabold uppercase tracking-wider">
              {mainHero.category} • ARENA PILIHAN
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mt-1 leading-tight tracking-tight drop-shadow-md">
              {mainHero.title}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-2 line-clamp-2 leading-relaxed">
              {mainHero.description}
            </p>

            <div className="flex items-center gap-4 mt-5">
              <Link
                href={`/play/${mainHero.slug}`}
                className="px-6 py-3 btn-burgundy text-sm font-black rounded-xl shadow-lg transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Mainkan Sekarang</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Side Stacked Heroes (2 Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          {sideHeroes.map((hero, idx) => (
            <Link
              key={hero.id}
              href={`/play/${hero.slug}`}
              className="relative h-[155px] sm:h-[182px] rounded-3xl overflow-hidden card-elevated p-5 flex flex-col justify-between group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#021861] text-cyan-300 border border-[#255dce]/50 flex items-center gap-1">
                  {idx === 0 ? <Sparkles className="w-3 h-3 text-cyan-400" /> : <Flame className="w-3 h-3 text-rose-400" />}
                  <span>{idx === 0 ? "POPULER" : "TRENDING"}</span>
                </span>
                <div className="flex items-center gap-1 text-[11px] font-bold text-amber-300">
                  <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                  <span>{hero.rating.toFixed(1)}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-cyan-300/80 font-bold uppercase block">
                  {hero.category}
                </span>
                <h3 className="font-heading text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                  {hero.title}
                </h3>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#255dce]/20">
                  <span className="text-[10px] text-slate-400">
                    {formatNumber(hero.playCount)}x dimainkan
                  </span>
                  <span className="text-xs font-bold text-[#3b82f6] group-hover:text-cyan-300 flex items-center gap-1">
                    <span>Main</span>
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
