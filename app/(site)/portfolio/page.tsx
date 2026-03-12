import type { Metadata } from "next";
import { getProjetos } from "@/lib/projetos";
import { PortfolioPage } from "./PortfolioPage";

export const metadata: Metadata = {
  title: "Portfólio — GRUPO +351",
  description:
    "Conheça os negócios e projetos em desenvolvimento pelo Grupo +351. Manufatura digital, e-commerce, sourcing internacional e mais.",
};

export const dynamic = "force-dynamic";

export default function Portfolio() {
  const projetos = getProjetos();
  return <PortfolioPage projetos={projetos} />;
}
