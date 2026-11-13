"use client";

import React, { useState } from "react";
import Navbar from "./Navbar";
import BreakingTicker from "./BreakingTicker";
import Footer from "./Footer";
import LayoutWrapper from "./LayoutWrapper";
import AdBottomAnchor from "../ads/AdBottomAnchor";
import SearchModal from "../game/SearchModal";
import LeaderboardModal from "../game/LeaderboardModal";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#070B14] text-[#F8FAFC] selection:bg-cyan-500 selection:text-slate-950">
      {/* Tier 1: Main Gamer Navbar */}
      <Navbar
        onOpenSearch={() => setSearchOpen(true)}
        onOpenLeaderboard={() => setLeaderboardOpen(true)}
      />

      {/* Tier 2: Cyber Live Radar Ticker */}
      <BreakingTicker />

      {/* Main Page Layout Wrapper with Skyscraper Gutters */}
      <LayoutWrapper>{children}</LayoutWrapper>

      {/* Sticky Bottom Anchor Ad */}
      <AdBottomAnchor />

      {/* Modals */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <LeaderboardModal
        isOpen={leaderboardOpen}
        onClose={() => setLeaderboardOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
