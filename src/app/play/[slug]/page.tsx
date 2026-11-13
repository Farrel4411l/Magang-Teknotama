import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getGameBySlug, INITIAL_GAMES } from "@/lib/games-data";
import GameFrame from "@/components/game/GameFrame";
import AdCompanion from "@/components/ads/AdCompanion";
import GameCard from "@/components/game/GameCard";
import { ArrowLeft, Keyboard, Smartphone, Info, Zap } from "lucide-react";

interface PlayPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PlayPage({ params }: PlayPageProps) {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) {
    notFound();
  }

  const relatedGames = INITIAL_GAMES.filter(
    (g) => g.id !== game.id && (g.category === game.category || g.featured)
  ).slice(0, 7);

  return (
    <div className="pt-4 space-y-6">
      {/* Breadcrumb / Back Link */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
        <Link
          href="/"
          className="inline-flex items-center gap-1 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Arena</span>
        </Link>
        <span>/</span>
        <span className="uppercase text-cyan-400/80 font-bold">{game.category}</span>
        <span>/</span>
        <span className="text-white font-bold">{game.title}</span>
      </div>

      {/* Main Gameplay Layout: Game Frame + Sidebar Companion */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Left Column: Game Iframe Container (Span 3) */}
        <div className="xl:col-span-3 space-y-6">
          <GameFrame game={game} />

          {/* Description & Controls Guide Card */}
          <div className="bg-[#0B1222] rounded-3xl border border-slate-800 p-6 shadow-xl space-y-4 text-slate-300">
            <div>
              <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                <Info className="w-4 h-4 text-cyan-400" />
                <span>Tentang {game.title}</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
                {game.description}
              </p>
            </div>

            {/* Controls Guide */}
            {game.controlsGuide && (
              <div className="pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Keyboard className="w-3.5 h-3.5" />
                  <span>Petunjuk Tombol Kendali</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {game.controlsGuide.keyboard && (
                    <div className="bg-[#070B14] p-3 rounded-xl border border-slate-800">
                      <span className="font-bold text-slate-200 block mb-1">
                        💻 Keyboard Komputer:
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-slate-400">
                        {game.controlsGuide.keyboard.map((k, idx) => (
                          <li key={idx}>{k}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {game.controlsGuide.touch && (
                    <div className="bg-[#070B14] p-3 rounded-xl border border-slate-800">
                      <span className="font-bold text-slate-200 block mb-1 flex items-center gap-1">
                        <Smartphone className="w-3.5 h-3.5 text-cyan-400" /> Layar Sentuh / HP:
                      </span>
                      <p className="text-slate-400">{game.controlsGuide.touch}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Companion Ad (300x250) + Tekno Partner */}
        <div className="xl:col-span-1 space-y-6 flex flex-col items-center xl:items-start">
          {/* Ad Companion Banner 300x250 */}
          <AdCompanion />

          {/* Sinergi Tekno Partner Arena Card */}
          <div className="w-[300px] bg-gradient-to-br from-blue-950 via-[#0B1222] to-slate-950 text-white p-5 rounded-2xl shadow-xl border border-cyan-500/30 space-y-3">
            <span className="text-[10px] uppercase font-black bg-cyan-500/20 text-cyan-300 px-2.5 py-0.5 rounded-full inline-block border border-cyan-500/30">
              PROMO &amp; PARTNER
            </span>
            <h4 className="text-sm font-black leading-tight text-white">
              Solusi IT &amp; Transformasi Digital
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Konsultasikan kebutuhan infrastruktur IT, cloud network, pembuatan aplikasi kustom, dan keamanan data enterprise bersama PT Teknotama Prakarsa Mulia.
            </p>
            <div className="pt-1">
              <a
                href="https://teknotama.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-2 bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 text-xs font-black rounded-xl text-center shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
              >
                Kunjungi teknotama.com &gt;
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Related Games (Friv Grid Small) */}
      <section className="pt-6">
        <h3 className="text-base font-black text-white mb-4 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
          <span>Game Seru Lainnya Untukmu</span>
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
          {relatedGames.map((g) => (
            <GameCard key={g.id} game={g} />
          ))}
        </div>
      </section>
    </div>
  );
}
