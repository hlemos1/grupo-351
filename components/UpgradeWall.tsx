"use client";

import { ArrowRight, Lock } from "lucide-react";
import Link from "next/link";

interface UpgradeWallProps {
  feature: string;
  description?: string;
  currentPlan?: string;
}

export function UpgradeWall({ feature, description, currentPlan }: UpgradeWallProps) {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200/50 p-8 text-center">
      <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mx-auto mb-4">
        <Lock className="w-6 h-6 text-amber-600" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">
        {feature} indisponível no plano {currentPlan || "atual"}
      </h3>
      <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
        {description || "Faça upgrade do seu plano para desbloquear esta funcionalidade."}
      </p>
      <Link
        href="/dashboard/plano"
        className="inline-flex items-center gap-2 bg-amber-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-amber-500 transition-all"
      >
        Ver planos
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
