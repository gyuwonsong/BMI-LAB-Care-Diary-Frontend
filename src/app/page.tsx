import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { decodeJwtPayload } from "@/lib/jwt";

type JwtPayload = {
  role?: "USER" | "ADMIN";
  exp?: number;
};

export default async function RootPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("cd_token")?.value;

  if (!token) redirect("/login");

  const payload = decodeJwtPayload<JwtPayload>(token);
  if (!payload) redirect("/login");

  if (payload.exp && payload.exp * 1000 < Date.now()) {
    redirect("/login");
  }

  if (payload.role === "ADMIN") {
    redirect("/admin/users");
  }

  redirect("/home");
}
