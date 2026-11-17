"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { CATEGORIES } from "@/lib/games-data";

export default function Footer() {
  return (
    <footer className="bg-black/30 border-t border-white/10 text-slate-300 text-xs mt-20 pt-12 pb-24 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          {/* Kolom 1: Brand Info */}
          <div className="space-y-3">
            <Link href="/" className="inline-flex items-center gap-2.5 group select-none">
              <div className="relative w-10 h-10 shrink-0">
                <Image
                  src="/games/Teknogame_logo_only.png"
                  alt="Logo Tekno Game"
                  fill
                  sizes="40px"
                  className="object-contain"
                />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-heading text-lg font-bold text-white">
                  Tekno
                </span>
                <span className="font-heading text-lg font-bold text-rose-300">
                  Game
                </span>
              </div>
            </Link>
            <p className="text-slate-300 text-xs leading-relaxed">
              Portal game web HTML5 resmi persembahan PT Teknotama Prakarsa Mulia. Mainkan game seru gratis tanpa install langsung di browser Anda.
            </p>
          </div>

          {/* Kolom 2: Kategori Permainan */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">
              Kategori
            </h4>
            <ul className="space-y-2">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={cat.id === "all" ? "/" : `/category/${cat.id}`}
                    className="hover:text-white transition-colors"
                  >
                    <span>{cat.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Navigasi Cepat */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">
              Navigasi
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Katalog Game
                </Link>
              </li>
              <li>
                <a
                  href="https://teknotama.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>Website Utama Teknotama</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Partner Resmi & Teks Wajib */}
          <div className="space-y-2">
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-2">
              Partner Teknologi Resmi
            </h4>
            <p className="text-slate-300 text-xs leading-relaxed">
              Didukung oleh <strong className="text-white font-semibold">PT Teknotama Prakarsa Mulia</strong>. Penyedia solusi infrastruktur IT, cloud system, data security, dan custom software development untuk akselerasi bisnis Anda.
            </p>
            <div className="pt-2">
              <a
                href="https://teknotama.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg btn-sponsor-clean text-xs font-medium shadow-sm cursor-pointer"
              >
                <span>Kunjungi teknotama.com</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Baris Bawah */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px]">
          <p>© 2026 Tekno Game. Seluruh hak cipta dilindungi undang-undang.</p>
          <div className="flex items-center gap-4">
            <a
              href="https://teknotama.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-rose-200 hover:text-white transition-colors flex items-center gap-1"
            >
              <span>PT Teknotama Prakarsa Mulia</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
