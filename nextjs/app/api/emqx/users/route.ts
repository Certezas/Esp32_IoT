import { NextResponse } from "next/server";
import { EMQX_AUTHN_ID, emqxFetch, bearer } from "@/lib/emqx";
import { cookies } from "next/headers";

export async function GET() {
  const token = cookies().get("emqx_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const data = await emqxFetch(`/authentication/${encodeURIComponent(EMQX_AUTHN_ID)}/users`, {
      headers: { ...bearer(token) },
    });
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
const token = cookies().get("emqx_token")?.value;
if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

const { user_id, password, is_superuser = false } = await req.json();

if (!user_id || !password) {
  return NextResponse.json(
    { error: "user_id e password são obrigatórios" },
    { status: 400 }
  );
}

try {
  const data = await emqxFetch(
    `/authentication/${encodeURIComponent(EMQX_AUTHN_ID)}/users`,
    {
      method: "POST",
      headers: { ...bearer(token) },
      body: JSON.stringify({ user_id, password, is_superuser }),
    }
  );
  return NextResponse.json(data, { status: 201 });
}catch(e){
return NextResponse.json({ error: e.message }, { status: 400 });
}

}

// EDITAR (PUT) — requer user_id via query e password no body (EMQX exige)
export async function PUT(req: Request) {
  const token = cookies().get("emqx_token")?.value;
  if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get("user_id");
  if (!user_id) {
    return NextResponse.json({ error: "user_id é obrigatório" }, { status: 400 });
  }

  const { password, is_superuser } = await req.json();
  if (!password) {
    // De acordo com a doc da API, password é obrigatório no update
    return NextResponse.json(
      { error: "password é obrigatório para atualização" },
      { status: 400 }
    );
  }

  const body: Record<string, unknown> = { password };
  if (typeof is_superuser === "boolean") body.is_superuser = is_superuser;

  try {
    const data = await emqxFetch(
      `/authentication/${encodeURIComponent(EMQX_AUTHN_ID)}/users/${encodeURIComponent(user_id)}`,
      {
        method: "PUT",
        headers: { ...bearer(token) },
        body: JSON.stringify(body),
      }
    );
    return NextResponse.json(data, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
export async function DELETE(req: Request) {
  const token = cookies().get("emqx_token")?.value;
  if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get("user_id");
  if (!user_id) {
    return NextResponse.json({ error: "user_id é obrigatório" }, { status: 400 });
  }

  try {
    const data = await emqxFetch(
      `/authentication/${encodeURIComponent(EMQX_AUTHN_ID)}/users/${encodeURIComponent(user_id)}`,
      { method: "DELETE", headers: { ...bearer(token) } , body:null }
    );
    return NextResponse.json(data ?? {result: "ok"},{ status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

