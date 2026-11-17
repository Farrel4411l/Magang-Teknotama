import React from "react";
import AdSkyscraper from "../ads/AdSkyscraper";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  return (
    <div className="relative min-h-screen flex flex-col pb-28 cyber-grid">
      {/* Floating Side Ads Kiri (Melayang Permanen di Desktop, Aman dari Konten Utama) */}
      <AdSkyscraper position="left" />

      {/* Kontainer Konten Utama */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Floating Side Ads Kanan (Melayang Permanen di Desktop, Aman dari Konten Utama) */}
      <AdSkyscraper position="right" />
    </div>
  );
}
