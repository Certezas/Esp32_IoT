import { NextResponse } from "next/server";
import { emqxFetch } from "@/lib/emqx";

export async function POST(req: Request) {
  const { username, password } = await req.json();
  if (!username || !password) {
    return NextResponse.json({ error: "username/password required" }, { status: 400 });
  }

  try {
    const data = await emqxFetch("/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });

    const token = data?.token;
    if (!token) {
      return NextResponse.json({ error: "token not returned" }, { status: 502 });
    }

    const res = NextResponse.json({ ok: true });
    res.headers.append(
      "Set-Cookie",
      `emqx_token=${token}; Path=/; HttpOnly; SameSite=Lax; Secure=${process.env.NODE_ENV === "production"}; Max-Age=86400`
    );
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}
