"use client";

import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import LayoutWrapper from "./LayoutWrapper";
import AdBottomAnchor from "../ads/AdBottomAnchor";
import SearchModal from "../game/SearchModal";
import LeaderboardModal from "../game/LeaderboardModal";
import FavoritesModal from "../game/FavoritesModal";
import CursorTracker from "./CursorTracker";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col selection:bg-[#255dce]/30 selection:text-white">
      <CursorTracker />

      {/* Navbar */}
      <Navbar
        onOpenSearch={() => setSearchOpen(true)}
        onOpenLeaderboard={() => setLeaderboardOpen(true)}
        onOpenFavorites={() => setFavoritesOpen(true)}
      />

      {/* Main Content */}
      <LayoutWrapper>{children}</LayoutWrapper>

      {/* Mobile Anchor Ad */}
      <AdBottomAnchor />

      {/* Modals */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <LeaderboardModal
        isOpen={leaderboardOpen}
        onClose={() => setLeaderboardOpen(false)}
      />
      <FavoritesModal
        isOpen={favoritesOpen}
        onClose={() => setFavoritesOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
