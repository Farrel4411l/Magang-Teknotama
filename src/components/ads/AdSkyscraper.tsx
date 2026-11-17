"use client";

import React from "react";
import { ExternalLink, ShieldCheck, Cpu, Database, Network } from "lucide-react";

interface AdSkyscraperProps {
  position: "left" | "right";
  slotId?: string;
}

export default function AdSkyscraper({ position }: AdSkyscraperProps) {
  const isLeft = position === "left";

  return (
    <aside
      className={`hidden 2xl:block fixed top-24 z-30 w-[160px] ${
        isLeft ? "left-3" : "right-3"
      }`}
      aria-label={`Iklan Sponsor ${isLeft ? "Kiri" : "Kanan"}`}
    >
      <div className="flex flex-col items-center">
        {/* Label Transparansi Google Ads */}
        <div className="flex items-center gap-1 text-[9px] uppercase font-bold tracking-widest text-slate-400 mb-1">
          <ShieldCheck className="w-2.5 h-2.5 text-[#255dce]" />
          <span>SPONSOR RESMI</span>
        </div>

        {/* Container Banner 160x600 Anti-CLS */}
        <div
          style={{ width: "160px", minHeight: "600px", height: "600px" }}
          className="w-[160px] h-[600px] min-h-[600px] bg-gradient-to-b from-[#021861] via-[#010B2E] to-[#255dce]/20 rounded-2xl border border-[#255dce]/40 shadow-2xl overflow-hidden flex flex-col justify-between p-3.5 relative group"
        >
          {/* Subtle Ambient Radial */}
          <div className="absolute inset-0 bg-radial from-[#255dce]/15 via-transparent to-transparent pointer-events-none" />

          {/* Top Header */}
          <div className="relative z-10 text-center">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#255dce]/20 text-[#3b82f6] border border-[#255dce]/40 mb-2">
              PT TEKNOTAMA
            </span>
            <h4 className="text-white text-xs font-bold leading-tight">
              {isLeft ? "Infrastruktur IT & Cloud System" : "Data Security & Custom Software"}
            </h4>
            <p className="text-slate-300 text-[10px] mt-1.5 leading-snug">
              {isLeft
                ? "Perancangan arsitektur jaringan andal dan skalabel untuk perusahaan."
                : "Keamanan data tingkat enterprise dan software kustom siap pakai."}
            </p>
          </div>

          {/* Icon Tech Visualization */}
          <div className="relative z-10 flex flex-col items-center justify-center my-auto">
            <div className="w-20 h-20 rounded-2xl bg-[#021861]/80 border border-[#255dce]/50 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
              {isLeft ? (
                <Network className="w-9 h-9 text-[#3b82f6]" />
              ) : (
                <Database className="w-9 h-9 text-[#3b82f6]" />
              )}
            </div>
            <span className="mt-3 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wide bg-[#255dce]/30 text-cyan-300 border border-[#255dce]/40">
              {isLeft ? "CLOUD & NETWORK" : "CYBER DEFENSE"}
            </span>
          </div>

          {/* Bottom CTA */}
          <div className="relative z-10 text-center">
            <a
              href="https://teknotama.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-2.5 px-3 rounded-xl btn-burgundy text-[11px] font-black text-center shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <span>Pelajari Solusi</span>
              <ExternalLink className="w-3 h-3 inline ml-1" />
            </a>
            <span className="text-[9px] text-slate-400 block mt-1.5 font-medium">
              teknotama.com
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
