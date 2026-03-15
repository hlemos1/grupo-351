import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getParceiros } from "@/lib/parceiro";
import crypto from "crypto";

export async function GET() {
  const parceiros = await getParceiros();
  return NextResponse.json(parceiros);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, email, projetoSlug, papel } = body;

    if (!nome || !email || !projetoSlug) {
      return NextResponse.json({ error: "Campos obrigatórios: nome, email, projetoSlug" }, { status: 400 });
    }

    // Gerar token único
    const token = `p351-${crypto.randomBytes(16).toString("hex")}`;

    const parceiro = await prisma.parceiro.create({
      data: {
        nome,
        email: email.toLowerCase(),
        token,
        projetoSlug,
        papel: papel || "operador",
      },
    });

    return NextResponse.json({
      id: parceiro.id,
      nome: parceiro.nome,
      token: parceiro.token,
      portalUrl: `/parceiro?token=${parceiro.token}`,
    });
  } catch (err) {
    if (String(err).includes("Unique")) {
      return NextResponse.json({ error: "Email já registrado como parceiro" }, { status: 409 });
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
