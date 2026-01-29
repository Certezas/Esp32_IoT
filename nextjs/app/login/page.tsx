"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setU] = useState("");
  const [password, setP] = useState("");
  const [loading, setL] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setL(true);
    try {
      const res = await fetch("/api/emqx/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Falha no login");
      router.push("/users");
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setL(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 card">
        <h1 className="text-xl font-semibold">Login EMQX</h1>
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Usuário do Dashboard"
          value={username}
          onChange={e => setU(e.target.value)}
        />
        <input
          className="w-full border rounded px-3 py-2"
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setP(e.target.value)}
        />
        {err && <div className="text-red-600 text-sm">{err}</div>}
        <button disabled={loading} className="w-full rounded bg-black text-white py-2">
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
