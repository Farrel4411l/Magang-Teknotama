"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { X, Sparkles, Play, Trash2, Trophy, Gamepad2 } from "lucide-react";
import { getLocalScores, clearLocalScores } from "@/lib/local-storage";
import { INITIAL_GAMES } from "@/lib/games-data";

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

  // Urutkan skor tertinggi dari lokal
  const scoreEntries = Object.entries(localScores)
    .map(([gameId, score]) => {
      const gameInfo = INITIAL_GAMES.find((g) => g.id === gameId);
      return {
        gameId,
        score,
        title: gameInfo?.title || gameId.replace(/-/g, " "),
        category: gameInfo?.category || "game",
        slug: gameInfo?.slug || gameId,
      };
    })
    .sort((a, b) => b.score - a.score);

  const totalPlayed = scoreEntries.length;
  const bestScore = scoreEntries.length > 0 ? scoreEntries[0].score : 0;

  const handleClear = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus seluruh catatan skor pribadi di browser ini?")) {
      clearLocalScores();
      setLocalScores({});
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg glass-modal rounded-3xl overflow-hidden flex flex-col text-white shadow-2xl">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#010B2E] via-[#021861] to-[#255dce]/30 text-white p-5 flex items-center justify-between border-b border-[#255dce]/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8A0045] to-[#660033] text-amber-300 flex items-center justify-center shadow-lg shrink-0">
              <Trophy className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold tracking-wide flex items-center gap-1.5 text-white">
                <span>Papan Rekor &amp; Skor Terbaik</span>
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              </h3>
              <p className="text-[11px] text-slate-300 font-medium">
                Pencapaian skor tertinggi Anda di Tekno Game (Tersimpan Lokal di Browser)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Tutup Papan Rekor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Summary Bar */}
        <div className="grid grid-cols-2 p-3 bg-[#010B2E] border-b border-[#255dce]/30 text-center gap-2">
          <div className="bg-[#021861]/70 py-2.5 px-3 rounded-xl border border-[#255dce]/40">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Game Dimainkan</span>
            <span className="text-sm font-extrabold text-cyan-300">{totalPlayed} Game</span>
          </div>
          <div className="bg-[#021861]/70 py-2.5 px-3 rounded-xl border border-[#255dce]/40">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Skor Tertinggi</span>
            <span className="text-sm font-extrabold text-amber-300">
              {bestScore.toLocaleString("id-ID")} Poin
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 max-h-[380px] overflow-y-auto space-y-2">
          {scoreEntries.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#021861] border border-[#255dce]/40 text-[#255dce] flex items-center justify-center mx-auto shadow-inner">
                <Gamepad2 className="w-7 h-7 text-[#3b82f6]" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-200">
                Belum Ada Catatan Skor
              </h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Mainkan game apa pun di Tekno Game hingga selesai, dan skormu akan otomatis tercatat di sini!
              </p>
            </div>
          ) : (
            scoreEntries.map((entry, index) => (
              <div
                key={entry.gameId}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#010B2E]/60 border border-[#255dce]/30 hover:border-[#255dce]/60 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${
                      index === 0
                        ? "bg-amber-400 text-slate-950 shadow-md"
                        : index === 1
                        ? "bg-slate-300 text-slate-950"
                        : index === 2
                        ? "bg-amber-700 text-white"
                        : "bg-[#021861] text-slate-300"
                    }`}
                  >
                    #{index + 1}
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                      {entry.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      {entry.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-xs sm:text-sm font-black text-amber-300 block">
                      {entry.score.toLocaleString("id-ID")}
                    </span>
                    <span className="text-[9px] text-slate-400 block -mt-0.5">Poin</span>
                  </div>

                  <Link
                    href={`/play/${entry.slug}`}
                    onClick={onClose}
                    className="p-2 rounded-xl btn-burgundy text-white hover:scale-105 transition-transform"
                    title="Mainkan game ini lagi"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#010B2E] border-t border-[#255dce]/30 flex items-center justify-between">
          {scoreEntries.length > 0 ? (
            <button
              type="button"
              onClick={handleClear}
              className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Rekor Saya</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-[#3b82f6] hover:underline cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
