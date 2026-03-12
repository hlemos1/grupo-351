"use client";

import { useState, useEffect, RefObject } from "react";

export function useMousePosition(ref: RefObject<HTMLElement | null>) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isInside, setIsInside] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function handleMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect();
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }

    function handleEnter() {
      setIsInside(true);
    }

    function handleLeave() {
      setIsInside(false);
    }

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseenter", handleEnter);
    el.addEventListener("mouseleave", handleLeave);

    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseenter", handleEnter);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [ref]);

  return { ...position, isInside };
}
