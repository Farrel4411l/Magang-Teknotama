"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Gamepad2, Trophy, ExternalLink, ShieldCheck, Heart, Sparkles, Compass } from "lucide-react";
import { CATEGORIES } from "@/lib/games-data";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#021861] via-[#010B2E] to-[#010B2E] text-slate-400 text-xs border-t border-[#255dce]/40 mt-20 pt-14 pb-28 shadow-2xl relative overflow-hidden">
      {/* Decorative Top Accent Line (Cobalt Blue to Burgundy) */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#255dce] via-[#8A0045] to-[#255dce]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-[#255dce]/20">
          {/* Kolom 1: Brand Info */}
          <div className="space-y-3.5">
            <Link href="/" className="inline-flex items-center gap-3 group select-none">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-[#255dce]/60 shrink-0 bg-[#010B2E]">
                <Image
                  src="/games/Teknogame_logo_only.png"
                  alt="Logo Resmi Tekno Game"
                  fill
                  sizes="40px"
                  className="object-contain p-1"
                />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-heading text-xl font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                  Tekno
                </span>
                <span className="font-heading text-xl font-bold tracking-tight bg-gradient-to-r from-[#255dce] to-[#38bdf8] bg-clip-text text-transparent">
                  Game
                </span>
              </div>
            </Link>
            <p className="text-slate-300 text-xs leading-relaxed">
              Portal game web HTML5 instan resmi persembahan PT Teknotama Prakarsa Mulia. Nikmati sensasi bermain ratusan game terbaik tanpa instalasi, bebas hambatan, dan gratis langsung di browsermu!
            </p>
          </div>

          {/* Kolom 2: Arena Game Populer */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
              <Gamepad2 className="w-3.5 h-3.5 text-[#3b82f6]" />
              <span>Kategori Permainan</span>
            </h4>
            <ul className="space-y-2">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={cat.id === "all" ? "/" : `/category/${cat.id}`}
                    className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                  >
                    <span>{cat.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Fitur Unggulan */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Fitur Platform</span>
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-cyan-300 transition-colors">
                  Katalog Game Instan HTML5
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-cyan-300 transition-colors">
                  Mode Main Acak Cepat
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-cyan-300 transition-colors">
                  Papan Rekor Skor Offline
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-cyan-300 transition-colors">
                  Daftar Game Favorit Pribadi
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-cyan-300 transition-colors">
                  Responsif Layar HP, Tablet, &amp; Desktop
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Partner Resmi & Teks Wajib */}
          <div className="space-y-2.5">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Partner Teknologi Resmi</span>
            </h4>
            <p className="text-slate-300 text-xs leading-relaxed">
              Didukung oleh <strong className="text-white font-bold">PT Teknotama Prakarsa Mulia</strong>. Penyedia solusi infrastruktur IT, cloud system, data security, dan custom software development untuk akselerasi bisnis Anda.
            </p>
            <div className="pt-2">
              <a
                href="https://teknotama.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg btn-sponsor text-xs font-bold text-white shadow-md cursor-pointer"
              >
                <span>Kunjungi teknotama.com</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Baris Bawah: Hak Cipta & Tautan Induk */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px]">
          <p>© 2026 Tekno Game. Seluruh hak cipta dilindungi undang-undang.</p>
          <div className="flex items-center gap-4">
            <a
              href="https://teknotama.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#3b82f6] hover:text-cyan-300 transition-colors flex items-center gap-1 font-semibold"
            >
              <span>Portal Induk: teknotama.com</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
