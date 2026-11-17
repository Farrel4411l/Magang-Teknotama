"use client";

import React, { useState } from "react";
import Navbar from "./Navbar";
import BreakingTicker from "./BreakingTicker";
import Footer from "./Footer";
import LayoutWrapper from "./LayoutWrapper";
import AdBottomAnchor from "../ads/AdBottomAnchor";
import SearchModal from "../game/SearchModal";
import LeaderboardModal from "../game/LeaderboardModal";
import FavoritesModal from "../game/FavoritesModal";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#010B2E] text-[#F8FAFC] selection:bg-[#8A0045] selection:text-white">
      {/* 1. Header & Navbar Utama */}
      <Navbar
        onOpenSearch={() => setSearchOpen(true)}
        onOpenLeaderboard={() => setLeaderboardOpen(true)}
        onOpenFavorites={() => setFavoritesOpen(true)}
      />

      {/* 2. Radar Ticker Berita & Live Event */}
      <BreakingTicker />

      {/* 3. Layout Wrapper Utama dengan Floating Side Ads di Desktop */}
      <LayoutWrapper>{children}</LayoutWrapper>

      {/* 4. Sticky Bottom Anchor Ad (Khusus Layar HP / Mobile dengan tombol Sembunyikan) */}
      <AdBottomAnchor />

      {/* 5. Modals Interaktif */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <LeaderboardModal
        isOpen={leaderboardOpen}
        onClose={() => setLeaderboardOpen(false)}
      />
      <FavoritesModal
        isOpen={favoritesOpen}
        onClose={() => setFavoritesOpen(false)}
      />

      {/* 6. Footer Resmi Partner Sponsor */}
      <Footer />
    </div>
  );
}
