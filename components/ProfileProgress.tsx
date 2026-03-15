"use client";

import { CheckCircle, Circle } from "lucide-react";
import Link from "next/link";

interface ProfileProgressProps {
  percentage: number;
  missing: string[];
}

export function ProfileProgress({ percentage, missing }: ProfileProgressProps) {
  if (percentage >= 100) return null;

  return (
    <div className="bg-white rounded-2xl border border-black/[0.04] p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Perfil da empresa</h3>
        <span className="text-xs font-medium text-amber-600">{percentage}% completo</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {missing.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs text-gray-500 mb-2">Complete para melhorar sua visibilidade:</p>
          {missing.slice(0, 4).map((item) => (
            <div key={item} className="flex items-center gap-2 text-xs text-gray-500">
              <Circle className="w-3 h-3 text-gray-300" />
              {item}
            </div>
          ))}
          {missing.length > 4 && (
            <p className="text-[10px] text-gray-400">+ {missing.length - 4} mais</p>
          )}
        </div>
      )}
      <Link
        href="/dashboard/empresa"
        className="inline-block mt-3 text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors"
      >
        Completar perfil →
      </Link>
    </div>
  );
}
