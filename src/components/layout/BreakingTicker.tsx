import React from "react";
import Link from "next/link";
import { Zap, ChevronRight } from "lucide-react";

export default function BreakingTicker() {
  const tickerItems = [
    { text: "⚡ 2.450 Gamers Sedang Online & Bertanding!", href: "/" },
    { text: "🌐 Solusi IT & Transformasi Digital: Kunjungi teknotama.com", href: "https://teknotama.com", isExternal: true },
    { text: "🏆 Rekor Baru: 24.800 pts dipecahkan di Nusantara Runner!", href: "/play/nusantara-runner" },
    { text: "🏎️ Becak Drift: Arena Balap Malam Malioboro telah dibuka!", href: "/play/becak-drift" },
    { text: "🚀 Layanan Jaringan & Cloud Enterprise oleh Teknotama", href: "https://teknotama.com", isExternal: true },
    { text: "🎮 11 Game HTML5 Siap Dimainkan Instan Tanpa Download!", href: "/" },
    { text: "⚡ Cek Rekor Terbaikmu di Tekno Hall of Fame!", href: "/" },
  ];

  const renderItem = (item: (typeof tickerItems)[0], key: string | number) => {
    const content = (
      <>
        <span>{item.text}</span>
        <ChevronRight className="w-3 h-3 text-cyan-500/60 inline" />
      </>
    );

    if (item.isExternal) {
      return (
        <a
          key={key}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 hover:text-cyan-400 text-cyan-300 font-semibold transition-colors shrink-0"
        >
          {content}
        </a>
      );
    }

    return (
      <Link
        key={key}
        href={item.href}
        className="inline-flex items-center gap-1 hover:text-cyan-400 transition-colors shrink-0"
      >
        {content}
      </Link>
    );
  };

  return (
    <div className="bg-[#0B1222] text-slate-300 text-xs h-9 flex items-center overflow-hidden border-b border-cyan-500/20 shadow-md select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center gap-3">
        {/* Badge Ticker (Live Radar) */}
        <div className="shrink-0 flex items-center gap-1.5 bg-cyan-950/80 border border-cyan-500/40 px-2.5 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider text-cyan-300 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <Zap className="w-3 h-3 text-cyan-400 fill-cyan-400" />
          <span>LIVE RADAR</span>
        </div>

        {/* Marquis Container */}
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
