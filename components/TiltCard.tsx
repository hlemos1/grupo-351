"use client";

import { useRef, useState, ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

export function TiltCard({ children, className = "", intensity = 8 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");

  function handleMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (y - 0.5) * -intensity;
    const rotateY = (x - 0.5) * intensity;
    setTransform(
      `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
    );
  }

  function handleLeave() {
    setTransform("perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  }

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        transform,
        transition: "transform 0.15s ease-out",
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </div>
  );
}
