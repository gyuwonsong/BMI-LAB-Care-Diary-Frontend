import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { decodeJwtPayload } from "@/lib/jwt";

type JwtPayload = {
  role?: "USER" | "ADMIN";
  exp?: number;

  name?: string;
  userName?: string;
  username?: string;
  nickname?: string;
};

function hasNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function isTempToken(payload: JwtPayload) {
  const name =
    payload.name ?? payload.userName ?? payload.username ?? payload.nickname;

  return !hasNonEmptyString(name);
}

export default async function RootPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("cd_token")?.value;

  if (!token) redirect("/login");

  const payload = decodeJwtPayload<JwtPayload>(token);
  if (!payload) redirect("/login");

  if (payload.exp && payload.exp * 1000 < Date.now()) {
    redirect("/login");
  }

  if (isTempToken(payload)) {
    redirect("/register");
  }

  if (payload.role === "ADMIN") {
    redirect("/admin/users");
  }

  redirect("/home");
}
