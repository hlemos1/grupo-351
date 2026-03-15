"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md";
  readonly?: boolean;
}

export function StarRating({ value, onChange, size = "md", readonly = false }: StarRatingProps) {
  const sizeClass = size === "sm" ? "w-3.5 h-3.5" : "w-5 h-5";

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={`${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"} transition-transform`}
        >
          <Star
            className={`${sizeClass} ${
              star <= value ? "fill-amber-400 text-amber-400" : "fill-none text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
