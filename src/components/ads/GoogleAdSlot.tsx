"use client";

import React from "react";
import { ExternalLink } from "lucide-react";

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
      className={`relative overflow-hidden flex flex-col justify-between rounded-2xl card-natural shadow-md text-slate-300 ${className}`}
      aria-label="Slot Sponsor Resmi"
    >
      <div className="absolute top-2 right-3 z-10 text-[9px] uppercase font-semibold text-white/40 tracking-wider">
        Sponsor
      </div>

      <div className="relative z-10 h-full w-full flex flex-col items-center justify-center p-4 text-center">
        <span className="text-[10px] font-semibold uppercase text-rose-200 tracking-wider mb-1">
          PT Teknotama
        </span>
        <h4 className="font-heading text-xs sm:text-sm font-semibold text-white leading-snug line-clamp-2 max-w-[90%]">
          {fallbackTitle}
        </h4>
        <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
          {fallbackSubtitle}
        </p>

        <a
          href={fallbackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg btn-sponsor-clean text-[11px] font-semibold shadow-sm cursor-pointer"
        >
          <span>Kunjungi Website</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
