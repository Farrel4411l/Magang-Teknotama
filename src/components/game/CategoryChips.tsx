"use client";

import React from "react";
import { CATEGORIES } from "@/lib/games-data";
import { GameCategory } from "@/types/game";
import { Zap } from "lucide-react";

interface CategoryChipsProps {
  selectedCategory: GameCategory;
  onSelectCategory: (cat: GameCategory) => void;
}

export default function CategoryChips({
  selectedCategory,
  onSelectCategory,
}: CategoryChipsProps) {
  return (
    <div className="py-4">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {/* Label Jelajahi Khas TeknoGame */}
        <div className="shrink-0 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-cyan-400 mr-1 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-500/30">
          <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
          <span>JELAJAHI:</span>
        </div>

        {/* Category Pills */}
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm active:scale-95 ${
                isSelected
                  ? "bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-black shadow-[0_0_15px_rgba(0,240,255,0.4)] ring-2 ring-cyan-300"
                  : "bg-[#0F172A] hover:bg-[#162238] border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
