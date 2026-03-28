"use client";

import { Marquee } from "./Marquee";

const words = [
  "Venture Builder",
  "Nexial GSO",
  "Strike Studio",
  "Nexial E-Brand",
  "Nexial Global",
  "FarmLab 3D",
  "Cascais",
  "Fisico + Digital",
  "Ativos que duram",
  "Governanca",
  "Supply Chain Global",
];

export function MarqueeBand() {
  return (
    <div className="py-6 bg-gradient-to-r from-primary via-[#0f2d4a] to-primary overflow-hidden border-y border-white/[0.04]">
      <Marquee speed={30}>
        {words.map((word, i) => (
          <span
            key={i}
            className="flex items-center gap-10 text-white/20 text-[13px] font-medium tracking-[0.15em] uppercase"
          >
            <span className="hover:text-white/40 transition-colors duration-500">{word}</span>
            <span className="w-1 h-1 rounded-full bg-accent/30" />
          </span>
        ))}
      </Marquee>
    </div>
  );
}
