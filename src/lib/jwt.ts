type JwtPayload = Record<string, unknown>;

function base64UrlToString(base64Url: string): string {
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");

  if (typeof window === "undefined") {
    return Buffer.from(padded, "base64").toString("utf-8");
  }

  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

export function decodeJwtPayload<T extends JwtPayload = JwtPayload>(
  token: string,
): T | null {
  const raw = token.replace(/^Bearer\s+/i, "").trim();
  const parts = raw.split(".");
  if (parts.length !== 3) return null;

  try {
    const json = base64UrlToString(parts[1]);
    return JSON.parse(json) as T;
  } catch (e) {
    console.error("JWT decode failed:", e);
    return null;
  }
}
