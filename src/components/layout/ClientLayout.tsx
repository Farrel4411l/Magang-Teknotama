"use client";

import React, { useState } from "react";
import Navbar from "./Navbar";
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
    <div className="min-h-screen flex flex-col selection:bg-[#961250] selection:text-white">
      {/* 1. Header & Navbar Utama (Tanpa ticker yang bergeser) */}
      <Navbar
        onOpenSearch={() => setSearchOpen(true)}
        onOpenLeaderboard={() => setLeaderboardOpen(true)}
        onOpenFavorites={() => setFavoritesOpen(true)}
      />

      {/* 2. Layout Wrapper Utama (Bebas tabrakan konten) */}
      <LayoutWrapper>{children}</LayoutWrapper>

      {/* 3. Sticky Bottom Anchor Ad (Mobile Only) */}
      <AdBottomAnchor />

      {/* 4. Modals Interaktif */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <LeaderboardModal
        isOpen={leaderboardOpen}
        onClose={() => setLeaderboardOpen(false)}
      />
      <FavoritesModal
        isOpen={favoritesOpen}
        onClose={() => setFavoritesOpen(false)}
      />

      {/* 5. Footer Resmi Partner Sponsor */}
      <Footer />
    </div>
  );
}
