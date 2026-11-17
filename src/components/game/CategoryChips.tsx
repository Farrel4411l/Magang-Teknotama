"use client";

import React from "react";
import { CATEGORIES } from "@/lib/games-data";
import { GameCategory } from "@/types/game";
import {
  Gamepad2,
  Compass,
  Puzzle,
  Zap,
  Coffee,
  Trophy,
  Filter,
} from "lucide-react";

interface CategoryChipsProps {
  selectedCategory: GameCategory;
  onSelectCategory: (cat: GameCategory) => void;
}

export default function CategoryChips({
  selectedCategory,
  onSelectCategory,
}: CategoryChipsProps) {
  const getCategoryIcon = (id: GameCategory) => {
    switch (id) {
      case "arcade":
        return <Gamepad2 className="w-4 h-4" />;
      case "adventure":
        return <Compass className="w-4 h-4" />;
      case "puzzle":
        return <Puzzle className="w-4 h-4" />;
      case "action":
        return <Zap className="w-4 h-4" />;
      case "casual":
        return <Coffee className="w-4 h-4" />;
      case "sports":
        return <Trophy className="w-4 h-4" />;
      default:
        return <Gamepad2 className="w-4 h-4" />;
    }
  };

  return (
    <div className="py-5">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {/* Label Jelajahi Khas Tekno Game */}
        <div className="shrink-0 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-cyan-300 mr-1 bg-[#021861] px-3 py-2 rounded-xl border border-[#255dce]/40 shadow-sm">
          <Filter className="w-3.5 h-3.5 text-[#3b82f6]" />
          <span>Kategori:</span>
        </div>

        {/* Category Pills */}
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`shrink-0 min-h-[42px] flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm active:scale-95 select-none ${
                isSelected
                  ? "btn-burgundy ring-2 ring-[#8A0045] shadow-[0_0_15px_rgba(138,0,69,0.5)]"
                  : "bg-[#021861]/70 hover:bg-[#255dce]/30 border border-[#255dce]/40 text-slate-200 hover:text-white"
              }`}
            >
              <span className={isSelected ? "text-white" : "text-[#3b82f6]"}>
                {getCategoryIcon(cat.id)}
              </span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
