"use client";

import React from "react";
import { ExternalLink, ShieldCheck, Sparkles } from "lucide-react";

interface GoogleAdSlotProps {
  slotType?: "skyscraper-160x600" | "leaderboard-728x90" | "mobile-anchor-320x50" | "rectangle-300x250";
  minWidth: number;
  minHeight: number;
  adClient?: string;
  adSlot?: string;
  className?: string;
  fallbackTitle?: string;
  fallbackSubtitle?: string;
  fallbackUrl?: string;
}

export default function GoogleAdSlot({
  slotType,
  minWidth,
  minHeight,
  adClient,
  adSlot,
  className = "",
  fallbackTitle = "Solusi Teknologi & Cloud",
  fallbackSubtitle = "PT Teknotama Prakarsa Mulia",
  fallbackUrl = "https://teknotama.com",
}: GoogleAdSlotProps) {
  return (
    <div
      style={{
        minWidth: `${minWidth}px`,
        minHeight: `${minHeight}px`,
      }}
      className={`relative overflow-hidden flex flex-col justify-between rounded-xl bg-gradient-to-b from-[#021861]/70 via-[#010B2E] to-[#255dce]/20 border border-[#255dce]/40 shadow-lg text-slate-300 ${className}`}
      aria-label="Slot Iklan Resmi"
    >
      {/* Label Iklan Transparan Sesuai Kebijakan Google */}
      <div className="absolute top-1 right-2 z-10 flex items-center gap-1 text-[9px] uppercase font-bold tracking-widest text-slate-400/80">
        <ShieldCheck className="w-2.5 h-2.5 text-[#255dce]" />
        <span>SPONSOR</span>
      </div>

      {/* Konten Iklan Sponsor / Google Ads Fallback */}
      <div className="relative z-10 h-full w-full flex flex-col items-center justify-center p-3 text-center">
        <span className="text-[10px] font-black uppercase tracking-wider text-[#3b82f6] px-2 py-0.5 rounded-full bg-[#255dce]/20 border border-[#255dce]/40 mb-1.5 flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
          <span>TEKNOTAMA</span>
        </span>
        <h4 className="text-xs font-bold text-white leading-tight line-clamp-2 max-w-[90%]">
          {fallbackTitle}
        </h4>
        <p className="text-[10px] text-slate-300/90 mt-1 line-clamp-2 leading-relaxed">
          {fallbackSubtitle}
        </p>

        <a
          href={fallbackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg btn-burgundy text-[11px] font-bold shadow-md cursor-pointer"
        >
          <span>Kunjungi Website</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Subtle Glow Background Accent */}
      <div className="absolute inset-0 bg-radial from-[#255dce]/10 to-transparent pointer-events-none" />
    </div>
  );
}
