"use client";

import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export function Marquee({ children, speed = 30, className = "" }: Props) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className="flex gap-8 whitespace-nowrap animate-marquee"
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
