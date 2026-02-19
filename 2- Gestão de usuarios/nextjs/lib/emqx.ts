export const EMQX_BASE_URL = process.env.EMQX_BASE_URL!;
export const EMQX_AUTHN_ID = process.env.EMQX_AUTHN_ID ?? "password_based:built_in_database";

export function bearer(token?: string) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function emqxFetch(path: string, init?: RequestInit) {
  if (!EMQX_BASE_URL) {
    throw new Error("EMQX_BASE_URL não está definido (.env.local)");
  }
  const url = `${EMQX_BASE_URL.replace(/\/$/, "")}/api/v5${path}`;
  const res = await fetch(url, {
    cache: "no-store",
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`EMQX ${res.status} ${res.statusText}: ${text}`);
  }
  return res.json();
}
