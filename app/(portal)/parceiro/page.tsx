import { Suspense } from "react";
import { PortalParceiro } from "./PortalParceiro";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portal do Parceiro — GRUPO +351",
  description: "Área autenticada para parceiros acompanharem métricas da sua Joint Venture.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      }
    >
      <PortalParceiro />
    </Suspense>
  );
}
