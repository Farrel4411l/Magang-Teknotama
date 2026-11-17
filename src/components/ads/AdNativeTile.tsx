"use client";

import React from "react";
import { ExternalLink, Sparkles, Network } from "lucide-react";

export default function AdNativeTile() {
  return (
    <a
      href="https://teknotama.com"
      target="_blank"
      rel="noopener noreferrer"
      className="group relative aspect-square rounded-2xl bg-gradient-to-br from-[#021861] via-[#010B2E] to-[#255dce]/30 border border-[#255dce]/50 shadow-lg hover:shadow-[0_0_25px_rgba(37,93,206,0.35)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col justify-between p-4"
    >
      {/* Header Badge */}
      <div className="flex items-center justify-between z-10">
        <span className="text-[10px] font-black uppercase tracking-wider bg-[#255dce] text-white px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
          <Sparkles className="w-2.5 h-2.5 text-cyan-300" />
          <span>SPONSOR</span>
        </span>
        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
      </div>

      {/* Center Icon & Info */}
      <div className="flex flex-col items-center justify-center my-auto z-10 text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#021861] border border-[#255dce]/60 flex items-center justify-center text-[#3b82f6] shadow-md group-hover:scale-110 transition-transform">
          <Network className="w-6 h-6 text-cyan-400" />
        </div>
        <span className="text-white text-xs sm:text-sm font-bold mt-2 leading-tight line-clamp-1">
          Teknotama Solusi IT
        </span>
        <span className="text-[#3b82f6] text-[10px] sm:text-xs font-semibold">
          Infrastruktur &amp; Cloud Enterprise
        </span>
      </div>

      {/* Button CTA */}
      <div className="z-10 w-full text-center">
        <div className="w-full py-2 rounded-xl btn-burgundy text-xs font-bold transition-all shadow-md">
          <span>Kunjungi teknotama.com</span>
        </div>
      </div>
    </a>
  );
}
