"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Medal, Sparkles, Play, Trash2, Trophy, Zap } from "lucide-react";
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

  // Map local scores with game details and sort descending
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
    if (window.confirm("Apakah kamu yakin ingin mereset seluruh rekor skor pribadimu?")) {
      clearLocalScores();
      setLocalScores({});
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#0B1222] rounded-3xl shadow-[0_0_50px_rgba(0,240,255,0.2)] border border-cyan-500/40 overflow-hidden flex flex-col text-white">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-950 via-[#0B1222] to-blue-950 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(0,240,255,0.4)] shrink-0">
              🏆
            </div>
            <div>
              <h3 className="text-base font-black tracking-wide flex items-center gap-1.5 text-white">
                <span>Tekno Hall of Fame</span>
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              </h3>
              <p className="text-[11px] text-cyan-400/80 font-medium">
                Papan rekor skor terbaikmu (100% Offline di Browser)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Summary Bar */}
        <div className="grid grid-cols-2 p-3 bg-[#070B14] border-b border-slate-800 text-center gap-2">
          <div className="bg-[#0F172A] py-2 px-3 rounded-xl border border-slate-800 shadow-xs">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Game Ditaklukkan</span>
            <span className="text-sm font-black text-cyan-400">{totalPlayed} Game</span>
          </div>
          <div className="bg-[#0F172A] py-2 px-3 rounded-xl border border-slate-800 shadow-xs">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Skor Tertinggi</span>
            <span className="text-sm font-black text-amber-400">
              {bestScore.toLocaleString("id-ID")} pts
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 max-h-[380px] overflow-y-auto space-y-2">
          {scoreEntries.length === 0 ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 text-slate-400 flex items-center justify-center mx-auto text-2xl">
                🎮
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-slate-200">
                  Belum Ada Rekor Terdaftar
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Mainkan game pilihanmu sekarang! Skor tertinggi akan tersimpan otomatis di browsermu setiap game selesai.
                </p>
              </div>
              <div className="pt-2 flex flex-wrap gap-2 justify-center">
                {INITIAL_GAMES.slice(0, 3).map((g) => (
                  <Link
                    key={g.id}
                    href={`/play/${g.slug}`}
                    onClick={onClose}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:brightness-110 text-xs font-black rounded-xl transition-all shadow-sm"
                  >
                    <Play className="w-3 h-3 fill-slate-950" />
                    <span>{g.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            scoreEntries.map((entry, idx) => {
              const isTop1 = idx === 0;
              const isTop2 = idx === 1;
              const isTop3 = idx === 2;

              return (
                <div
                  key={entry.gameId}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                    isTop1
                      ? "bg-amber-950/30 border-amber-500/50 shadow-[0_0_15px_rgba(250,204,21,0.15)]"
                      : isTop2
                      ? "bg-slate-800/40 border-slate-600/50"
                      : isTop3
                      ? "bg-orange-950/30 border-orange-600/40"
                      : "bg-[#0F172A] border-slate-800/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                        isTop1
                          ? "bg-amber-400 text-slate-950 shadow-md"
                          : isTop2
                          ? "bg-slate-300 text-slate-900"
                          : isTop3
                          ? "bg-amber-700 text-white"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1">
                        <span>{entry.title}</span>
                        {isTop1 && <Medal className="w-3.5 h-3.5 text-amber-400 inline" />}
                      </h4>
                      <span className="text-[10px] text-cyan-400/80 uppercase font-semibold">
                        Arena: {entry.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-sm font-black text-cyan-400">
                        {entry.score.toLocaleString("id-ID")}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-medium">pts</span>
                    </div>
                    <Link
                      href={`/play/${entry.slug}`}
                      onClick={onClose}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 transition-colors"
                      title="Mainkan Lagi"
                    >
                      <Play className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#070B14] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <span className="text-cyan-400">●</span> 100% tersimpan lokal di browsermu tanpa database server.
          </span>
          {scoreEntries.length > 0 && (
            <button
              onClick={handleClear}
              className="flex items-center gap-1 font-semibold text-slate-400 hover:text-rose-400 cursor-pointer transition-colors text-[11px]"
            >
              <Trash2 className="w-3 h-3" /> Reset Skor
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
