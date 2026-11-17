"use client";

import React from "react";
import { ExternalLink } from "lucide-react";

export default function AdNativeTile() {
  return (
    <a
      href="https://teknotama.com"
      target="_blank"
      rel="noopener noreferrer"
      className="group relative rounded-2xl overflow-hidden card-natural flex flex-col justify-between aspect-square p-4 transition-all duration-200"
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">
          Sponsor
        </span>
        <ExternalLink className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition-colors" />
      </div>

      <div className="my-auto text-center space-y-1">
        <h4 className="font-heading text-sm font-bold text-white leading-snug">
          PT Teknotama Prakarsa Mulia
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          Infrastruktur IT, Cloud System &amp; Custom Software
        </p>
      </div>

      <div>
        <div className="w-full py-2 rounded-xl btn-sponsor-clean text-xs font-semibold text-center shadow-sm">
          <span>Kunjungi Website</span>
        </div>
      </div>
    </a>
  );
}
