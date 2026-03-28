import type { Metadata } from "next";
import { EcossistemaPage } from "./EcossistemaPage";
import { JsonLd } from "@/components/JsonLd";
import { ecossistemaSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Ecossistema — GRUPO +351",
  description:
    "Visualize como as 5 empresas do Grupo +351 se conectam. Operacao fisica, inteligencia digital e comercio global em rede.",
};

export default function Ecossistema() {
  return (
    <>
      <JsonLd data={ecossistemaSchema()} />
      <EcossistemaPage />
    </>
  );
}
