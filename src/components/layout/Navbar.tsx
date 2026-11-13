"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, Trophy, Dices, Globe, Menu, X, Zap, ExternalLink } from "lucide-react";
import { INITIAL_GAMES } from "@/lib/games-data";

interface NavbarProps {
  onOpenSearch?: () => void;
  onOpenLeaderboard?: () => void;
}

export default function Navbar({ onOpenSearch, onOpenLeaderboard }: NavbarProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState<"ID" | "EN">("ID");

  const handleRandomPlay = () => {
    const randomIndex = Math.floor(Math.random() * INITIAL_GAMES.length);
    const randomGame = INITIAL_GAMES[randomIndex];
    router.push(`/play/${randomGame.slug}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0B1222]/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">
          {/* Sisi Kiri: Logo TeknoGame */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-3 group"
              title="TeknoGame - Play. Evolve. Conquer."
            >
              <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg border border-cyan-500/40 group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all shrink-0">
                <Image
                  src="/teknogame-icon.png"
                  alt="TeknoGame Shield Emblem"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-lg font-black tracking-wider text-white">TEKNO</span>
                  <span className="text-lg font-black tracking-wider bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent">
                    GAME
                  </span>
                </div>
                <span className="text-[9px] uppercase font-bold tracking-widest text-cyan-400/80 -mt-1 hidden sm:inline">
                  PLAY. EVOLVE. CONQUER.
                </span>
              </div>
            </Link>
          </div>

          {/* Tengah: Navigasi Kategori (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-slate-300">
            <Link
              href="/"
              className="hover:text-cyan-400 transition-colors py-1 border-b-2 border-transparent hover:border-cyan-400"
            >
              Semua Game
            </Link>
            <Link
              href="/category/arcade"
              className="hover:text-cyan-400 transition-colors py-1 border-b-2 border-transparent hover:border-cyan-400"
            >
              🕹️ Arcade
            </Link>
            <Link
              href="/category/adventure"
              className="hover:text-cyan-400 transition-colors py-1 border-b-2 border-transparent hover:border-cyan-400"
            >
              🧭 Petualangan
            </Link>
            <Link
              href="/category/puzzle"
              className="hover:text-cyan-400 transition-colors py-1 border-b-2 border-transparent hover:border-cyan-400"
            >
              🧩 Puzzle
            </Link>
            <Link
              href="/category/casual"
              className="hover:text-cyan-400 transition-colors py-1 border-b-2 border-transparent hover:border-cyan-400"
            >
              ☕ Santai
            </Link>
          </nav>

          {/* Sisi Kanan: Action Badges & Tools */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Pill 1: Main Acak (Cyber Neon Pill) */}
            <button
              onClick={handleRandomPlay}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer hover:shadow-[0_0_15px_rgba(0,240,255,0.3)]"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Main Acak</span>
            </button>

            {/* Pill 2: Hall of Fame (Trophy & Record) */}
            <button
              onClick={onOpenLeaderboard}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-950/80 hover:bg-blue-900 border border-blue-700/60 hover:border-cyan-500/50 text-blue-200 text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer hover:shadow-[0_0_15px_rgba(37,99,235,0.3)]"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Hall of Fame</span>
              <span className="sm:hidden">Rekor</span>
            </button>

            {/* Promo / Partner Link to teknotama.com */}
            <a
              href="https://teknotama.com"
              target="_blank"
              rel="noopener noreferrer"
              title="Official Partner: Teknotama IT Solutions"
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer hover:shadow-[0_0_12px_rgba(0,240,255,0.3)]"
            >
              <span>🌐 teknotama.com</span>
              <ExternalLink className="w-3 h-3 text-cyan-400" />
            </a>

            {/* Search Icon Trigger */}
            <button
              onClick={onOpenSearch}
              aria-label="Cari Game"
              className="p-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-800/80 rounded-full transition-colors cursor-pointer border border-transparent hover:border-cyan-500/30"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Language Selector */}
            <button
              onClick={() => setLang(lang === "ID" ? "EN" : "ID")}
              className="hidden md:inline-flex items-center gap-1 text-xs font-bold text-slate-300 hover:text-white px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-900/60"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang}</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:bg-slate-800 rounded-lg"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#0B1222] px-4 py-3 space-y-2 shadow-2xl">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-800">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleRandomPlay();
              }}
              className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-cyan-500/10 text-cyan-300 text-xs font-bold border border-cyan-500/30"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Main Acak</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLeaderboard?.();
              }}
              className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-blue-950 text-blue-200 text-xs font-bold border border-blue-800"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Hall of Fame</span>
            </button>
          </div>
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-slate-200 rounded-lg hover:bg-slate-800"
          >
            🎮 Semua Game
          </Link>
          <Link
            href="/category/arcade"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-slate-200 rounded-lg hover:bg-slate-800"
          >
            🕹️ Arcade
          </Link>
          <Link
            href="/category/adventure"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-slate-200 rounded-lg hover:bg-slate-800"
          >
            🧭 Petualangan
          </Link>
          <Link
            href="/category/puzzle"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-slate-200 rounded-lg hover:bg-slate-800"
          >
            🧩 Puzzle
          </Link>
          <Link
            href="/category/casual"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-slate-200 rounded-lg hover:bg-slate-800"
          >
            ☕ Santai
          </Link>
          <a
            href="https://teknotama.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-cyan-300 rounded-lg bg-cyan-950/30 border border-cyan-500/30 hover:bg-cyan-950/50 mt-2"
          >
            <span>🌐 Kunjungi teknotama.com</span>
            <ExternalLink className="w-4 h-4 text-cyan-400" />
          </a>
        </div>
      )}
    </header>
  );
}
