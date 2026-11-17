"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  Dices,
  Trophy,
  Heart,
  ChevronDown,
  ExternalLink,
  Menu,
  X,
  Gamepad2,
  Compass,
  Puzzle,
  Zap,
  Coffee,
} from "lucide-react";
import { INITIAL_GAMES, CATEGORIES } from "@/lib/games-data";
import { GameCategory } from "@/types/game";

interface NavbarProps {
  onOpenSearch?: () => void;
  onOpenLeaderboard?: () => void;
  onOpenFavorites?: () => void;
}

export default function Navbar({
  onOpenSearch,
  onOpenLeaderboard,
  onOpenFavorites,
}: NavbarProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Main Acak handler
  const handleRandomPlay = () => {
    if (!INITIAL_GAMES.length) return;
    const randomIndex = Math.floor(Math.random() * INITIAL_GAMES.length);
    const randomGame = INITIAL_GAMES[randomIndex];
    router.push(`/play/${randomGame.slug}`);
    setMobileMenuOpen(false);
  };

  const getCategoryIcon = (id: GameCategory) => {
    switch (id) {
      case "arcade":
        return <Gamepad2 className="w-4 h-4 text-[#3b82f6]" />;
      case "adventure":
        return <Compass className="w-4 h-4 text-emerald-400" />;
      case "puzzle":
        return <Puzzle className="w-4 h-4 text-sky-400" />;
      case "action":
        return <Zap className="w-4 h-4 text-purple-400" />;
      case "casual":
        return <Coffee className="w-4 h-4 text-amber-400" />;
      default:
        return <Gamepad2 className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#021861]/85 backdrop-blur-xl border-b border-[#255dce]/30 shadow-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px] gap-2 md:gap-4">
          {/* 1. Brand Logo Tekno Game */}
          <div className="flex items-center shrink-0">
            <Link
              href="/"
              className="flex items-center gap-3 group select-none"
              title="Tekno Game - Beranda Resmi"
            >
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden border border-[#255dce]/60 group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(37,93,206,0.5)] transition-all duration-300 shrink-0 bg-[#010B2E]">
                <Image
                  src="/games/Teknogame_logo_only.png"
                  alt="Ikon Perisai Monogram GT Tekno Game"
                  fill
                  sizes="48px"
                  className="object-contain p-1"
                  priority
                />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                  Tekno
                </span>
                <span className="font-heading text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-[#255dce] to-[#38bdf8] bg-clip-text text-transparent">
                  Game
                </span>
              </div>
            </Link>
          </div>

          {/* 2. Desktop Navigation Center */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-semibold text-slate-200">
            {/* 3. Beranda (Home) */}
            <Link
              href="/"
              className="px-3 py-2 rounded-xl hover:text-white hover:bg-[#255dce]/20 transition-all cursor-pointer"
            >
              Beranda
            </Link>

            {/* 4. Kategori Game (Dropdown) */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:text-white hover:bg-[#255dce]/20 transition-all cursor-pointer"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <span>Kategori</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#3b82f6] transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 rounded-2xl glass-dropdown p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <Link
                    href="/"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-[#255dce]/30 transition-colors"
                  >
                    <Gamepad2 className="w-4 h-4 text-cyan-400" />
                    <span>Semua Game</span>
                  </Link>
                  <div className="h-px bg-[#255dce]/30 my-1" />
                  {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.id}`}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-[#255dce]/30 transition-colors"
                    >
                      {getCategoryIcon(cat.id)}
                      <span>{cat.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 5. Main Acak */}
            <button
              type="button"
              onClick={handleRandomPlay}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:text-white hover:bg-[#255dce]/20 transition-all cursor-pointer"
            >
              <Dices className="w-4 h-4 text-cyan-400" />
              <span>Main Acak</span>
            </button>

            {/* 6. Papan Skor */}
            <button
              type="button"
              onClick={onOpenLeaderboard}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:text-white hover:bg-[#255dce]/20 transition-all cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Papan Skor</span>
            </button>

            {/* 7. Favorit */}
            <button
              type="button"
              onClick={onOpenFavorites}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:text-white hover:bg-[#255dce]/20 transition-all cursor-pointer"
            >
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Favorit</span>
            </button>
          </nav>

          {/* Sisi Kanan: Search Bar + 8. Link Sponsor teknotama.com */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* 2. Search Bar Trigger */}
            <button
              type="button"
              onClick={onOpenSearch}
              aria-label="Cari Game"
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#010B2E]/80 hover:bg-[#255dce]/25 border border-[#255dce]/40 text-slate-300 hover:text-white transition-all cursor-pointer text-xs"
            >
              <Search className="w-4 h-4 text-cyan-400" />
              <span className="hidden md:inline font-medium">Cari game...</span>
            </button>

            {/* 8. Link Penghubung Sponsor (teknotama.com) — WAJIB DI-HIGHLIGHT */}
            <a
              href="https://teknotama.com"
              target="_blank"
              rel="noopener noreferrer"
              title="Kunjungi Domain Induk Resmi: PT Teknotama Prakarsa Mulia"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl btn-sponsor text-xs font-black text-white cursor-pointer active:scale-95"
            >
              <span>teknotama.com</span>
              <ExternalLink className="w-3.5 h-3.5 text-white/90" />
            </a>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-[#010B2E] border border-[#255dce]/40 text-slate-300 hover:text-white cursor-pointer"
              aria-label="Buka Menu Navigasi"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#255dce]/30 bg-[#021861] px-4 py-4 space-y-2 shadow-2xl animate-in slide-in-from-top duration-150">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-[#255dce]/25 transition-colors"
          >
            <Gamepad2 className="w-4 h-4 text-cyan-400" />
            <span>Beranda</span>
          </Link>

          <div className="pt-2 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3">
            Kategori Game
          </div>
          <div className="grid grid-cols-2 gap-1.5 px-1">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={cat.id === "all" ? "/" : `/category/${cat.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-[#255dce]/30 transition-colors"
              >
                {getCategoryIcon(cat.id)}
                <span>{cat.label}</span>
              </Link>
            ))}
          </div>

          <div className="h-px bg-[#255dce]/30 my-2" />

          <button
            type="button"
            onClick={handleRandomPlay}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-200 hover:bg-[#255dce]/25 transition-colors cursor-pointer"
          >
            <Dices className="w-4 h-4 text-cyan-400" />
            <span>Main Acak</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenLeaderboard?.();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-200 hover:bg-[#255dce]/25 transition-colors cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Papan Skor</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenFavorites?.();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-200 hover:bg-[#255dce]/25 transition-colors cursor-pointer"
          >
            <Heart className="w-4 h-4 text-rose-400" />
            <span>Favorit</span>
          </button>

          <div className="pt-2">
            <a
              href="https://teknotama.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl btn-sponsor text-xs font-black text-white shadow-md cursor-pointer"
            >
              <span>Kunjungi teknotama.com</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
