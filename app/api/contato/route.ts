import { NextResponse } from "next/server";
import { addCandidatura, addContato } from "@/lib/db";
import { notify } from "@/lib/notify";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Candidatura JV (vem do /aplicar)
    if (body.tipo === "aplicacao-jv") {
      const {
        nome, email, telefone, pais, cidade, perfil,
        experiencia, setor, empresaAtual, linkedin,
        modelo, capitalDisponivel, prazo, dedicacao,
        motivacao, diferenciais, disponibilidade, aceitaNDA,
      } = body;

      if (!nome || !email) {
        return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
      }

      await addCandidatura({
        nome, email, telefone, pais, cidade, perfil,
        experiencia, setor, empresaAtual, linkedin,
        modelo: modelo || [],
        capitalDisponivel, prazo, dedicacao,
        motivacao, diferenciais, disponibilidade,
        aceitaNDA: aceitaNDA || false,
      });

      await notify({
        tipo: "candidatura",
        nome,
        email,
        resumo: `Perfil: ${perfil} | Marcas: ${(modelo || []).join(", ")} | Capital: ${capitalDisponivel}`,
      });

      return NextResponse.json({ success: true });
    }

    // Contato genérico (vem do /contato)
    const { nome, email, empresa, tipo, orcamento, mensagem } = body;

    if (!nome || !email || !tipo || !mensagem) {
      return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
    }

    await addContato({ nome, email, empresa, tipo, orcamento, mensagem });

    await notify({
      tipo: "contato",
      nome,
      email,
      resumo: `Tipo: ${tipo} | ${mensagem.slice(0, 100)}${mensagem.length > 100 ? "..." : ""}`,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
