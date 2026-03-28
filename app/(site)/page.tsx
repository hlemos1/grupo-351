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
  { q: "O que e o Grupo +351?", a: "Somos um venture builder luso-brasileiro sediado em Cascais, Portugal. Criamos, operamos e escalamos empresas reais que integram operacoes fisicas, tecnologia digital e supply chain global." },
  { q: "O que e uma Joint Venture no +351?", a: "E uma parceria societaria real. O grupo entra com marca, metodo, capital e governanca. O operador entra com execucao e know-how. Estruturas variam de 50/50 a 75/25 com vesting." },
  { q: "Preciso ter capital para ser parceiro?", a: "Depende do modelo e da vertical. Existem modelos com vesting progressivo onde a participacao e conquistada com performance, sem capital inicial." },
  { q: "Como me candidato?", a: "Atraves do formulario estruturado em /aplicar. Sao 5 etapas: perfil pessoal, experiencia, modelo de interesse, proposta e aceite de NDA. Candidaturas sao analisadas em ate 5 dias uteis." },
  { q: "Voces atuam apenas em Portugal?", a: "Estamos sediados em Cascais, Portugal, mas operamos globalmente. Sourcing direto na China, marcas com raizes no Brasil, distribuicao europeia e supply chain Asia-Europa." },
  { q: "Como as empresas do ecossistema se conectam?", a: "Cada empresa e um no na rede. Operacao fisica gera caixa e dados, inteligencia digital transforma em decisao, comercio global conecta producao a mercado." },
  { q: "Qual a diferenca entre operador e investidor?", a: "Operador executa o dia-a-dia e conquista participacao via vesting. Investidor entra com capital e tem retorno proporcional. O modelo ambos combina os dois." },
  { q: "O Grupo +351 participa da operacao diaria?", a: "Depende da vertical. Nas empresas 100% do grupo, sim. Nas joint ventures, a operacao e do parceiro. O grupo fornece estrategia, governanca e conselho mensal." },
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
