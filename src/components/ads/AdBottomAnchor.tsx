"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink, ShieldCheck, Sparkles, EyeOff, Eye } from "lucide-react";

export default function AdBottomAnchor() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`fixed bottom-0 left-0 right-0 z-40 flex flex-col items-center pointer-events-none transition-transform duration-300 md:hidden ${
        isCollapsed ? "translate-y-[calc(100%-36px)]" : "translate-y-0"
      }`}
      aria-label="Iklan Sponsor Bawah Layar"
    >
      {/* Tombol Toggle Sembunyikan/Tampilkan Iklan - Touch target minimal 44px tinggi */}
      <div className="pointer-events-auto flex items-center justify-center">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Tampilkan Iklan Sponsor" : "Sembunyikan Iklan"}
          className="h-9 px-4 rounded-t-xl bg-[#021861] hover:bg-[#255dce]/40 text-slate-200 text-xs font-bold border-t border-x border-[#255dce]/50 shadow-xl flex items-center gap-2 cursor-pointer transition-colors backdrop-blur-md"
        >
          {isCollapsed ? (
            <>
              <Eye className="w-3.5 h-3.5 text-[#3b82f6]" />
              <span>Tampilkan Iklan</span>
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            </>
          ) : (
            <>
              <EyeOff className="w-3.5 h-3.5 text-rose-400" />
              <span>Sembunyikan Iklan</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </>
          )}
        </button>
      </div>

      {/* Wadah Banner Anti-CLS (Mobile 320x50 minimum, responsive max 480px) */}
      <div
        style={{ minHeight: "68px" }}
        className="pointer-events-auto w-full max-w-lg mx-auto bg-gradient-to-r from-[#021861] via-[#010B2E] to-[#255dce]/40 border-t border-x border-[#255dce]/50 shadow-2xl rounded-t-xl overflow-hidden px-3.5 py-2.5 flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#255dce]/30 border border-[#255dce]/60 flex items-center justify-center shrink-0 text-[#3b82f6] shadow-sm">
            <Sparkles className="w-5 h-5 text-cyan-300" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] bg-[#255dce] text-white font-extrabold uppercase px-1.5 py-0.5 rounded">
                SPONSOR
              </span>
              <span className="text-white text-xs font-bold truncate">
                PT Teknotama Prakarsa Mulia
              </span>
            </div>
            <p className="text-slate-300 text-[10px] truncate mt-0.5">
              Solusi IT, Cloud System, &amp; Software Development
            </p>
          </div>
        </div>

        <a
          href="https://teknotama.com"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-xl btn-burgundy text-xs font-black shadow-md flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
        >
          <span>Kunjungi</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </aside>
  );
}
