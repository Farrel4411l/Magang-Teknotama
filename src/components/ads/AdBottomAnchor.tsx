"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, ExternalLink, Zap } from "lucide-react";

export default function AdBottomAnchor() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 flex flex-col items-center pointer-events-none transition-transform duration-300 ${
        isCollapsed ? "translate-y-[calc(100%-28px)]" : "translate-y-0"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? "Buka Sponsor" : "Sembunyikan Sponsor"}
        className="pointer-events-auto bg-[#0B1222] hover:bg-[#070B14] text-white text-[10px] font-bold px-3 py-1 rounded-t-lg border-t border-x border-cyan-500/30 shadow-lg flex items-center gap-1.5 backdrop-blur-sm cursor-pointer transition-colors"
      >
        <span>{isCollapsed ? "Tampilkan Sponsor" : "Sembunyikan Sponsor"}</span>
        {isCollapsed ? (
          <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        )}
      </button>

      {/* Ad Banner Body (728x90 Desktop / 320x50 Mobile) */}
      <div className="pointer-events-auto w-full max-w-[728px] mx-auto bg-gradient-to-r from-[#070B14] via-[#0B1222] to-[#1E3A8A]/60 border-t border-x border-cyan-500/40 shadow-2xl rounded-t-xl overflow-hidden px-3 py-2 flex items-center justify-between gap-3">
        {/* Left Ad Info */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-2xl shadow-md shrink-0">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] bg-cyan-500 text-slate-950 font-black uppercase px-1.5 py-0.2 rounded">
                SPONSOR
              </span>
              <span className="text-white text-xs font-bold sm:text-sm">
                Tekno Gaming Pass &amp; Gear
              </span>
            </div>
            <p className="text-slate-300 text-[11px] hidden sm:block mt-0.5">
              Tingkatkan kecepatan dan pengalaman bermainmu dengan perlengkapan gaming pilihan!
            </p>
          </div>
        </div>

        {/* Right Action Button */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 active:scale-95 text-slate-950 text-xs font-black rounded-lg shadow-[0_0_12px_rgba(0,240,255,0.4)] transition-all"
          >
            <span>Cek Info</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
