import { NextResponse } from "next/server";
import { searchPlatform } from "@/lib/search";

// GET — busca global (oportunidades + empresas)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 20));

  if (!q || q.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }

  const results = await searchPlatform(q, limit);
  return NextResponse.json({ results, query: q });
}
