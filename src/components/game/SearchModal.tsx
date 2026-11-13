"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, X, Play, Star, Flame, Zap } from "lucide-react";
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
      <div className="w-full max-w-xl bg-[#0B1222] rounded-3xl shadow-[0_0_50px_rgba(0,240,255,0.2)] border border-cyan-500/40 overflow-hidden text-white">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-[#070B14]">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari game seru (misal: runner, drift, stacker, puzzle)..."
            className="w-full text-sm font-bold text-white placeholder-slate-500 focus:outline-none bg-transparent"
          />
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results List */}
        <div className="p-3 max-h-[380px] overflow-y-auto space-y-1.5">
          {results.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              Tidak ada game yang cocok dengan &quot;{query}&quot;. Coba kata kunci lain!
            </div>
          ) : (
            results.map((game) => (
              <Link
                key={game.id}
                href={`/play/${game.slug}`}
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#0F172A] border border-transparent hover:border-cyan-500/30 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                    🎮
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {game.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      {game.category} • ⭐ {game.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                <span className="w-8 h-8 rounded-full bg-cyan-500/10 group-hover:bg-cyan-500 group-hover:text-slate-950 text-cyan-400 flex items-center justify-center transition-all">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </span>
              </Link>
            ))
          )}
        </div>

        {/* Modal Footer Tip */}
        <div className="p-3 bg-[#070B14] border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Tekan game untuk langsung mulai bermain instan.</span>
          </span>
          <span className="hidden sm:inline text-slate-600">Tekan ESC untuk menutup</span>
        </div>
      </div>
    </div>
  );
}
