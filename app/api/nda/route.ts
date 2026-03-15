import { NextResponse } from "next/server";

const NDA_VERSION = "1.0";
const NDA_DATE = "15 de março de 2026";

function generateNdaHtml(nome?: string, data?: string): string {
  const candidato = nome || "[NOME DO CANDIDATO]";
  const dataAceite = data || "[DATA]";

  return `<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <title>NDA Preliminar — Grupo +351</title>
  <style>
    body { font-family: Georgia, 'Times New Roman', serif; max-width: 700px; margin: 40px auto; padding: 0 20px; color: #1a1a1a; line-height: 1.8; font-size: 14px; }
    h1 { font-size: 20px; text-align: center; margin-bottom: 4px; }
    h2 { font-size: 15px; margin-top: 24px; }
    .subtitle { text-align: center; color: #666; font-size: 13px; margin-bottom: 32px; }
    .header { text-align: center; border-bottom: 2px solid #0B1D32; padding-bottom: 16px; margin-bottom: 32px; }
    .logo { font-size: 24px; font-weight: bold; color: #0B1D32; }
    .logo span { color: #E8713A; }
    .clause { margin-bottom: 16px; }
    .signature { margin-top: 48px; border-top: 1px solid #ddd; padding-top: 24px; }
    .sig-line { border-bottom: 1px solid #333; width: 300px; margin-top: 40px; margin-bottom: 4px; }
    .sig-label { color: #666; font-size: 12px; }
    .footer { margin-top: 40px; text-align: center; color: #999; font-size: 11px; border-top: 1px solid #eee; padding-top: 16px; }
    @media print { body { margin: 0; padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo"><span>+</span>351</div>
    <p class="subtitle">GRUPO +351 — Hub de Negócios e Joint Ventures</p>
  </div>

  <h1>Acordo de Confidencialidade Preliminar (NDA)</h1>
  <p class="subtitle">Versão ${NDA_VERSION} — ${NDA_DATE}</p>

  <h2>1. Partes</h2>
  <div class="clause">
    <p><strong>Parte Divulgadora:</strong> GRUPO +351, LDA., com sede em Cascais, Portugal, doravante designada "Grupo".</p>
    <p><strong>Parte Receptora:</strong> ${candidato}, doravante designado(a) "Candidato(a)".</p>
  </div>

  <h2>2. Objeto</h2>
  <div class="clause">
    <p>O presente acordo tem por objeto estabelecer as condições de confidencialidade aplicáveis às informações partilhadas no âmbito do processo de avaliação de candidatura a Joint Venture ou parceria estratégica com o Grupo +351.</p>
  </div>

  <h2>3. Informações Confidenciais</h2>
  <div class="clause">
    <p>Consideram-se "Informações Confidenciais" todas as informações de natureza comercial, financeira, operacional, estratégica ou técnica, transmitidas por qualquer meio (oral, escrito, digital), incluindo mas não limitado a:</p>
    <ul>
      <li>Modelos de negócio, margens operacionais e projeções financeiras;</li>
      <li>Estratégias de expansão, pricing e posicionamento de mercado;</li>
      <li>Software proprietário, processos operacionais e metodologias;</li>
      <li>Dados de parceiros, fornecedores e clientes;</li>
      <li>Termos de acordos e contratos existentes.</li>
    </ul>
  </div>

  <h2>4. Obrigações do Candidato</h2>
  <div class="clause">
    <p>O Candidato compromete-se a:</p>
    <ul>
      <li>Manter sigilo absoluto sobre todas as Informações Confidenciais recebidas;</li>
      <li>Não utilizar as Informações Confidenciais para qualquer finalidade diversa da avaliação da parceria;</li>
      <li>Não divulgar, reproduzir ou transmitir as Informações Confidenciais a terceiros;</li>
      <li>Devolver ou destruir quaisquer materiais confidenciais caso o processo não avance;</li>
      <li>Informar imediatamente o Grupo em caso de divulgação acidental.</li>
    </ul>
  </div>

  <h2>5. Exclusões</h2>
  <div class="clause">
    <p>Não se consideram confidenciais informações que:</p>
    <ul>
      <li>Sejam ou se tornem de domínio público sem violação deste acordo;</li>
      <li>Estejam legalmente na posse do Candidato antes da divulgação;</li>
      <li>Sejam obtidas legitimamente de terceiros sem obrigação de sigilo;</li>
      <li>Devam ser divulgadas por imposição legal ou judicial.</li>
    </ul>
  </div>

  <h2>6. Vigência</h2>
  <div class="clause">
    <p>Este acordo entra em vigor na data de aceite digital e permanece válido por um período de <strong>2 (dois) anos</strong> após o término do processo de avaliação, independentemente do resultado.</p>
  </div>

  <h2>7. Declaração de Veracidade</h2>
  <div class="clause">
    <p>O Candidato declara que todas as informações fornecidas no formulário de candidatura são verdadeiras, completas e passíveis de verificação.</p>
  </div>

  <h2>8. Lei Aplicável</h2>
  <div class="clause">
    <p>Este acordo é regido pela legislação portuguesa. Qualquer litígio será submetido à jurisdição dos tribunais de Cascais, Portugal.</p>
  </div>

  <h2>9. Proteção de Dados</h2>
  <div class="clause">
    <p>O tratamento dos dados pessoais do Candidato rege-se pelo Regulamento Geral de Proteção de Dados (RGPD — Regulamento UE 2016/679) e pela legislação portuguesa aplicável. Os dados serão utilizados exclusivamente para fins de avaliação da candidatura.</p>
  </div>

  <div class="signature">
    <p><strong>Aceite digital registrado:</strong></p>
    <p>Nome: ${candidato}</p>
    <p>Data: ${dataAceite}</p>
    <p style="font-size: 12px; color: #666;">Este documento foi aceite eletronicamente através do formulário de candidatura em grupo351.com. O registo inclui endereço IP, data/hora e identificação do navegador como prova de aceite.</p>
  </div>

  <div class="footer">
    <p>GRUPO +351, LDA. — Cascais, Portugal</p>
    <p>contato@grupo351.com | grupo351.com</p>
    <p>NDA v${NDA_VERSION}</p>
  </div>
</body>
</html>`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const nome = searchParams.get("nome") || undefined;
  const data = searchParams.get("data") || undefined;

  const html = generateNdaHtml(nome, data);

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `inline; filename="NDA-Grupo351-Preliminar.html"`,
    },
  });
}
