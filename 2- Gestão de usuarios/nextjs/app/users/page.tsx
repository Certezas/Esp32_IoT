"use client";

import { useEffect, useState } from "react";

type EmqxUser = {
  user_id: string;
  is_superuser?: boolean;

};

export default function UsersPage() {
  const [users, setUsers] = useState<EmqxUser[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  //estados do formulario
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [superuser, setSuperuser] = useState(false);
  const [saving, setSaving] = useState(false);

  // edição
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPassword, setEditPassword] = useState("");
  const [editSuperuser, setEditSuperuser] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);

  //habilita o edit
  function startEdit(u: EmqxUser) {
    setEditingId(u.user_id);                 // marca a linha em edição
    setEditPassword("");                     // senha começa vazia (obrigatória)
    setEditSuperuser(!!u.is_superuser);      // preenche com estado atual
  }

  //cancela o edit
  function cancelEdit() {
    setEditingId(null);        // sai do modo edição
    setEditPassword("");       // limpa campo
    setEditSuperuser(false);   // volta para valor default
  }


  async function onEditSave() {
    if (!editingId) return;                 // não há usuário selecionado
    if (!editPassword) {                    // regra: password é obrigatório
      alert("Informe a nova senha (obrigatória para atualizar).");
      return;
    }
    setSavingEdit(true);
    setErr(null);
    try {
      const res = await fetch(
        // `/api/emqx/user_id=${encodeURIComponent(editingId)}`,
        `/api/emqx/users?user_id=${encodeURIComponent(editingId)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            password: editPassword,         // obrigatório
            is_superuser: editSuperuser,    // opcional (boolean)
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Falha ao atualizar usuário");
        console.log(data)
      // sucesso: sai do modo edição e recarrega a lista
      cancelEdit();
      await loadUsers();
    } catch (e: any) {
      setErr(e.message);                    // exibe erro
    } finally {
      setSavingEdit(false);                 // reativa botão
    }
  }


  // handler do POST (criação)
  async function onCreate(e: React.FormEvent) {
    e.preventDefault();              // evita reload da página
    setSaving(true);
    setErr(null);
    try {
      const body = {
        user_id: userId.trim(),      // user_id sem espaços na ponta
        password,
        is_superuser: superuser,
      };

      const res = await fetch("/api/emqx/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Falha ao criar usuário");

      // sucesso: limpa o form e recarrega a lista
      setUserId("");
      setPassword("");
      setSuperuser(false);
      await loadUsers();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function loadUsers() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/emqx/users", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Erro ao carregar usuários");
    
      setUsers(Array.isArray(data?.data) ? data.data : data);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);


  async function onDelete(user_id: string) {
  if (!confirm(`Remover usuário "${user_id}"?`)) return; // confirmação simples
  setErr(null);
  try {
    const res = await fetch(
      `/api/emqx/users?user_id=${encodeURIComponent(user_id)}`,
      { method: "DELETE" }
    );
   console.log(await res.json())
       if (editingId === user_id) cancelEdit(); // se estava editando, sai do modo edição
    await loadUsers();    // recarrega a lista após sucesso
  } catch (e: any) {
    setErr(e.message); // exibe o erro no topo
  }
}

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4 text-white">Usuários (Built-in DB)</h1>
      <form onSubmit={onCreate} className="card grid gap-3 md:grid-cols-2">
        <div className="md:col-span-2">
          <h2 className="text-lg font-medium">Cadastrar usuário</h2>
        </div>

        <div>
          <label className="block text-sm mb-1">User ID</label>
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="ex: cliente_123"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Senha</label>
          <input
            className="w-full border rounded px-3 py-2"
            type="password"
            placeholder="mín. recomendado 8 chars"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="su"
            type="checkbox"
            checked={superuser}
            onChange={(e) => setSuperuser(e.target.checked)}
          />
          <label htmlFor="su">Superuser</label>
        </div>

        <div className="md:col-span-2">
          <button disabled={saving} className="rounded bg-black text-white px-4 py-2">
            {saving ? "Salvando..." : "Criar usuário"}
          </button>
        </div>
      </form>

      {loading && <div className="text-white/80">Carregando...</div>}
      {err && <div className="text-red-400">{err}</div>}
      {!loading && !err && (
        <div className="overflow-auto card">
          <table className="min-w-[520px] w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2">User ID</th>
                <th className="text-left px-4 py-2">Superuser</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isEditing = editingId === u.user_id;
                return (
                  <tr key={u.user_id} className="border-t">
                    <td className="px-4 py-2">{u.user_id}</td>

                    <td className="px-4 py-2">
                      {isEditing ? (
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={editSuperuser}
                            onChange={(e) => setEditSuperuser(e.target.checked)}
                          />
                          <span>Superuser</span>
                        </label>
                      ) : u.is_superuser ? "Sim" : "Não"}
                    </td>

                    <td className="px-4 py-2 space-x-2">
                      {!isEditing ? (
                        <>
                          <button
                            className="text-white bg-blue-600 rounded px-3 py-1"
                            onClick={() => startEdit(u)}
                          >
                            Editar
                          </button>
                          <button
                            className="text-white bg-red-600 rounded px-3 py-1"
                            onClick={() => onDelete(u.user_id)}
                          >
                            Remover
                          </button>
                        </>
                      ) : (
                        <div className="flex flex-wrap items-center gap-2">
                          <input
                            className="border rounded px-3 py-1"
                            type="password"
                            placeholder="Nova senha (obrigatória)"
                            value={editPassword}
                            onChange={(e) => setEditPassword(e.target.value)}
                          />
                          <button
                            disabled={savingEdit}
                            className="text-white bg-green-600 rounded px-3 py-1"
                            onClick={onEditSave}
                          >
                            {savingEdit ? "Salvando..." : "Salvar"}
                          </button>
                          <button
                            className="text-white bg-gray-600 rounded px-3 py-1"
                            onClick={cancelEdit}
                          >
                            Cancelar
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}

              {users.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center" colSpan={3}>
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
