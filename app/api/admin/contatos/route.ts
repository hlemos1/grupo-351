import { NextResponse } from "next/server";
import { getContatos } from "@/lib/db";

export async function GET() {
  const data = getContatos();
  return NextResponse.json(data);
}
