import React from "react";
import { Sparkles, ExternalLink, Zap } from "lucide-react";

export default function AdNativeTile() {
  return (
    <a
      href="https://teknotama.com"
      target="_blank"
      rel="noopener noreferrer"
      className="group relative aspect-square rounded-2xl bg-gradient-to-br from-[#0B1222] via-[#0F172A] to-[#1E3A8A]/40 border-2 border-dashed border-cyan-500/40 shadow-lg hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:scale-105 transition-all duration-200 overflow-hidden flex flex-col justify-between p-3.5"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between z-10">
        <span className="text-[10px] font-black uppercase tracking-wider bg-cyan-500 text-slate-950 px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
          <Zap className="w-2.5 h-2.5 fill-slate-950" />
          <span>PROMO PARTNER</span>
        </span>
        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
      </div>

      {/* Center Visual Icon */}
      <div className="flex flex-col items-center justify-center my-auto z-10 text-center">
        <span className="text-3xl sm:text-4xl filter drop-shadow group-hover:rotate-6 transition-transform">
          🌐
        </span>
        <span className="text-white text-xs sm:text-sm font-bold mt-1 leading-tight line-clamp-1">
          Teknotama Solutions
        </span>
        <span className="text-cyan-400 text-[10px] sm:text-xs font-semibold">
          IT &amp; Cloud Infrastructure
        </span>
      </div>

      {/* Bottom Button Pill */}
      <div className="z-10 w-full text-center">
        <div className="w-full py-1.5 bg-cyan-500/90 group-hover:bg-cyan-400 text-slate-950 text-[11px] font-black rounded-lg transition-colors">
          Cek di teknotama.com &gt;
        </div>
      </div>
    </a>
  );
}
