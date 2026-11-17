"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { X, Heart, Play, Gamepad2, ArrowRight } from "lucide-react";
import { getLocalFavorites, toggleLocalFavorite } from "@/lib/local-storage";
import { INITIAL_GAMES } from "@/lib/games-data";
import { Game } from "@/types/game";

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FavoritesModal({ isOpen, onClose }: FavoritesModalProps) {
  const [favoriteGames, setFavoriteGames] = useState<Game[]>([]);

  useEffect(() => {
    if (isOpen) {
      const favIds = getLocalFavorites();
      const matched = INITIAL_GAMES.filter((g) => favIds.includes(g.id));
      setFavoriteGames(matched);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRemoveFavorite = (gameId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLocalFavorite(gameId);
    setFavoriteGames((prev) => prev.filter((g) => g.id !== gameId));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg glass-modal rounded-3xl overflow-hidden flex flex-col text-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#010B2E] via-[#021861] to-[#255dce]/30 p-5 flex items-center justify-between border-b border-[#255dce]/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8A0045] to-[#660033] flex items-center justify-center shadow-lg shrink-0">
              <Heart className="w-5 h-5 text-rose-300 fill-rose-300" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-wide text-white">
                Game Favorit Saya
              </h3>
              <p className="text-[11px] text-slate-300">
                Koleksi game pilihan yang Anda simpan untuk dimainkan kembali
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Tutup Jendela Favorit"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 max-h-[400px] overflow-y-auto space-y-2">
          {favoriteGames.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#021861] border border-[#255dce]/40 text-[#255dce] flex items-center justify-center mx-auto shadow-inner">
                <Gamepad2 className="w-7 h-7 text-[#3b82f6]" />
              </div>
              <h4 className="text-sm font-bold text-slate-200">
                Belum Ada Game Favorit
              </h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Klik ikon hati pada game apa pun di Tekno Game untuk menyimpannya di daftar favorit ini!
              </p>
            </div>
          ) : (
            favoriteGames.map((game) => (
              <div
                key={game.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#010B2E]/70 hover:bg-[#255dce]/20 border border-[#255dce]/30 transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#021861] border border-[#255dce]/40 flex items-center justify-center text-[#3b82f6] shrink-0">
                    <Gamepad2 className="w-5 h-5 text-[#3b82f6]" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#3b82f6] transition-colors truncate">
                      {game.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Kategori: {game.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => handleRemoveFavorite(game.id, e)}
                    title="Hapus dari Favorit"
                    className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                    aria-label="Hapus dari favorit"
                  >
                    <Heart className="w-4 h-4 fill-rose-500" />
                  </button>

                  <Link
                    href={`/play/${game.slug}`}
                    onClick={onClose}
                    className="px-3 py-1.5 rounded-lg btn-burgundy text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
                  >
                    <span>Main</span>
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#010B2E] border-t border-[#255dce]/30 flex items-center justify-between text-xs text-slate-400">
          <span>{favoriteGames.length} Game Tersimpan</span>
          <button
            onClick={onClose}
            className="text-xs font-semibold text-[#3b82f6] hover:underline cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
