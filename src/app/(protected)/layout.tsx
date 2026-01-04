"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getOAuthSession, clearOAuthSession } from "@/lib/auth-storage";
import { decodeJwtPayload } from "@/lib/jwt";

type JwtPayload = {
  exp?: number;
  name?: string;
};

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const { token } = getOAuthSession();
    if (!token) {
      router.replace("/login");
      return;
    }

    const payload = decodeJwtPayload<JwtPayload>(token);
    if (!payload) {
      clearOAuthSession();
      router.replace("/login");
      return;
    }

    if (payload.exp && payload.exp * 1000 < Date.now()) {
      clearOAuthSession();
      router.replace("/login?reason=expired");
      return;
    }

    if (!payload.name || payload.name.trim() === "") {
      router.replace("/register");
      return;
    }

    setAllowed(true);
  }, [router]);

  if (!allowed) return null;

  return <>{children}</>;
}
