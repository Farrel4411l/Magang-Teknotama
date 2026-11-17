"use client";

import React from "react";

interface PlaceholderProps {
  width?: number;
  height?: number;
  label?: string;
}

export default function AdSlotPlaceholder({ width = 300, height = 250, label = "Google AdSense" }: PlaceholderProps) {
  return (
    <div
      className="flex items-center justify-center bg-gray-800/30 border border-white/20 text-white/70 text-sm"
      style={{ width, height }}
    >
      {label}
    </div>
  );
}
