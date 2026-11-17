"use client";

import React from "react";
import { ExternalLink, Sparkles, ShieldCheck } from "lucide-react";

export default function AdCompanion() {
  return (
    <div
      style={{ width: "300px", minHeight: "250px", height: "250px" }}
      className="relative w-[300px] h-[250px] min-h-[250px] rounded-2xl overflow-hidden bg-gradient-to-br from-[#021861] via-[#010B2E] to-[#255dce]/40 border border-[#255dce]/50 p-5 shadow-xl flex flex-col justify-between group"
    >
      {/* Ambient Radial */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#255dce]/20 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header Tag */}
      <div className="flex items-center justify-between z-10">
        <span className="text-[10px] font-black uppercase tracking-wider bg-[#255dce] text-white px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
          <ShieldCheck className="w-2.5 h-2.5 text-cyan-300" />
          <span>SPONSOR RESMI</span>
        </span>
        <span className="text-[10px] text-slate-400 font-medium">300x250</span>
      </div>

      {/* Main Copy */}
      <div className="z-10 my-auto text-left space-y-1.5">
        <span className="text-xs font-black text-[#3b82f6] uppercase tracking-wider block">
          PT TEKNOTAMA PRAKARSA MULIA
        </span>
        <h4 className="text-base font-bold text-white leading-tight">
          Solusi Cloud &amp; Infrastruktur IT Handal
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
          Perancangan arsitektur jaringan, data security, dan pembuatan software kustom untuk transformasi digital Anda.
        </p>
      </div>

      {/* CTA Button */}
      <a
        href="https://teknotama.com"
        target="_blank"
        rel="noopener noreferrer"
        className="z-10 w-full py-2.5 rounded-xl btn-burgundy text-xs font-black shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all"
      >
        <span>Kunjungi teknotama.com</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}
