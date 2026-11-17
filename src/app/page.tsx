"use client";

import React, { useState, useEffect } from "react";
import {
  Cloud,
  Code2,
  ExternalLink,
  Gamepad2,
  Network,
  Play,
  ShieldCheck,
  Trophy,
  Zap,
} from "lucide-react";
import GameHero from "@/components/game/GameHero";
import CategoryChips from "@/components/game/CategoryChips";
import GameGrid from "@/components/game/GameGrid";
import GoogleAdSlot from "@/components/ads/GoogleAdSlot";
import { CATEGORIES, INITIAL_GAMES } from "@/lib/games-data";
import { GameCategory } from "@/types/game";
import { getLocalScores } from "@/lib/local-storage";
import { getGamePortalUrl } from "@/lib/site";
import Link from "next/link";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<GameCategory>("all");
  const [topScores, setTopScores] = useState<
    { gameId: string; title: string; slug: string; score: number }[]
  >([]);

  useEffect(() => {
    const scores = getLocalScores();
    const parsed = Object.entries(scores)
      .map(([gameId, score]) => {
        const game = INITIAL_GAMES.find((g) => g.id === gameId);
        return {
          gameId,
          title: game?.title || gameId.replace(/-/g, " "),
          slug: game?.slug || gameId,
          score,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);

    setTopScores(parsed);
  }, []);

  const featuredGames = INITIAL_GAMES.filter((g) => g.featured);
  const selectedCategoryLabel =
    CATEGORIES.find((category) => category.id === selectedCategory)?.label ??
    "Semua Permainan";
  const displayGames =
    selectedCategory === "all"
      ? INITIAL_GAMES
      : INITIAL_GAMES.filter((g) => g.category === selectedCategory);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Tekno Game",
    alternateName: "Portal Permainan Tekno Game",
    url: getGamePortalUrl(),
    description:
      "Portal permainan web HTML5 resmi persembahan PT Teknotama Prakarsa Mulia. Mainkan permainan gratis tanpa instalasi.",
    publisher: {
      "@type": "Organization",
      name: "PT Teknotama Prakarsa Mulia",
      url: "https://teknotama.com",
      logo: getGamePortalUrl("/Teknogame_logo_only.png"),
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${getGamePortalUrl()}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div className="pt-5 sm:pt-8">
      {/* Skrip SEO JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Hero Section & Showcase Alami */}
      <GameHero featuredGames={featuredGames} />

      <section
        aria-label="Ringkasan Tekno Game"
        className="stats-strip mb-8 grid grid-cols-2 divide-x divide-y divide-white/10 sm:grid-cols-4 sm:divide-y-0"
      >
        {[
          {
            icon: <Gamepad2 className="h-4 w-4 text-[#8caeff]" />,
            value: INITIAL_GAMES.length,
            label: "Permainan pilihan",
          },
          {
            icon: <Zap className="h-4 w-4 text-amber-200" />,
            value: INITIAL_GAMES.reduce((total, game) => total + game.playCount, 0).toLocaleString("id-ID"),
            label: "Total permainan",
          },
          {
            icon: <ShieldCheck className="h-4 w-4 text-emerald-200" />,
            value: "100%",
            label: "Gratis dimainkan",
          },
          {
            icon: <Trophy className="h-4 w-4 text-[#8caeff]" />,
            value: "Lokal",
            label: "Skor tersimpan",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-3 px-4 py-4 sm:justify-center sm:px-3"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04]">
              {stat.icon}
            </span>
            <span>
              <span className="block font-mono text-sm font-bold text-white">
                {stat.value}
              </span>
              <span className="block text-[0.66rem] text-slate-400">
                {stat.label}
              </span>
            </span>
          </div>
        ))}
      </section>

      {/* 2. Slot Iklan Google AdSense Top Leaderboard (728x90) */}
      <GoogleAdSlot
        slotType="leaderboard-728x90"
        adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP || ""}
      />

      {/* 3. Jelajahi Kategori Filter Chips */}
      <CategoryChips
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* 4. The Tekno Game Catalog Grid (2 Kolom Mobile, 3 Kolom Tablet, 4 Kolom Desktop) */}
      <GameGrid
        games={displayGames}
        title={
          selectedCategory === "all"
            ? "Semua Koleksi Permainan"
            : `Koleksi Permainan: ${selectedCategoryLabel}`
        }
      />

      {/* 5. Slot Iklan Google AdSense Mid Leaderboard (728x90) */}
      <GoogleAdSlot
        slotType="leaderboard-728x90"
        adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_MID || ""}
      />

      {/* 6. Rekor Skor Tertinggi Saya (Tersimpan Lokal di Browser) */}
      <section className="mb-10 rounded-2xl card-natural p-5 sm:p-7">
        <div className="mb-5 flex flex-col items-start justify-between gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-amber-200/20 bg-amber-100/[0.06] text-amber-300">
              <Trophy className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-white">
                Rekor Skor Saya
              </h3>
              <p className="text-xs text-slate-300">
                Pencapaian skor Anda yang tersimpan di browser ini
              </p>
            </div>
          </div>
        </div>

        {topScores.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.025] py-8 text-center">
            <p className="text-xs sm:text-sm text-slate-300">
              Belum ada skor yang dicatat. Mainkan salah satu permainan untuk mulai mencatat rekor terbaik Anda.
            </p>
            <div className="mt-3">
              <Link
                href="/play/nusantara-runner"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl btn-primary-clean text-xs font-semibold"
              >
                <span>Mainkan Nusantara Runner</span>
                <Play className="w-3.5 h-3.5 fill-current" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {topScores.map((item, idx) => (
              <div
                key={item.gameId}
                className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-6 h-6 rounded-md bg-white/10 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-white truncate">
                      {item.title}
                    </h4>
                    <span className="text-xs font-bold text-amber-300 block">
                      {item.score.toLocaleString("id-ID")} poin
                    </span>
                  </div>
                </div>

                <Link
                  href={`/play/${item.slug}`}
                  className="p-2 rounded-lg btn-primary-clean text-white shrink-0"
                  title="Mainkan lagi"
                >
                  <Play className="w-3 h-3 fill-current" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 7. Section Branding Resmi Tekno Game */}
      <section className="mb-8 grid gap-5 rounded-2xl card-natural p-5 sm:p-7 md:grid-cols-[0.7fr_1.3fr] md:items-center">
        <div>
          <p className="section-kicker mb-2">Tentang portal</p>
          <h2 className="section-heading">Dirancang untuk <span>langsung bermain.</span></h2>
        </div>
        <p className="max-w-3xl text-sm leading-7 text-slate-300">
          Tekno Game adalah portal permainan web HTML5 resmi yang dioperasikan sebagai subdirektori dari <strong className="text-white">PT Teknotama Prakarsa Mulia</strong> (<a href="https://teknotama.com" target="_blank" rel="noopener noreferrer" className="font-medium text-[#8caeff] underline underline-offset-4">teknotama.com</a>). Portal ini menyajikan berbagai permainan yang dapat dimainkan secara gratis langsung melalui peramban tanpa perlu memasang aplikasi.
        </p>
      </section>

      <section className="mb-8" aria-labelledby="partner-services-title">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="section-kicker mb-2">Layanan mitra</p>
            <h2 id="partner-services-title" className="section-heading">
              Teknologi untuk <span>bertumbuh.</span>
            </h2>
          </div>
          <a
            href="https://teknotama.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 px-4 text-xs font-semibold text-slate-200 transition-colors hover:border-[#255dce]/50 hover:text-white"
          >
            Lihat layanan Teknotama
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: <Network className="h-5 w-5" />,
              title: "Infrastruktur Jaringan",
              description:
                "Perencanaan dan pengelolaan jaringan yang andal untuk operasional bisnis.",
            },
            {
              icon: <Cloud className="h-5 w-5" />,
              title: "Sistem Awan",
              description:
                "Solusi komputasi awan yang fleksibel, aman, dan siap berkembang.",
            },
            {
              icon: <ShieldCheck className="h-5 w-5" />,
              title: "Keamanan Data",
              description:
                "Perlindungan data dan sistem untuk menjaga kelangsungan bisnis.",
            },
            {
              icon: <Code2 className="h-5 w-5" />,
              title: "Perangkat Lunak",
              description:
                "Pengembangan perangkat lunak khusus sesuai kebutuhan organisasi.",
            },
          ].map((service) => (
            <a
              key={service.title}
              href="https://teknotama.com"
              target="_blank"
              rel="noopener noreferrer"
              className="partner-service-card group rounded-2xl border border-white/10 bg-white/[0.025] p-4 transition-colors hover:border-[#255dce]/40 hover:bg-white/[0.045]"
            >
              <span className="mb-4 grid h-10 w-10 place-items-center rounded-xl border border-[#255dce]/25 bg-[#021861]/30 text-[#8caeff] transition-colors group-hover:text-white">
                {service.icon}
              </span>
              <span className="block text-sm font-bold text-white">
                {service.title}
              </span>
              <span className="mt-2 block text-xs leading-5 text-slate-400">
                {service.description}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* 8. Section Kemitraan Resmi Teknotama */}
      <section className="partner-panel mb-8 flex flex-col items-start justify-between gap-6 p-5 sm:p-7 md:flex-row md:items-center">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="section-kicker">
            Partner Teknologi Resmi
          </span>
          <h3 className="font-heading text-xl font-bold text-white sm:text-2xl">
            Solusi Transformasi Digital Bersama PT Teknotama Prakarsa Mulia
          </h3>
          <p className="text-sm leading-6 text-slate-300">
            PT Teknotama Prakarsa Mulia menyediakan layanan infrastruktur jaringan, sistem awan, keamanan data, serta pengembangan perangkat lunak khusus untuk perusahaan.
          </p>
        </div>
        <div className="relative z-10 w-full shrink-0 md:w-auto">
          <a
            href="https://teknotama.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold btn-sponsor-clean md:w-auto"
          >
            <span>Kunjungi teknotama.com</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
