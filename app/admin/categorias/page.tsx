"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/contexts/AuthProvider";
import { api } from "@/lib/api";
import type { Category } from "@/lib/types";

export default function AdminCategoriesPage() {
  const auth = useContext(AuthContext);
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (auth?.isReady && !auth.token) {
      router.push("/login");
    }

    if (auth?.isReady && auth.user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [auth?.isReady, auth?.token, auth?.user?.role, router]);

  const loadCategories = async () => {
    try {
      const response = await api.get("/category");
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token && auth.user?.role === "ADMIN") {
      loadCategories();
    }
  }, [auth?.token, auth?.user?.role]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await api.post("/category/create", {
        id: crypto.randomUUID(),
        name: form.name,
        description: form.description,
      });
      setForm({ name: "", description: "" });
      setMessage("Categoria criada com sucesso.");
      await loadCategories();
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
      setMessage("Nao foi possivel criar a categoria.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await api.delete(`/category/delete/${id}`);
      await loadCategories();
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
    } finally {
      setDeletingId(null);
    }
  };

  if (!auth?.isReady || loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="animate-pulse rounded-[2rem] bg-white p-8 shadow-sm">
          <div className="h-10 w-64 rounded bg-slate-200" />
          <div className="mt-6 h-24 rounded bg-slate-200" />
        </div>
      </div>
    );
  }

  if (!auth?.token || auth.user?.role !== "ADMIN") return null;

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">
            Admin
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">
            Categorias
          </h1>

          <form onSubmit={handleCreate} className="mt-8 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Nome</label>
              <input
                value={form.name}
                onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Descricao
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((current) => ({ ...current, description: e.target.value }))
                }
                className="min-h-28 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {message && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-70"
            >
              {saving ? "Salvando..." : "Criar categoria"}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {categories.map((category) => (
            <article
              key={category.id}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">
                    {category.name}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {category.description || "Sem descricao cadastrada."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(category.id)}
                  disabled={deletingId === category.id}
                  className="rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:opacity-70"
                >
                  {deletingId === category.id ? "Excluindo..." : "Excluir"}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
