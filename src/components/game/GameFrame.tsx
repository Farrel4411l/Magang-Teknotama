"use client";

import React, { useState, useEffect, useRef } from "react";
import { Game } from "@/types/game";
import {
  Maximize,
  Minimize,
  RotateCcw,
  Heart,
  Share2,
  Trophy,
  Sparkles,
  Check,
  X,
} from "lucide-react";
import {
  toggleLocalFavorite,
  getLocalFavorites,
  addRecentGame,
  saveLocalScore,
} from "@/lib/local-storage";

interface GameFrameProps {
  game: Game;
  onOpenLeaderboard?: () => void;
}

export default function GameFrame({ game, onOpenLeaderboard }: GameFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lastScore, setLastScore] = useState<number | null>(null);

  // Initialize favorite and record recent play
  useEffect(() => {
    const favs = getLocalFavorites();
    setIsFavorite(favs.includes(game.id));
    addRecentGame(game.id);
  }, [game.id]);

  // Listen to postMessage from internal HTML5 game iframe
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === "GAME_OVER") {
        const score = Number(e.data.score) || 0;
        setLastScore(score);
        saveLocalScore(game.id, score);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [game.id]);

  // Auto-close score popup banner after 2 seconds (2000ms)
  useEffect(() => {
    if (lastScore !== null) {
      const timer = setTimeout(() => {
        setLastScore(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [lastScore]);

  const handleToggleFavorite = () => {
    const next = toggleLocalFavorite(game.id);
    setIsFavorite(next);
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  const handleReload = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${game.title} - TeknoGame`,
        text: `Ayo mainkan game seru ${game.title} di TeknoGame sekarang!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Game Iframe Wrapper (Cyber Theater Mode) */}
      <div
        ref={containerRef}
        className={`relative w-full rounded-3xl overflow-hidden bg-slate-950 border border-cyan-500/30 shadow-[0_0_35px_rgba(0,240,255,0.12)] transition-all ${
          isFullscreen ? "h-screen rounded-none" : "h-[450px] sm:h-[540px] md:h-[600px]"
        }`}
      >
        <iframe
          ref={iframeRef}
          src={`/games${game.gamePath.startsWith("/") ? game.gamePath : `/${game.gamePath}`}`}
          title={game.title}
          className="w-full h-full border-0 select-none"
          allow="autoplay; fullscreen; pointer-lock"
          sandbox="allow-scripts allow-same-origin allow-pointer-lock"
        />

        {/* Score Achievement Banner Overlay (When Game Over Emitted) */}
        {lastScore !== null && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-[#0B1222]/95 border border-cyan-500/80 rounded-2xl p-4 shadow-[0_0_30px_rgba(0,240,255,0.3)] text-white flex flex-col sm:flex-row items-center gap-4 backdrop-blur-md animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 flex items-center justify-center text-xl shrink-0 shadow-lg">
                🏆
              </div>
              <div>
                <span className="text-xs text-slate-300 block">Game Selesai! Skor Kamu:</span>
                <span className="text-lg font-black bg-gradient-to-r from-cyan-300 to-amber-400 bg-clip-text text-transparent">
                  {lastScore.toLocaleString("id-ID")} pts
                </span>
                <span className="text-[11px] text-emerald-400 block font-medium">
                  ✓ Tersimpan di rekor browsermu
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenLeaderboard?.()}
                className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 text-xs font-black rounded-xl shadow-[0_0_12px_rgba(0,240,255,0.4)] cursor-pointer transition-all"
              >
                Lihat Rekor
              </button>
              <button
                type="button"
                onClick={() => setLastScore(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Tutup Banner Skor"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Control Utility Toolbar */}
      <div className="bg-[#0B1222] rounded-2xl border border-slate-800 p-3.5 shadow-xl flex items-center justify-between gap-3">
        {/* Left: Game Title & Category */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-cyan-500/30 text-cyan-400 flex items-center justify-center text-xl shrink-0">
            🎮
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black text-white leading-tight">
              {game.title}
            </h1>
            <span className="text-[11px] font-bold text-cyan-400 uppercase">
              Kategori: {game.category}
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Favorite */}
          <button
            onClick={handleToggleFavorite}
            aria-label="Simpan ke Favorit"
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isFavorite
                ? "bg-rose-950/80 border-rose-500/50 text-rose-400"
                : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700"
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-rose-500 text-rose-500" : ""}`} />
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            aria-label="Bagikan Game"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-cyan-500/40 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>

          {/* Reload Game */}
          <button
            onClick={handleReload}
            aria-label="Ulangi Permainan"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-cyan-500/40 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={handleFullscreen}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.3)]"
          >
            {isFullscreen ? (
              <>
                <Minimize className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Normal</span>
              </>
            ) : (
              <>
                <Maximize className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Layar Penuh</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
