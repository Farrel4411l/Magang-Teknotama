"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Compass, Home, RefreshCw } from "lucide-react";

export default function NotFound() {
  // Auto-redirect to /games if accessed from root '/'
  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      if (path === "/" || path === "") {
        window.location.replace("/games");
      }
    }
  }, []);

  return (
    <div className="min-h-[55vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-20 h-20 rounded-3xl bg-[#021861] border border-[#255dce]/60 text-cyan-300 flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(37,93,206,0.4)] mb-6 animate-pulse">
        <Compass className="w-10 h-10 text-cyan-300" />
      </div>

      <span className="text-cyan-300 text-xs font-black tracking-widest uppercase mb-2">
        Error 404 • Halaman Tidak Ditemukan
      </span>

      <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-white mb-3">
        Tersesat di Luar Arena?
      </h1>

      <p className="text-slate-300 text-sm max-w-md leading-relaxed mb-8">
        Halaman yang Anda tuju tidak ditemukan atau telah dipindahkan. Website resmi Tekno Game aktif di sub-direktori{" "}
        <code className="text-cyan-300 bg-[#010B2E] px-2 py-0.5 rounded border border-[#255dce]/40 font-mono">
          /games
        </code>
        . Silakan kembali ke beranda melalui tombol di bawah:
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="px-6 py-3 rounded-xl btn-burgundy text-white font-bold text-sm flex items-center gap-2 shadow-lg active:scale-95 cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Beranda Tekno Game</span>
        </Link>

        <button
          type="button"
          onClick={() => {
            if (typeof window !== "undefined") {
              window.location.href = "/games";
            }
          }}
          className="px-5 py-3 rounded-xl bg-[#021861] hover:bg-[#255dce]/30 text-slate-200 border border-[#255dce]/50 font-bold text-sm flex items-center gap-2 transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 text-cyan-400" />
          <span>Muat Ulang /games</span>
        </button>
      </div>
    </div>
  );
}
