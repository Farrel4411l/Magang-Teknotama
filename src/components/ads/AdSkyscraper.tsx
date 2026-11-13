"use client";

import React from "react";
import Link from "next/link";
import { Zap } from "lucide-react";

interface AdSkyscraperProps {
  position: "left" | "right";
  slotId?: string;
}

export default function AdSkyscraper({ position }: AdSkyscraperProps) {
  return (
    <aside
      className={`hidden 2xl:block fixed top-32 z-30 w-[160px] ${
        position === "left" ? "left-3" : "right-3"
      }`}
      aria-label={`Advertisement ${position}`}
    >
      <div className="flex flex-col items-center">
        {/* Label Iklan Sesuai Kebijakan Google */}
        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1">
          SPONSOR
        </span>

        {/* Container Banner 160x600 */}
        <div className="w-[160px] h-[600px] bg-gradient-to-b from-[#070B14] via-[#0B1222] to-[#1E3A8A]/50 rounded-xl border border-cyan-500/30 shadow-2xl overflow-hidden flex flex-col justify-between p-3 relative group">
          {/* Subtle Glow Background */}
          <div className="absolute inset-0 bg-cyan-500/10 opacity-30 group-hover:opacity-50 transition-opacity pointer-events-none" />

          {/* Top Brand / Sponsor Header */}
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-1 bg-cyan-500 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full mb-2 shadow">
              <Zap className="w-2.5 h-2.5 fill-slate-950" />
              <span>PROMO TEKNOTAMA</span>
            </div>
            <h4 className="text-white text-xs font-bold leading-tight">
              {position === "left" ? "Solusi Jaringan & Cloud" : "Custom Software & Security"}
            </h4>
            <p className="text-slate-300 text-[10px] mt-1 leading-snug">
              {position === "left"
                ? "Perancangan & instalasi network infrastructure handal untuk bisnis."
                : "Pengembangan web/mobile apps & sistem data security terpercaya."}
            </p>
          </div>

          {/* Visual Graphic Element */}
          <div className="relative z-10 flex flex-col items-center justify-center my-4">
            <div className="w-24 h-24 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(0,240,255,0.2)] group-hover:scale-105 transition-transform duration-300">
              {position === "left" ? "🌐" : "🛡️"}
            </div>
            <div className="mt-3 px-2 py-1 bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-[10px] uppercase rounded-md shadow">
              {position === "left" ? "IT INFRASTRUCTURE" : "DIGITAL SOLUTION"}
            </div>
          </div>

          {/* Bottom Call to Action */}
          <div className="relative z-10 text-center">
            <a
              href="https://teknotama.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-2 px-3 bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 active:scale-95 text-slate-950 text-xs font-black rounded-lg shadow-md transition-all text-center shadow-[0_0_12px_rgba(0,240,255,0.3)]"
            >
              Kunjungi Teknotama &gt;
            </a>
            <span className="text-[9px] text-cyan-400/80 block mt-1 font-semibold">
              teknotama.com
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
