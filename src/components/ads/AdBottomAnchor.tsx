"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink, EyeOff, Eye } from "lucide-react";

export default function AdBottomAnchor() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`fixed bottom-0 left-0 right-0 z-40 flex flex-col items-center pointer-events-none transition-transform duration-200 md:hidden ${
        isCollapsed ? "translate-y-[calc(100%-32px)]" : "translate-y-0"
      }`}
      aria-label="Sponsor Bawah Layar"
    >
      <div className="pointer-events-auto flex items-center justify-center">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Tampilkan Iklan" : "Sembunyikan Iklan"}
          className="h-8 px-3 rounded-t-xl bg-[#18225e] hover:bg-[#242e75] text-slate-200 text-[11px] font-medium border-t border-x border-white/10 shadow-md flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          {isCollapsed ? (
            <>
              <Eye className="w-3 h-3 text-cyan-300" />
              <span>Tampilkan Iklan</span>
              <ChevronUp className="w-3 h-3 text-slate-400" />
            </>
          ) : (
            <>
              <EyeOff className="w-3 h-3 text-rose-300" />
              <span>Sembunyikan Iklan</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </>
          )}
        </button>
      </div>

      <div
        style={{ minHeight: "60px" }}
        className="pointer-events-auto w-full max-w-md mx-auto bg-[#141b47] border-t border-x border-white/10 shadow-xl rounded-t-xl overflow-hidden px-3.5 py-2 flex items-center justify-between gap-3"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] bg-white/15 text-white font-bold uppercase px-1.5 py-0.5 rounded">
              Sponsor
            </span>
            <span className="text-white text-xs font-semibold truncate">
              PT Teknotama Prakarsa Mulia
            </span>
          </div>
          <p className="text-slate-300 text-[10px] truncate mt-0.5">
            Solusi IT, Cloud System, &amp; Software Development
          </p>
        </div>

        <a
          href="https://teknotama.com"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-3 py-1.5 rounded-lg btn-sponsor-clean text-xs font-semibold shadow-sm flex items-center gap-1"
        >
          <span>Kunjungi</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </aside>
  );
}
