import { Hero } from "@/components/Hero";
import { Numeros } from "@/components/Numeros";
import { QuemSomos } from "@/components/QuemSomos";
import { Figital } from "@/components/Figital";
import { Modelo } from "@/components/Modelo";
import { MarqueeBand } from "@/components/MarqueeBand";
import { Negocios } from "@/components/Negocios";
import { ParaQuem } from "@/components/ParaQuem";
import { Visao } from "@/components/Visao";
import { ProvaSocial } from "@/components/ProvaSocial";
import { CTA } from "@/components/CTA";
import { Localizacao } from "@/components/Localizacao";
import { FAQ } from "@/components/FAQ";
import { Contato } from "@/components/Contato";
import { JsonLd } from "@/components/JsonLd";
import { faqSchema } from "@/lib/schema";

const faqs = [
  { q: "O que é FIGITAL?", a: "FIGITAL é a arquitetura central do Grupo +351 — a integração estrutural entre operações físicas, plataformas digitais e software proprietário. Não é tendência, é infraestrutura." },
  { q: "O que é uma Joint Venture no +351?", a: "É uma parceria societária real. A holding entra com marca, método, capital e governança. O operador entra com execução e know-how. Estruturas variam de 50/50 a 70/30 com vesting." },
  { q: "Preciso ter capital para ser parceiro?", a: "Depende do modelo. Forge and Flow 3D começa com 5.000 EUR. Purple Party pode chegar a 100.000 EUR. Para operadores sem capital, existem modelos com vesting progressivo." },
  { q: "Como me candidato?", a: "Através do formulário estruturado em /aplicar. São 5 etapas: perfil pessoal, experiência, modelo de interesse, proposta e aceite de NDA preliminar. Candidaturas são analisadas em até 5 dias úteis." },
  { q: "Vocês atuam apenas em Portugal?", a: "Estamos sediados em Cascais, Portugal, mas o ecossistema é global. Sourcing da China, marcas validadas no Brasil, distribuição europeia." },
  { q: "Como as 7 marcas se conectam?", a: "Cada marca é um nó no ecossistema FIGITAL. Sensores captam dados, neurónios processam, distribuição retroalimenta. Tudo conectado numa arquitetura de rede." },
  { q: "Qual a diferença entre operador e investidor?", a: "Operador executa o dia-a-dia do negócio e conquista participação via vesting. Investidor entra com capital e tem retorno passivo. O modelo ambos combina os dois." },
  { q: "O Grupo +351 participa da operação diária?", a: "Não. A operação é do parceiro. A holding fornece marca, método, governança, conexão com o ecossistema e reunião de conselho mensal." },
];

export default function Home() {
  return (
    <main>
      <JsonLd data={faqSchema(faqs)} />
      <Hero />
      <Numeros />
      <QuemSomos />
      <Figital />
      <Modelo />
      <MarqueeBand />
      <Negocios />
      <ParaQuem />
      <Visao />
      <ProvaSocial />
      <CTA />
      <Localizacao />
      <FAQ />
      <Contato />
    </main>
  );
}
