"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { CATEGORIES } from "@/lib/games-data";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-[#080d18]/80 pt-12 pb-24 text-xs text-slate-300 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          {/* Kolom 1: Identitas */}
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
                <span className="font-heading text-lg font-bold text-[#8caeff]">
                  Game
                </span>
              </div>
            </Link>
            <p className="text-slate-300 text-xs leading-relaxed">
              Portal permainan web HTML5 resmi persembahan PT Teknotama Prakarsa Mulia. Mainkan permainan gratis langsung di peramban tanpa perlu memasang aplikasi.
            </p>
          </div>

          {/* Kolom 2: Kategori permainan */}
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

          {/* Kolom 3: Navigasi */}
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
                  Katalog Permainan
                </Link>
              </li>
              <li>
                <a
                  href="https://teknotama.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>Situs utama Teknotama</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Mitra */}
          <div className="space-y-2">
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-2">
              Partner Teknologi Resmi
            </h4>
            <p className="text-slate-300 text-xs leading-relaxed">
              Didukung oleh <strong className="text-white font-semibold">PT Teknotama Prakarsa Mulia</strong>, penyedia solusi infrastruktur teknologi informasi, sistem awan, keamanan data, dan pengembangan perangkat lunak khusus untuk mendukung bisnis Anda.
            </p>
            <div className="pt-2">
              <a
                href="https://teknotama.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 py-1.5 btn-sponsor-clean text-xs font-medium shadow-sm"
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
              className="flex items-center gap-1 text-[#8caeff] hover:text-white transition-colors"
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
