import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET() {
  const filepath = join(process.cwd(), "data", "reunioes.json");
  const raw = readFileSync(filepath, "utf-8");
  return NextResponse.json(JSON.parse(raw));
}
