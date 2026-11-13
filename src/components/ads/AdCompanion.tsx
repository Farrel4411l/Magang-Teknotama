"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, Sparkles, Zap } from "lucide-react";

export default function AdCompanion() {
  return (
    <div className="relative w-[300px] h-[250px] rounded-2xl overflow-hidden bg-gradient-to-br from-[#0B1222] via-[#0F172A] to-[#1E3A8A]/50 border border-cyan-500/30 p-4 shadow-xl flex flex-col justify-between group">
      {/* Glow Ambient */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />

      {/* Top Tag */}
      <div className="flex items-center justify-between z-10">
        <span className="text-[10px] font-black uppercase tracking-wider bg-cyan-500 text-slate-950 px-2 py-0.5 rounded-md flex items-center gap-1 shadow">
          <Zap className="w-2.5 h-2.5 fill-slate-950" />
          <span>TEKNO PARTNER</span>
        </span>
        <span className="text-[10px] text-slate-400 font-medium">300x250</span>
      </div>

      {/* Content */}
      <div className="z-10 my-auto text-left space-y-1">
        <span className="text-xs font-black text-cyan-400 uppercase tracking-wider block">
          LEVEL UP YOUR GEAR
        </span>
        <h4 className="text-base font-black text-white leading-tight">
          Performa Maksimal, Zero Latency!
        </h4>
        <p className="text-xs text-slate-300 line-clamp-2">
          Nikmati gameplay responsif dan grafis tajam tanpa hambatan di TeknoGame.
        </p>
      </div>

      {/* Action CTA Button */}
      <Link
        href="/"
        className="z-10 w-full py-2.5 bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 active:scale-95 text-slate-950 text-xs font-black rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all flex items-center justify-center gap-1.5"
      >
        <span>Jelajahi Info &gt;</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
