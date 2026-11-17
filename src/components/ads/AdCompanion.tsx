"use client";

import React from "react";
import GoogleAdSlot from "./GoogleAdSlot";

export default function AdCompanion() {
  return (
    <GoogleAdSlot
      slotType="rectangle-300x250"
      adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR || ""}
    />
  );
}
