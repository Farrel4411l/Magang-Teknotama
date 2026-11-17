import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getGamesByCategory, CATEGORIES } from "@/lib/games-data";
import GameGrid from "@/components/game/GameGrid";
import { ArrowLeft, Gamepad2, Compass, Puzzle, Zap, Coffee, Trophy } from "lucide-react";
import { GameCategory } from "@/types/game";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return CATEGORIES.filter((c) => c.id !== "all").map((c) => ({
    category: c.id,
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const validCat = CATEGORIES.find((c) => c.id === category);

  if (!validCat) {
    return {
      title: "Kategori Tidak Ditemukan | Tekno Game",
      robots: { index: false, follow: true },
    };
  }

  return {
    title: `Game Kategori ${validCat.label} - Tekno Game`,
    description: `Mainkan aneka pilihan game kategori ${validCat.label} terbaik dan gratis tanpa install di portal resmi Tekno Game oleh PT Teknotama Prakarsa Mulia.`,
    alternates: {
      canonical: `/games/category/${validCat.id}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const validCat = CATEGORIES.find((c) => c.id === category);

  if (!validCat) {
    notFound();
  }

  const games = getGamesByCategory(category);

  const getCategoryHeroIcon = (id: GameCategory) => {
    switch (id) {
      case "arcade":
        return <Gamepad2 className="w-8 h-8 text-cyan-300" />;
      case "adventure":
        return <Compass className="w-8 h-8 text-emerald-300" />;
      case "puzzle":
        return <Puzzle className="w-8 h-8 text-sky-300" />;
      case "action":
        return <Zap className="w-8 h-8 text-purple-300" />;
      case "casual":
        return <Coffee className="w-8 h-8 text-amber-300" />;
      case "sports":
        return <Trophy className="w-8 h-8 text-yellow-300" />;
      default:
        return <Gamepad2 className="w-8 h-8 text-blue-300" />;
    }
  };

  return (
    <div className="pt-6 space-y-6">
      {/* Navigasi Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-xs font-semibold text-slate-400"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-1 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Semua Game</span>
        </Link>
        <span>/</span>
        <span className="text-white font-bold uppercase tracking-wide">
          {validCat.label}
        </span>
      </nav>

      {/* Header Banner Kategori */}
      <div className="bg-gradient-to-r from-[#021861] via-[#010B2E] to-[#255dce]/40 text-white rounded-3xl p-6 sm:p-8 border border-[#255dce]/50 shadow-2xl flex items-center justify-between">
        <div className="space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#021861] border border-[#255dce]/60 flex items-center justify-center shadow-md">
            {getCategoryHeroIcon(validCat.id)}
          </div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-white">
            Katalog Game: {validCat.label}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
            Jelajahi dan mainkan beragam game web {validCat.label.toLowerCase()} seru pilihan Tekno Game secara gratis langsung di browser Anda.
          </p>
        </div>
      </div>

      {/* Grid Katalog */}
      <GameGrid games={games} title={`Daftar Game ${validCat.label}`} />
    </div>
  );
}
