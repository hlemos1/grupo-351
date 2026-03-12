"use client";

import { useRef, ReactNode } from "react";
import { useMousePosition } from "@/hooks/useMousePosition";

interface Props {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
}

export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(59, 130, 246, 0.06)",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { x, y, isInside } = useMousePosition(ref);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{
        background: isInside
          ? `radial-gradient(400px circle at ${x}px ${y}px, ${spotlightColor}, transparent 60%)`
          : undefined,
      }}
    >
      {children}
    </div>
  );
}
