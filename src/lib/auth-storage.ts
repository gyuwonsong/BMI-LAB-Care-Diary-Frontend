export type OAuthType = "SUCCESS" | "NEW" | "DUPLICATE_EMAIL";
export type OAuthProvider = "google" | "naver" | "kakao";

const KEYS = {
  type: "oauth:type",
  token: "oauth:token",
  provider: "oauth:provider",
} as const;

const COOKIE_NAME = "cd_token";

function canUseLocalStorage(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function setTokenCookie(token: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
    token,
  )}; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

function getTokenCookie(): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|;\s*)cd_token=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

export function getOAuthProvider(): OAuthProvider | null {
  if (!canUseLocalStorage()) return null;
  const v = localStorage.getItem(KEYS.provider);
  return v === "google" || v === "naver" || v === "kakao" ? v : null;
}

export function setOAuthSession(type: OAuthType, token: string) {
  if (!canUseLocalStorage()) return;
  localStorage.setItem(KEYS.type, type);
  localStorage.setItem(KEYS.token, token);
  setTokenCookie(token);
}

export function getOAuthSession(): {
  type: OAuthType | null;
  token: string | null;
} {
  if (!canUseLocalStorage()) return { type: null, token: null };

  const type = localStorage.getItem(KEYS.type) as OAuthType | null;
  const lsToken = localStorage.getItem(KEYS.token);
  const cookieToken = getTokenCookie();
  const token = lsToken ?? cookieToken;

  if (!lsToken && token) {
    localStorage.setItem(KEYS.token, token);
    if (!type) localStorage.setItem(KEYS.type, "SUCCESS");
  }

  return { type: (type ?? "SUCCESS") as OAuthType, token };
}

export function updateOAuthToken(nextToken: string) {
  if (!canUseLocalStorage()) return;
  localStorage.setItem(KEYS.token, nextToken);
  setTokenCookie(nextToken);
}

export function clearOAuthSession() {
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    localStorage.removeItem(KEYS.type);
    localStorage.removeItem(KEYS.token);
    localStorage.removeItem(KEYS.provider);
  }

  if (typeof document !== "undefined") {
    document.cookie = "cd_token=; Path=/; Max-Age=0; SameSite=Lax";
  }
}
