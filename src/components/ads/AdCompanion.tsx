"use client";

import React from "react";
import { ExternalLink } from "lucide-react";

export default function AdCompanion() {
  return (
    <div
      style={{ width: "300px", minHeight: "250px", height: "250px" }}
      className="relative w-[300px] h-[250px] min-h-[250px] rounded-2xl overflow-hidden card-natural p-5 shadow-lg flex flex-col justify-between"
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">
          Sponsor Resmi
        </span>
        <span className="text-[10px] text-white/40">300x250</span>
      </div>

      <div className="my-auto text-left space-y-1">
        <span className="text-[11px] font-semibold text-rose-200 uppercase tracking-wide block">
          PT Teknotama Prakarsa Mulia
        </span>
        <h4 className="font-heading text-sm sm:text-base font-bold text-white leading-snug">
          Solusi Cloud &amp; Transformasi Digital
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
          Infrastruktur IT, keamanan data, dan pembuatan software kustom untuk efisiensi bisnis Anda.
        </p>
      </div>

      <a
        href="https://teknotama.com"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-2.5 rounded-xl btn-sponsor-clean text-xs font-semibold shadow-sm flex items-center justify-center gap-1.5 transition-all"
      >
        <span>Kunjungi teknotama.com</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}
