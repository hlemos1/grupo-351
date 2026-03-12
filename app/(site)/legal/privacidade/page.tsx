import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade — GRUPO +351",
};

export default function Privacidade() {
  return (
    <>
      <main className="pt-16">
        <section className="py-24">
          <div className="max-w-3xl mx-auto px-6 prose prose-slate">
            <h1 className="text-3xl font-bold text-primary font-display mb-8">
              Política de Privacidade
            </h1>
            <p className="text-muted text-sm mb-8">
              Última atualização: Março 2026
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
              1. Responsável pelo tratamento
            </h2>
            <p className="text-muted leading-relaxed mb-4">
              O Grupo +351, sediado em Cascais, Portugal, é o responsável pelo tratamento
              dos dados pessoais recolhidos através deste website, em conformidade com o
              Regulamento Geral sobre a Proteção de Dados (RGPD — Regulamento UE 2016/679).
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
              2. Dados recolhidos
            </h2>
            <p className="text-muted leading-relaxed mb-4">
              Recolhemos apenas os dados que nos fornece voluntariamente através do
              formulário de contato:
            </p>
            <ul className="text-muted space-y-2 mb-4 list-disc pl-5">
              <li>Nome</li>
              <li>Endereço de email</li>
              <li>Nome da empresa (opcional)</li>
              <li>Tipo de proposta</li>
              <li>Mensagem</li>
            </ul>

            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
              3. Finalidade do tratamento
            </h2>
            <p className="text-muted leading-relaxed mb-4">
              Os dados são tratados exclusivamente para:
            </p>
            <ul className="text-muted space-y-2 mb-4 list-disc pl-5">
              <li>Responder às suas mensagens e propostas</li>
              <li>Avaliar oportunidades de parceria ou joint venture</li>
              <li>Manter um registo de contactos comerciais</li>
            </ul>

            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
              4. Base legal
            </h2>
            <p className="text-muted leading-relaxed mb-4">
              O tratamento dos seus dados baseia-se no seu consentimento (artigo 6.º, n.º 1,
              alínea a) do RGPD), prestado ao submeter o formulário de contato, e no
              interesse legítimo do Grupo +351 em desenvolver relações comerciais.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
              5. Conservação dos dados
            </h2>
            <p className="text-muted leading-relaxed mb-4">
              Os seus dados serão conservados pelo período necessário para a finalidade
              para a qual foram recolhidos, não excedendo 24 meses após o último contacto,
              salvo obrigação legal em contrário.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
              6. Direitos do titular
            </h2>
            <p className="text-muted leading-relaxed mb-4">
              Nos termos do RGPD, tem direito a:
            </p>
            <ul className="text-muted space-y-2 mb-4 list-disc pl-5">
              <li>Aceder aos seus dados pessoais</li>
              <li>Retificar dados incorretos ou desatualizados</li>
              <li>Solicitar a eliminação dos seus dados</li>
              <li>Limitar o tratamento dos seus dados</li>
              <li>Portabilidade dos dados</li>
              <li>Opor-se ao tratamento</li>
              <li>Retirar o consentimento a qualquer momento</li>
            </ul>
            <p className="text-muted leading-relaxed mb-4">
              Para exercer qualquer destes direitos, contacte-nos através de{" "}
              <a href="mailto:contato@grupo351.com" className="text-accent hover:underline">
                contato@grupo351.com
              </a>.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
              7. Reclamações
            </h2>
            <p className="text-muted leading-relaxed mb-4">
              Tem o direito de apresentar uma reclamação junto da Comissão Nacional de
              Proteção de Dados (CNPD) — www.cnpd.pt — caso considere que o tratamento
              dos seus dados viola a legislação aplicável.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
              8. Segurança
            </h2>
            <p className="text-muted leading-relaxed">
              Implementamos medidas técnicas e organizativas adequadas para proteger os
              seus dados pessoais contra acessos não autorizados, perda ou destruição.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
