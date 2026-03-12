import type { Metadata } from "next";
import { ParceirosPage } from "./ParceirosPage";

export const metadata: Metadata = {
  title: "Portal do Parceiro — GRUPO +351",
  description:
    "Conheça os modelos de Joint Venture do Grupo +351. Estruturas societárias, investimento necessário e oportunidades para operadores e investidores.",
};

export default function Parceiros() {
  return <ParceirosPage />;
}
