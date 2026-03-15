import { MetricasPage } from "./MetricasPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Métricas — GRUPO +351",
  description:
    "Dashboard público com métricas do ecossistema Grupo +351: projetos ativos, marcas em operação e base de conhecimento.",
};

export default function Page() {
  return <MetricasPage />;
}
