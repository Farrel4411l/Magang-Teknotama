"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { X, Play, Trash2, Trophy, Gamepad2 } from "lucide-react";
import { getLocalScores, clearLocalScores } from "@/lib/local-storage";
import { getCategoryLabel, INITIAL_GAMES } from "@/lib/games-data";

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LeaderboardModal({ isOpen, onClose }: LeaderboardModalProps) {
  const [localScores, setLocalScores] = useState<Record<string, number>>({});

  useEffect(() => {
    if (isOpen) {
      setLocalScores(getLocalScores());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const scoreEntries = Object.entries(localScores)
    .map(([gameId, score]) => {
      const gameInfo = INITIAL_GAMES.find((g) => g.id === gameId);
      return {
        gameId,
        score,
        title: gameInfo?.title || gameId.replace(/-/g, " "),
        category: gameInfo ? getCategoryLabel(gameInfo.category) : "Permainan",
        slug: gameInfo?.slug || gameId,
      };
    })
    .sort((a, b) => b.score - a.score);

  const totalPlayed = scoreEntries.length;
  const bestScore = scoreEntries.length > 0 ? scoreEntries[0].score : 0;

  const handleClear = () => {
    if (window.confirm("Hapus seluruh catatan skor pribadi di peramban ini?")) {
      clearLocalScores();
      setLocalScores({});
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-lg glass-modal-clean rounded-2xl overflow-hidden flex flex-col text-white shadow-2xl">
        <div className="p-4 flex items-center justify-between border-b border-white/10 bg-black/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 text-amber-300 flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-white">
                Papan Rekor Saya
              </h3>
              <p className="text-[11px] text-slate-300">
                Skor tertinggi yang tersimpan di peramban ini
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 p-3 bg-black/15 border-b border-white/10 text-center gap-2">
          <div className="bg-white/[0.04] py-2 px-3 rounded-xl border border-white/5">
            <span className="text-[10px] text-slate-400 uppercase font-medium block">Permainan Tercatat</span>
            <span className="text-sm font-bold text-white">{totalPlayed} judul</span>
          </div>
          <div className="bg-white/[0.04] py-2 px-3 rounded-xl border border-white/5">
            <span className="text-[10px] text-slate-400 uppercase font-medium block">Skor Tertinggi</span>
            <span className="text-sm font-bold text-amber-300">
              {bestScore.toLocaleString("id-ID")} Poin
            </span>
          </div>
        </div>

        <div className="p-4 max-h-[380px] overflow-y-auto space-y-2">
          {scoreEntries.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-white/10 text-slate-300 flex items-center justify-center mx-auto">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <h4 className="text-xs sm:text-sm font-semibold text-slate-200">
                Belum Ada Catatan Skor
              </h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Selesaikan permainan di Tekno Game agar skor Anda tercatat otomatis di sini.
              </p>
            </div>
          ) : (
            scoreEntries.map((entry, index) => (
              <div
                key={entry.gameId}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/5 hover:bg-white/[0.08] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-md bg-white/10 text-xs font-bold flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-white truncate">
                      {entry.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 capitalize block">
                      {entry.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-xs sm:text-sm font-bold text-amber-300 block">
                      {entry.score.toLocaleString("id-ID")}
                    </span>
                    <span className="text-[9px] text-slate-400 block">Poin</span>
                  </div>

                  <Link
                    href={`/play/${entry.slug}`}
                    onClick={onClose}
                    className="flex min-h-11 min-w-11 items-center justify-center rounded-lg btn-primary-clean text-white"
                    title="Mainkan lagi"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-3 bg-black/20 border-t border-white/10 flex items-center justify-between">
          {scoreEntries.length > 0 ? (
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-rose-300 hover:text-rose-200 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Rekor</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={onClose}
            className="text-xs font-medium text-white/70 hover:text-white cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
