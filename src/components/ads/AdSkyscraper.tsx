"use client";

import React from "react";
import GoogleAdSlot from "./GoogleAdSlot";

interface AdSkyscraperProps {
  position: "left" | "right";
  slotId?: string;
}

export default function AdSkyscraper({ position }: AdSkyscraperProps) {
  const isLeft = position === "left";

  return (
    <aside
      className={`hidden min-[1680px]:block fixed top-24 z-20 w-[160px] ${
        isLeft
          ? "left-[calc((100vw-1280px)/2-180px)]"
          : "right-[calc((100vw-1280px)/2-180px)]"
      }`}
      aria-label={`Iklan sisi ${isLeft ? "kiri" : "kanan"}`}
    >
      <GoogleAdSlot
        slotType="skyscraper-160x600"
        adSlot={
          isLeft
            ? process.env.NEXT_PUBLIC_ADSENSE_SLOT_SKYSCRAPER_LEFT || ""
            : process.env.NEXT_PUBLIC_ADSENSE_SLOT_SKYSCRAPER_RIGHT || ""
        }
      />
    </aside>
  );
}
