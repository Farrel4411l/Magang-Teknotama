"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

const HeroChipScene = dynamic(() => import("./HeroChipScene"), {
  ssr: false,
});

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/games";
const logoSrc = `${basePath}/Teknogame_logo_only.png`;

interface HeroChipStageProps {
  children?: React.ReactNode;
}

export default function HeroChipStage({ children }: HeroChipStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "100px" }
    );
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerRef.current = {
      x: ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
      y: -(((event.clientY - bounds.top) / bounds.height) * 2 - 1),
    };
  };

  const handlePointerLeave = () => {
    pointerRef.current = { x: 0, y: 0 };
  };

  return (
    <div
      ref={stageRef}
      className="hero-art hero-chip-stage min-h-[19rem] sm:min-h-[25rem]"
      aria-label="Ilustrasi chip 3D Tekno Game"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className={`hero-chip-fallback ${sceneReady ? "is-hidden" : ""}`}>
        <Image
          src={logoSrc}
          alt="Logo Tekno Game"
          fill
          sizes="(max-width: 640px) 55vw, 240px"
          priority
          className="hero-emblem object-contain"
        />
      </div>
      <HeroChipScene
        active={isVisible}
        pointer={pointerRef}
        onReady={() => setSceneReady(true)}
      />
      {children}
    </div>
  );
}
