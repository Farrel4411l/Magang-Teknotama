"use client";

import React from "react";
import Link from "next/link";
import { Zap, ChevronRight, Trophy, Flame, ShieldCheck, Gamepad2, Radio } from "lucide-react";

export default function BreakingTicker() {
  const tickerItems = [
    { icon: <Zap className="w-3.5 h-3.5 text-cyan-400" />, text: "Ribuan Gamers Aktif Bertanding di Seluruh Indonesia!", href: "/" },
    { icon: <ShieldCheck className="w-3.5 h-3.5 text-[#3b82f6]" />, text: "Solusi IT & Keamanan Cloud Enterprise: Kunjungi teknotama.com", href: "https://teknotama.com", isExternal: true },
    { icon: <Trophy className="w-3.5 h-3.5 text-amber-400" />, text: "Rekor Baru Tercipta di Nusantara Runner! Cek Papan Skor Sekarang", href: "/play/nusantara-runner" },
    { icon: <Flame className="w-3.5 h-3.5 text-rose-400" />, text: "Becak Drift: Sensasi drifting di sudut Malioboro Jogja!", href: "/play/becak-drift" },
    { icon: <Gamepad2 className="w-3.5 h-3.5 text-emerald-400" />, text: "12 Game Web HTML5 Pilihan Siap Dimainkan Instan Bebas Install!", href: "/" },
    { icon: <Zap className="w-3.5 h-3.5 text-cyan-400" />, text: "Simpan Game Kesukaanmu dengan Menekan Ikon Hati Favorit!", href: "/" },
  ];

  const renderItem = (item: (typeof tickerItems)[0], key: string | number) => {
    const content = (
      <span className="inline-flex items-center gap-1.5 hover:text-cyan-300 transition-colors">
        {item.icon}
        <span>{item.text}</span>
        <ChevronRight className="w-3 h-3 text-[#255dce] inline" />
      </span>
    );

    if (item.isExternal) {
      return (
        <a
          key={key}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-slate-200 font-medium"
        >
          {content}
        </a>
      );
    }

    return (
      <Link key={key} href={item.href} className="shrink-0 text-slate-200 font-medium">
        {content}
      </Link>
    );
  };

  return (
    <div className="bg-[#010B2E] text-slate-300 text-xs h-9 flex items-center overflow-hidden border-b border-[#255dce]/30 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center gap-3">
        {/* Badge Ticker (Live Radar) */}
        <div className="shrink-0 flex items-center gap-1.5 bg-[#021861] border border-[#255dce]/50 px-2.5 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider text-cyan-300 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <Radio className="w-3 h-3 text-[#3b82f6]" />
          <span>RADAR TEKNO</span>
        </div>

        {/* Marquee Container */}
        <div className="flex-1 overflow-hidden relative">
          <div className="animate-ticker flex items-center gap-8 text-slate-300 font-medium">
            {tickerItems.map((item, index) => renderItem(item, index))}
            {/* Duplikasi untuk looping mulus */}
            {tickerItems.map((item, index) => renderItem(item, `dup-${index}`))}
          </div>
        </div>
      </div>
    </div>
  );
}
