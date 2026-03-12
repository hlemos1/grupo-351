import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso — GRUPO +351",
};

export default function Termos() {
  return (
    <>
      <main className="pt-16">
        <section className="py-24">
          <div className="max-w-3xl mx-auto px-6 prose prose-slate">
            <h1 className="text-3xl font-bold text-primary font-display mb-8">
              Termos de Uso
            </h1>
            <p className="text-muted text-sm mb-8">
              Última atualização: Março 2026
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
              1. Identificação
            </h2>
            <p className="text-muted leading-relaxed mb-4">
              Este website é propriedade e operado pelo Grupo +351, uma iniciativa
              empresarial sediada em Cascais, Portugal.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
              2. Objeto
            </h2>
            <p className="text-muted leading-relaxed mb-4">
              Este website tem caráter informativo e institucional. Apresenta as atividades,
              o modelo de negócio e os projetos do Grupo +351, e disponibiliza um canal de
              contato para potenciais parceiros e interessados.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
              3. Propriedade intelectual
            </h2>
            <p className="text-muted leading-relaxed mb-4">
              Todo o conteúdo deste website — incluindo textos, gráficos, logótipos,
              ícones e imagens — é propriedade do Grupo +351 ou dos respetivos titulares
              de direitos, estando protegido pela legislação aplicável de propriedade
              intelectual. É proibida a reprodução, distribuição ou modificação sem
              autorização prévia por escrito.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
              4. Uso do website
            </h2>
            <p className="text-muted leading-relaxed mb-4">
              O utilizador compromete-se a utilizar este website de forma lícita e em
              conformidade com os presentes termos. É proibido:
            </p>
            <ul className="text-muted space-y-2 mb-4 list-disc pl-5">
              <li>Utilizar o website para fins ilícitos ou não autorizados</li>
              <li>Tentar aceder a áreas restritas do website</li>
              <li>Introduzir vírus ou código malicioso</li>
              <li>Recolher dados de outros utilizadores sem autorização</li>
            </ul>

            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
              5. Limitação de responsabilidade
            </h2>
            <p className="text-muted leading-relaxed mb-4">
              O Grupo +351 esforça-se por manter as informações deste website atualizadas
              e corretas, mas não garante a exatidão, integridade ou atualidade de todo o
              conteúdo. O website é disponibilizado &quot;tal como está&quot;, sem garantias
              de qualquer tipo.
            </p>
            <p className="text-muted leading-relaxed mb-4">
              O Grupo +351 não será responsável por quaisquer danos diretos ou indiretos
              decorrentes da utilização ou impossibilidade de utilização deste website.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
              6. Links externos
            </h2>
            <p className="text-muted leading-relaxed mb-4">
              Este website pode conter links para websites de terceiros. O Grupo +351 não
              é responsável pelo conteúdo, políticas de privacidade ou práticas de
              websites externos.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
              7. Alterações
            </h2>
            <p className="text-muted leading-relaxed mb-4">
              O Grupo +351 reserva-se o direito de alterar estes termos a qualquer momento.
              As alterações serão publicadas nesta página com atualização da data de
              última revisão.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
              8. Lei aplicável e jurisdição
            </h2>
            <p className="text-muted leading-relaxed mb-4">
              Estes termos são regidos pela lei portuguesa. Para a resolução de quaisquer
              litígios, será competente o foro da comarca de Cascais, com renúncia a
              qualquer outro.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
              9. Contato
            </h2>
            <p className="text-muted leading-relaxed">
              Para questões sobre estes termos, contacte-nos através de{" "}
              <a href="mailto:contato@grupo351.com" className="text-accent hover:underline">
                contato@grupo351.com
              </a>.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
