"use client";

import React from "react";
import GoogleAdSlot from "./GoogleAdSlot";

export default function AdNativeTile() {
  return (
    <GoogleAdSlot
      slotType="native-grid"
      adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_NATIVE || ""}
    />
  );
}
