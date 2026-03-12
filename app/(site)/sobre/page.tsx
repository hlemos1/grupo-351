import type { Metadata } from "next";
import { SobrePage } from "./SobrePage";

export const metadata: Metadata = {
  title: "Sobre — GRUPO +351",
  description:
    "Conheça os fundadores do Grupo +351: Henrique Lemos, Fernando Vieira e Herson Rosa. Empreendedores brasileiros construindo negócios em Portugal.",
};

export default function Sobre() {
  return <SobrePage />;
}
