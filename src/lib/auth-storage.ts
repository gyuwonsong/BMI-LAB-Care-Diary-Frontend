export type OAuthType = "SUCCESS" | "NEW" | "DUPLICATE_EMAIL";
export type OAuthProvider = "google" | "naver" | "kakao";

const KEYS = {
  type: "oauth:type",
  token: "oauth:token",
  provider: "oauth:provider",
} as const;

const COOKIE_NAME = "cd_token";

function canUseSessionStorage(): boolean {
  return typeof window !== "undefined" && typeof sessionStorage !== "undefined";
}

function setTokenCookie(token: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

export function getOAuthProvider(): OAuthProvider | null {
  if (!canUseSessionStorage()) return null;
  const v = sessionStorage.getItem(KEYS.provider);
  return v === "google" || v === "naver" || v === "kakao" ? v : null;
}

export function setOAuthSession(type: OAuthType, token: string) {
  if (!canUseSessionStorage()) return;
  sessionStorage.setItem(KEYS.type, type);
  sessionStorage.setItem(KEYS.token, token);
  setTokenCookie(token);
}

export function getOAuthSession(): {
  type: OAuthType | null;
  token: string | null;
} {
  if (!canUseSessionStorage()) return { type: null, token: null };
  const type = sessionStorage.getItem(KEYS.type) as OAuthType | null;
  const token = sessionStorage.getItem(KEYS.token);
  return { type, token };
}

export function updateOAuthToken(nextToken: string) {
  if (!canUseSessionStorage()) return;
  sessionStorage.setItem(KEYS.token, nextToken);
  setTokenCookie(nextToken);
}

export function clearOAuthSession() {
  if (typeof window !== "undefined" && typeof sessionStorage !== "undefined") {
    sessionStorage.removeItem("oauth:type");
    sessionStorage.removeItem("oauth:token");
    sessionStorage.removeItem("oauth:provider");
  }

  document.cookie = "cd_token=; Path=/; Max-Age=0; SameSite=Lax";
}
