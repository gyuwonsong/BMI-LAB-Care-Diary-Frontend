"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setOAuthSession } from "@/lib/auth-storage";
import { decodeJwtPayload } from "@/lib/jwt";
import type { OAuthType } from "@/lib/auth-storage";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const isOAuthType = (v: string): v is OAuthType =>
  v === "SUCCESS" || v === "NEW" || v === "DUPLICATE_EMAIL";

type JwtPayload = {
  role?: "USER" | "ADMIN";
  exp?: number;
};

export default function CallbackClient() {
  const router = useRouter();
  const sp = useSearchParams();

  useEffect(() => {
    const run = async () => {
      const type = sp.get("type");
      const token = sp.get("token");

      if (type && token && isOAuthType(type)) {
        setOAuthSession(type, token);

        window.history.replaceState(
          {},
          "",
          `/callback?type=${encodeURIComponent(type)}`,
        );

        if (type === "SUCCESS") {
          const payload = decodeJwtPayload<JwtPayload>(token);

          await fetch("/api/auth/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          });

          window.location.assign(
            payload?.role === "ADMIN" ? "/admin/users" : "/home",
          );

          return;
        }

        if (type === "NEW") {
          router.replace("/register");
          return;
        }

        router.replace("/login/duplicate-email");
        return;
      }

      const code = sp.get("code");
      const state = sp.get("state");

      if (code) {
        const exchangeUrl = new URL(`${API_BASE}/oauth2/naver/exchange`);
        exchangeUrl.searchParams.set("code", code);
        if (state) exchangeUrl.searchParams.set("state", state);
        exchangeUrl.searchParams.set(
          "redirect",
          `${window.location.origin}/callback`,
        );

        window.location.href = exchangeUrl.toString();
        return;
      }

      router.replace("/login?error=invalid_callback");
    };

    void run();
  }, [router, sp]);

  return null;
}
