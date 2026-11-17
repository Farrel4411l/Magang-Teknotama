"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Game } from "@/types/game";
import { Play, ExternalLink } from "lucide-react";

interface GameHeroProps {
  featuredGames: Game[];
}

export default function GameHero({ featuredGames }: GameHeroProps) {
  if (!featuredGames || featuredGames.length < 3) return null;

  const mainHero = featuredGames[0];
  const sideHeroes = featuredGames.slice(1, 3);

  return (
    <section className="mb-10 space-y-6">
      {/* 1. Hero Banner Utama dengan Gradient Alami dari Foto Referensi */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 md:p-10 shadow-xl border border-white/10"
        style={{
          background: "linear-gradient(135deg, rgba(27, 37, 99, 0.95) 0%, rgba(41, 52, 122, 0.9) 25%, rgba(80, 29, 90, 0.9) 55%, rgba(130, 20, 72, 0.9) 80%, rgba(158, 19, 84, 0.95) 100%)"
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Kolom Kiri: Branding & Pengantar Tekno Game */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden border border-white/20 shrink-0 bg-[#121844] shadow-md">
                <Image
                  src="/games/Teknogame_logo_only.png"
                  alt="Logo Tekno Game"
                  fill
                  sizes="56px"
                  className="object-contain p-1"
                  priority
                />
              </div>
              <div>
                <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                  Tekno <span className="text-rose-200">Game</span>
                </h1>
                <p className="text-xs sm:text-sm text-white/80">
                  Portal Game Web HTML5 Resmi PT Teknotama Prakarsa Mulia
                </p>
              </div>
            </div>

            <p className="text-sm text-white/90 leading-relaxed max-w-xl">
              Mainkan aneka pilihan game petualangan, arcade, dan asah otak langsung di browser Anda. Cepat, ringan, dan gratis tanpa perlu instalasi aplikasi tambahan.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href={`/play/${mainHero.slug}`}
                className="px-6 py-2.5 rounded-xl btn-primary-clean text-sm font-semibold flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Mulai Bermain</span>
              </Link>

              <a
                href="https://teknotama.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>Tentang Teknotama</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Kolom Kanan: Partner Resmi Teknotama */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-black/25 border border-white/10 p-5 sm:p-6 space-y-3">
              <span className="text-xs font-semibold text-rose-200 uppercase tracking-wide block">
                Partner Teknologi Resmi
              </span>
              <h3 className="font-heading text-base sm:text-lg font-bold text-white">
                PT Teknotama Prakarsa Mulia
              </h3>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                Penyedia solusi infrastruktur IT, cloud system, data security, dan custom software development untuk akselerasi bisnis Anda.
              </p>
              <div className="pt-2">
                <a
                  href="https://teknotama.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-200 hover:text-white transition-colors"
                >
                  <span>Kunjungi teknotama.com</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Spotlight Game Pilihan (Tanpa Rating, Tanpa Badge Hot/Baru/Populer) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Game Utama */}
        <div className="lg:col-span-2 rounded-2xl card-natural p-6 flex flex-col justify-between group">
          <div className="space-y-2">
            <span className="text-xs font-medium text-slate-300 capitalize">
              {mainHero.category}
            </span>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-white">
              {mainHero.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              {mainHero.description}
            </p>
          </div>

          <div className="pt-6">
            <Link
              href={`/play/${mainHero.slug}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-primary-clean text-xs sm:text-sm font-semibold shadow-md cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Main Sekarang</span>
            </Link>
          </div>
        </div>

        {/* 2 Game Sampingan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          {sideHeroes.map((hero) => (
            <Link
              key={hero.id}
              href={`/play/${hero.slug}`}
              className="rounded-2xl card-natural p-5 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <span className="text-[11px] font-medium text-slate-400 capitalize block">
                  {hero.category}
                </span>
                <h3 className="font-heading text-base font-semibold text-white group-hover:text-rose-200 transition-colors mt-0.5">
                  {hero.title}
                </h3>
              </div>

              <div className="pt-4 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-normal">
                  Mainkan di browser
                </span>
                <span className="font-medium text-rose-300 flex items-center gap-1">
                  <span>Buka</span>
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
