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
        return <Gamepad2 className="w-3.5 h-3.5" />;
      case "adventure":
        return <Compass className="w-3.5 h-3.5" />;
      case "puzzle":
        return <Puzzle className="w-3.5 h-3.5" />;
      case "action":
        return <Zap className="w-3.5 h-3.5" />;
      case "casual":
        return <Coffee className="w-3.5 h-3.5" />;
      case "sports":
        return <Trophy className="w-3.5 h-3.5" />;
      default:
        return <Gamepad2 className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="py-4">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`min-h-11 shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer select-none ${
                isSelected
                  ? "btn-primary-clean text-white shadow-sm"
                  : "bg-white/10 hover:bg-white/15 border border-white/10 text-slate-200 hover:text-white"
              }`}
            >
              <span>{getCategoryIcon(cat.id)}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
