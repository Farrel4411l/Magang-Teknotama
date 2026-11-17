"use client";

import { useEffect, useRef } from "react";

export default function CursorTracker() {
  const auraRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hasFinePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
    if (!hasFinePointer) return;

    const root = document.documentElement;
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let animationFrame = 0;
    let activeCard: HTMLElement | null = null;
    let activeButton: HTMLElement | null = null;

    const resetCard = (card: HTMLElement | null) => {
      if (!card) return;
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
      card.style.setProperty("--pointer-x", "50%");
      card.style.setProperty("--pointer-y", "50%");
    };

    const resetButton = (button: HTMLElement | null) => {
      button?.style.setProperty("--magnet-x", "0px");
      button?.style.setProperty("--magnet-y", "0px");
    };

    const updatePointerEffects = () => {
      animationFrame = 0;
      if (auraRef.current) auraRef.current.style.opacity = "0.8";
      root.style.setProperty("--mouse-x", `${pointerX}px`);
      root.style.setProperty("--mouse-y", `${pointerY}px`);

      const pointedElement = document.elementFromPoint(pointerX, pointerY);
      const nextCard =
        pointedElement?.closest<HTMLElement>("[data-tilt]") ?? null;
      if (nextCard !== activeCard) resetCard(activeCard);
      activeCard = nextCard;

      if (activeCard) {
        const bounds = activeCard.getBoundingClientRect();
        const x = (pointerX - bounds.left) / bounds.width;
        const y = (pointerY - bounds.top) / bounds.height;
        activeCard.style.setProperty("--pointer-x", `${x * 100}%`);
        activeCard.style.setProperty("--pointer-y", `${y * 100}%`);
        activeCard.style.setProperty("--tilt-x", `${(x - 0.5) * 7}deg`);
        activeCard.style.setProperty("--tilt-y", `${(0.5 - y) * 7}deg`);
      }

      const nextButton =
        pointedElement?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (nextButton !== activeButton) resetButton(activeButton);
      activeButton = nextButton;

      if (activeButton) {
        const bounds = activeButton.getBoundingClientRect();
        const x = (pointerX - (bounds.left + bounds.width / 2)) * 0.12;
        const y = (pointerY - (bounds.top + bounds.height / 2)) * 0.12;
        activeButton.style.setProperty(
          "--magnet-x",
          `${Math.max(-8, Math.min(8, x))}px`
        );
        activeButton.style.setProperty(
          "--magnet-y",
          `${Math.max(-8, Math.min(8, y))}px`
        );
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(updatePointerEffects);
      }
    };

    const handleWindowBlur = () => {
      resetCard(activeCard);
      resetButton(activeButton);
      activeCard = null;
      activeButton = null;
      if (auraRef.current) auraRef.current.style.opacity = "0";
    };

    const handleWindowFocus = () => {
      if (auraRef.current) auraRef.current.style.opacity = "";
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handleWindowBlur);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handleWindowBlur);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      resetCard(activeCard);
      resetButton(activeButton);
    };
  }, []);

  return <div ref={auraRef} className="cursor-aura" aria-hidden="true" />;
}
