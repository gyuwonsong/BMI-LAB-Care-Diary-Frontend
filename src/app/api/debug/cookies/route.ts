import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const store = await cookies();
  return NextResponse.json({
    cd_token: store.get("cd_token")?.value ?? null,
    names: store.getAll().map((c) => c.name),
  });
}
