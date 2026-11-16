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
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-cyan-500/40 text-cyan-400 flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(0,240,255,0.2)] mb-6 animate-pulse">
        <Compass className="w-10 h-10 text-cyan-400" />
      </div>

      <span className="text-cyan-400 text-xs font-black tracking-widest uppercase mb-2">
        Error 404 • Halaman Tidak Ditemukan
      </span>

      <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
        Tersesat di Luar Arena?
      </h1>

      <p className="text-slate-400 text-sm max-w-md leading-relaxed mb-8">
        Halaman yang Anda tuju tidak ditemukan. Website TeknoGame aktif di jalur subfolder{" "}
        <code className="text-cyan-300 bg-slate-900 px-2 py-0.5 rounded border border-cyan-500/30">
          /games
        </code>
        . Silakan buka melalui tautan resmi di bawah ini:
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.35)] transition-all active:scale-95 cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Buka Beranda TeknoGame (/games)</span>
        </Link>

        <button
          type="button"
          onClick={() => {
            if (typeof window !== "undefined") {
              window.location.href = "/games";
            }
          }}
          className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm flex items-center gap-2 transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 text-cyan-400" />
          <span>Muat Ulang /games</span>
        </button>
      </div>
    </div>
  );
}
