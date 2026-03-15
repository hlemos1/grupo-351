"use client";

import { BadgeCheck } from "lucide-react";

interface VerifiedBadgeProps {
  size?: "sm" | "md";
  className?: string;
}

export function VerifiedBadge({ size = "sm", className = "" }: VerifiedBadgeProps) {
  const sizeClass = size === "sm" ? "w-3.5 h-3.5" : "w-4.5 h-4.5";
  return (
    <span className={`inline-flex items-center gap-1 text-blue-600 ${className}`} title="Empresa verificada">
      <BadgeCheck className={sizeClass} />
    </span>
  );
}
