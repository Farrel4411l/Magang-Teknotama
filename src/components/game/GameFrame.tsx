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
  Check,
  X,
  Gamepad2,
  Sparkles,
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
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
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

  // Auto-close score banner
  useEffect(() => {
    if (lastScore !== null) {
      const timer = setTimeout(() => {
        setLastScore(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [lastScore]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleToggleFavorite = () => {
    const next = toggleLocalFavorite(game.id);
    setIsFavorite(next);
    setToastMessage(next ? "Game berhasil ditambahkan ke daftar Favorit!" : "Game dihapus dari Favorit.");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleReload = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const handleShare = () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : `https://teknotama.com/games/play/${game.slug}`;
    if (navigator.share) {
      navigator
        .share({
          title: `${game.title} - Tekno Game`,
          text: `Ayo mainkan game seru ${game.title} di Tekno Game resmi PT Teknotama Prakarsa Mulia!`,
          url: shareUrl,
        })
        .catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setToastMessage("Tautan game berhasil disalin ke clipboard!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    }
  };

  // Base path prefix for HTML5 game assets
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/games";
  const gameSrc = `${basePath}${game.gamePath.startsWith("/") ? game.gamePath : `/${game.gamePath}`}`;

  return (
    <div className="flex flex-col gap-3 relative">
      {/* Toast Notifikasi Glassmorphism Berbahasa Indonesia */}
      {showToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 glass-modal px-4 py-2.5 rounded-2xl border border-[#255dce]/60 text-white text-xs font-bold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Kontainer Layar Permainan (Game Iframe) */}
      <div
        ref={containerRef}
        className={`relative w-full rounded-3xl overflow-hidden bg-[#010B2E] border border-[#255dce]/50 shadow-2xl transition-all ${
          isFullscreen ? "h-screen rounded-none" : "h-[450px] sm:h-[540px] md:h-[600px]"
        }`}
      >
        <iframe
          ref={iframeRef}
          src={gameSrc}
          title={game.title}
          className="w-full h-full border-0 select-none"
          allow="autoplay; fullscreen; pointer-lock"
          sandbox="allow-scripts allow-same-origin allow-pointer-lock"
        />

        {/* Overlay Banner Pencapaian Skor */}
        {lastScore !== null && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 glass-modal border border-[#255dce]/80 rounded-2xl p-4 shadow-2xl text-white flex flex-col sm:flex-row items-center gap-4 animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8A0045] to-[#660033] text-amber-300 flex items-center justify-center text-xl shrink-0 shadow-lg">
                <Trophy className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <span className="text-xs text-slate-300 block">Permainan Selesai! Skor Anda:</span>
                <span className="text-lg font-black bg-gradient-to-r from-cyan-300 to-amber-300 bg-clip-text text-transparent">
                  {lastScore.toLocaleString("id-ID")} Poin
                </span>
                <span className="text-[11px] text-emerald-400 block font-medium">
                  Tersimpan otomatis di rekor browser
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenLeaderboard?.()}
                className="px-3.5 py-1.5 btn-burgundy text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all"
              >
                Lihat Rekor
              </button>
              <button
                type="button"
                onClick={() => setLastScore(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Tutup Banner Skor"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bilah Kontrol Modern Berikon Lucide React */}
      <div className="rounded-2xl card-elevated p-3.5 shadow-xl flex items-center justify-between gap-3">
        {/* Sisi Kiri: Judul Game & Kategori */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#021861] border border-[#255dce]/60 text-[#3b82f6] flex items-center justify-center shrink-0 shadow-sm">
            <Gamepad2 className="w-5 h-5 text-cyan-300" />
          </div>
          <div className="min-w-0">
            <h1 className="font-heading text-sm sm:text-base font-bold text-white leading-tight truncate">
              {game.title}
            </h1>
            <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wide">
              Kategori: {game.category}
            </span>
          </div>
        </div>

        {/* Sisi Kanan: Kontrol Aksi (Fullscreen, Share, Favorit, Reload) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* 3. Tombol Favorit (Heart Icon) dengan transisi warna ke Burgundy */}
          <button
            type="button"
            onClick={handleToggleFavorite}
            aria-label={isFavorite ? "Hapus dari Favorit" : "Simpan ke Favorit"}
            title={isFavorite ? "Game Favorit Aktif" : "Tambah ke Favorit"}
            className={`min-h-[44px] min-w-[44px] p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
              isFavorite
                ? "bg-gradient-to-r from-[#8A0045] to-[#660033] border-rose-400/80 text-white shadow-[0_0_15px_rgba(138,0,69,0.6)]"
                : "bg-[#010B2E] border-[#255dce]/40 text-slate-300 hover:text-white hover:bg-[#255dce]/20"
            }`}
          >
            <Heart
              className={`w-4 h-4 transition-transform ${
                isFavorite ? "fill-white text-white scale-110" : ""
              }`}
            />
          </button>

          {/* 2. Tombol Bagikan (Share) */}
          <button
            type="button"
            onClick={handleShare}
            aria-label="Bagikan Tautan Game"
            title="Bagikan Tautan Game"
            className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-[#010B2E] border border-[#255dce]/40 text-slate-300 hover:text-white hover:bg-[#255dce]/20 transition-all cursor-pointer flex items-center justify-center"
          >
            <Share2 className="w-4 h-4 text-[#3b82f6]" />
          </button>

          {/* Tombol Muat Ulang Permainan */}
          <button
            type="button"
            onClick={handleReload}
            aria-label="Muat Ulang Permainan"
            title="Muat Ulang Permainan"
            className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-[#010B2E] border border-[#255dce]/40 text-slate-300 hover:text-white hover:bg-[#255dce]/20 transition-all cursor-pointer flex items-center justify-center"
          >
            <RotateCcw className="w-4 h-4 text-slate-300" />
          </button>

          {/* 1. Tombol Layar Penuh (Fullscreen) */}
          <button
            type="button"
            onClick={handleFullscreen}
            aria-label={isFullscreen ? "Keluar Layar Penuh" : "Mode Layar Penuh"}
            className="min-h-[44px] px-4 py-2 rounded-xl btn-burgundy text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            {isFullscreen ? (
              <>
                <Minimize className="w-4 h-4" />
                <span className="hidden sm:inline">Layar Normal</span>
              </>
            ) : (
              <>
                <Maximize className="w-4 h-4" />
                <span className="hidden sm:inline">Layar Penuh</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
