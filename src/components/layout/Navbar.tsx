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
        return <Gamepad2 className="w-4 h-4 text-cyan-400" />;
      case "adventure":
        return <Compass className="w-4 h-4 text-emerald-400" />;
      case "puzzle":
        return <Puzzle className="w-4 h-4 text-sky-400" />;
      case "action":
        return <Zap className="w-4 h-4 text-rose-400" />;
      case "casual":
        return <Coffee className="w-4 h-4 text-amber-400" />;
      default:
        return <Gamepad2 className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-nav-clean">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">
          {/* 1. Brand Logo Tekno Game */}
          <div className="flex items-center shrink-0">
            <Link
              href="/"
              className="flex items-center gap-3 group select-none"
              title="Tekno Game"
            >
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden border border-white/20 group-hover:border-white/50 transition-all shrink-0 bg-[#141b47]">
                <Image
                  src="/games/Teknogame_logo_only.png"
                  alt="Logo Tekno Game"
                  fill
                  sizes="40px"
                  className="object-contain p-1"
                  priority
                />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Tekno
                </span>
                <span className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-rose-300">
                  Game
                </span>
              </div>
            </Link>
          </div>

          {/* 2. Desktop Navigation Center */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium text-slate-200">
            {/* 3. Beranda */}
            <Link
              href="/"
              className="px-3.5 py-2 rounded-xl hover:text-white hover:bg-white/10 transition-colors"
            >
              Beranda
            </Link>

            {/* 4. Kategori Game (Dropdown) */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1 px-3.5 py-2 rounded-xl hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-expanded={dropdownOpen}
              >
                <span>Kategori</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-52 rounded-2xl glass-modal-clean p-1.5 z-50 animate-in fade-in duration-150">
                  <Link
                    href="/"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Gamepad2 className="w-4 h-4 text-cyan-400" />
                    <span>Semua Game</span>
                  </Link>
                  <div className="h-px bg-white/10 my-1" />
                  {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.id}`}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
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
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Dices className="w-4 h-4 text-slate-300" />
              <span>Main Acak</span>
            </button>

            {/* 6. Papan Skor */}
            <button
              type="button"
              onClick={onOpenLeaderboard}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-amber-300" />
              <span>Papan Skor</span>
            </button>

            {/* 7. Favorit */}
            <button
              type="button"
              onClick={onOpenFavorites}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Favorit</span>
            </button>
          </nav>

          {/* Sisi Kanan: Search Bar + 8. Link Sponsor teknotama.com */}
          <div className="flex items-center gap-2.5">
            {/* 2. Search Bar Trigger */}
            <button
              type="button"
              onClick={onOpenSearch}
              aria-label="Cari Game"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden md:inline font-normal">Cari game...</span>
            </button>

            {/* 8. Link Penghubung Sponsor teknotama.com */}
            <a
              href="https://teknotama.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl btn-sponsor-clean text-xs font-semibold shadow-sm cursor-pointer"
            >
              <span>teknotama.com</span>
              <ExternalLink className="w-3 h-3 text-white/80" />
            </a>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/10 border border-white/15 text-slate-300 hover:text-white cursor-pointer"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#121844] px-4 py-4 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-150">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-white hover:bg-white/10 transition-colors"
          >
            <Gamepad2 className="w-4 h-4 text-cyan-400" />
            <span>Beranda</span>
          </Link>

          <div className="pt-2 text-xs font-semibold text-slate-400 px-3">
            Kategori Game
          </div>
          <div className="grid grid-cols-2 gap-1 px-1">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={cat.id === "all" ? "/" : `/category/${cat.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-white/10 transition-colors"
              >
                {getCategoryIcon(cat.id)}
                <span>{cat.label}</span>
              </Link>
            ))}
          </div>

          <div className="h-px bg-white/10 my-2" />

          <button
            type="button"
            onClick={handleRandomPlay}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Dices className="w-4 h-4" />
            <span>Main Acak</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenLeaderboard?.();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-amber-300" />
            <span>Papan Skor</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenFavorites?.();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Heart className="w-4 h-4 text-rose-400" />
            <span>Favorit</span>
          </button>

          <div className="pt-2">
            <a
              href="https://teknotama.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl btn-sponsor-clean text-xs font-semibold shadow-md cursor-pointer"
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
