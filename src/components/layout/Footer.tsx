import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Gamepad2, Shield, Zap, Trophy, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0B1222] text-slate-400 text-xs border-t border-slate-800 mt-16 pt-12 pb-24 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Kolom 1: Brand Info */}
          <div className="space-y-3">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-cyan-500/40 shrink-0">
                <Image
                  src="/teknogame-icon.png"
                  alt="TeknoGame Icon"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-base font-black tracking-wider text-white">TEKNO</span>
                  <span className="text-base font-black tracking-wider bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    GAME
                  </span>
                </div>
                <span className="text-[8px] uppercase font-bold tracking-widest text-cyan-400/80 -mt-0.5">
                  PLAY. EVOLVE. CONQUER.
                </span>
              </div>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed">
              Portal game web HTML5 instan terkemuka. Mainkan ratusan game aksi, petualangan, balap, arcade, dan puzzle seru secara gratis tanpa install!
            </p>
          </div>

          {/* Kolom 2: Kategori Game */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Arena Game</span>
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/category/arcade" className="hover:text-cyan-400 transition-colors">
                  🕹️ Game Arcade Klasik
                </Link>
              </li>
              <li>
                <Link href="/category/adventure" className="hover:text-cyan-400 transition-colors">
                  🧭 Petualangan & Eksplorasi
                </Link>
              </li>
              <li>
                <Link href="/category/puzzle" className="hover:text-cyan-400 transition-colors">
                  🧩 Puzzle & Asah Otak
                </Link>
              </li>
              <li>
                <Link href="/category/casual" className="hover:text-cyan-400 transition-colors">
                  ☕ Santai & Kasual
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Fitur & Komunitas */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Fitur Gamer</span>
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-cyan-400 transition-colors">
                  ⚡ Mode Main Acak
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-cyan-400 transition-colors">
                  🏆 Tekno Hall of Fame
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-cyan-400 transition-colors">
                  💾 Simpan Skor Otomatis
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-cyan-400 transition-colors">
                  🚀 100% Bebas Lag & Tanpa Install
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Jaminan Privasi & Sistem */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Keamanan & Privasi</span>
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              TeknoGame beroperasi dengan arsitektur bebas database server. Seluruh riwayat skor dan game favoritmu tersimpan aman di browser lokal tanpa pengumpulan data pribadi.
            </p>
          </div>
        </div>

        {/* Baris Bawah: Hak Cipta & Slogan */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <p>© 2026 TeknoGame. All rights reserved. <span className="text-cyan-400 font-bold">PLAY. EVOLVE. CONQUER.</span></p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" /> for Gamers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
