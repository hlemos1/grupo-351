import { Hero } from "@/components/Hero";
import { Numeros } from "@/components/Numeros";
import { QuemSomos } from "@/components/QuemSomos";
import { Figital } from "@/components/Figital";
import { Modelo } from "@/components/Modelo";
import { MarqueeBand } from "@/components/MarqueeBand";
import { Negocios } from "@/components/Negocios";
import { ParaQuem } from "@/components/ParaQuem";
import { Visao } from "@/components/Visao";
import { CTA } from "@/components/CTA";
import { Localizacao } from "@/components/Localizacao";
import { FAQ } from "@/components/FAQ";
import { Contato } from "@/components/Contato";

export default function Home() {
  return (
    <main>
      <Hero />
      <Numeros />
      <QuemSomos />
      <Figital />
      <Modelo />
      <MarqueeBand />
      <Negocios />
      <ParaQuem />
      <Visao />
      <CTA />
      <Localizacao />
      <FAQ />
      <Contato />
    </main>
  );
}
