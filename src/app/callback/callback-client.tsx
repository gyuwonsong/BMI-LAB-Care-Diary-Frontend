"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setOAuthSession } from "@/lib/auth-storage";
import type { OAuthType } from "@/lib/auth-storage";

const isOAuthType = (v: string): v is OAuthType =>
  v === "SUCCESS" || v === "NEW" || v === "DUPLICATE_EMAIL";

export default function CallbackClient() {
  const router = useRouter();
  const sp = useSearchParams();

  useEffect(() => {
    const type = sp.get("type");
    const token = sp.get("token");

    if (!type || !token || !isOAuthType(type)) {
      router.replace("/login?error=invalid_callback");
      return;
    }

    setOAuthSession(type, token);

    window.history.replaceState(
      {},
      "",
      `/callback?type=${encodeURIComponent(type)}`,
    );

    if (type === "SUCCESS") router.replace("/home");
    else if (type === "NEW") router.replace("/register");
    else router.replace("/login/duplicate-email");
  }, [router, sp]);

  return null;
}
