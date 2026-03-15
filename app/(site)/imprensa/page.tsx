import { ImprensaPage } from "./ImprensaPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Imprensa — GRUPO +351",
  description:
    "Cobertura mediática e aparições dos fundadores do Grupo +351 na mídia brasileira e internacional.",
};

export default function Page() {
  return <ImprensaPage />;
}
