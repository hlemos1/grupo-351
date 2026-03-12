import { NextResponse } from "next/server";
import { updateContato } from "@/lib/db";

interface Props {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: Props) {
  const { id } = await params;
  const updates = await request.json();
  const item = await updateContato(id, updates);
  if (!item) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  return NextResponse.json(item);
}
