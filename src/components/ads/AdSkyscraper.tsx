"use client";

import React from "react";
import { ExternalLink } from "lucide-react";

interface AdSkyscraperProps {
  position: "left" | "right";
  slotId?: string;
}

export default function AdSkyscraper({ position }: AdSkyscraperProps) {
  const isLeft = position === "left";

  return (
    <aside
      className={`hidden min-[1680px]:block fixed top-24 z-20 w-[160px] ${
        isLeft
          ? "left-[calc((100vw-1280px)/2-180px)]"
          : "right-[calc((100vw-1280px)/2-180px)]"
      }`}
      aria-label={`Sponsor ${isLeft ? "Kiri" : "Kanan"}`}
    >
      <div className="flex flex-col items-center">
        <span className="text-[10px] uppercase font-semibold tracking-wider text-white/50 mb-1.5">
          Sponsor
        </span>

        {/* Container Banner 160x600 Anti-CLS */}
        <div
          style={{ width: "160px", minHeight: "600px", height: "600px" }}
          className="w-[160px] h-[600px] min-h-[600px] rounded-2xl card-natural p-4 flex flex-col justify-between text-center relative overflow-hidden"
        >
          <div>
            <span className="text-[10px] font-bold text-white/70 uppercase tracking-wide block mb-1">
              PT Teknotama
            </span>
            <h4 className="text-white text-xs font-bold leading-snug">
              {isLeft ? "Infrastruktur & Cloud System" : "Keamanan Data Enterprise"}
            </h4>
            <p className="text-slate-300 text-[11px] mt-2 leading-relaxed">
              {isLeft
                ? "Solusi arsitektur jaringan handal dan terintegrasi untuk bisnis."
                : "Pengembangan software kustom dan keamanan data digital."}
            </p>
          </div>

          <div>
            <a
              href="https://teknotama.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-2.5 px-2 rounded-xl btn-sponsor-clean text-xs font-bold shadow-md cursor-pointer transition-all"
            >
              <span>Kunjungi Kami</span>
              <ExternalLink className="w-3 h-3 inline ml-1" />
            </a>
            <span className="text-[10px] text-white/50 block mt-2">
              teknotama.com
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
