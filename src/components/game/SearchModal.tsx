"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, X, Play, Star, Gamepad2, ArrowRight } from "lucide-react";
import { INITIAL_GAMES } from "@/lib/games-data";
import { Game } from "@/types/game";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Game[]>(INITIAL_GAMES.slice(0, 6));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(INITIAL_GAMES.slice(0, 6));
      return;
    }
    const q = query.toLowerCase();
    const filtered = INITIAL_GAMES.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q)
    );
    setResults(filtered);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl glass-modal rounded-3xl overflow-hidden text-white shadow-2xl">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#255dce]/40 flex items-center gap-3 bg-[#010B2E]">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari game seru (misal: runner, drift, stacker, kapal)..."
            className="w-full text-sm font-semibold text-white placeholder-slate-400 focus:outline-none bg-transparent"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Tutup Pencarian"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results List */}
        <div className="p-3 max-h-[380px] overflow-y-auto space-y-1.5">
          {results.length === 0 ? (
            <div className="py-10 text-center text-slate-400 text-xs">
              Tidak ada game yang cocok dengan &quot;{query}&quot;. Silakan coba kata kunci lain!
            </div>
          ) : (
            results.map((game) => (
              <Link
                key={game.id}
                href={`/play/${game.slug}`}
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#010B2E]/60 hover:bg-[#255dce]/20 border border-[#255dce]/30 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#021861] border border-[#255dce]/50 text-[#3b82f6] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Gamepad2 className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                      {game.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1.5">
                      <span>{game.category}</span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-0.5 text-amber-300">
                        <Star className="w-3 h-3 fill-amber-300" />
                        <span>{game.rating.toFixed(1)}</span>
                      </span>
                    </span>
                  </div>
                </div>

                <span className="w-8 h-8 rounded-xl btn-burgundy text-white flex items-center justify-center transition-all shrink-0">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </span>
              </Link>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#010B2E] border-t border-[#255dce]/30 text-right text-xs text-slate-400">
          <span>Menampilkan {results.length} hasil game</span>
        </div>
      </div>
    </div>
  );
}
