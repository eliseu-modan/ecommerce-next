"use client";

import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/contexts/AuthProvider";
import { api } from "@/lib/api";
import type { Category } from "@/lib/types";

export default function NewProductPage() {
  const auth = useContext(AuthContext);
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    imageUrl: "",
    attributeName: "",
    attributeValue: "",
  });

  useEffect(() => {
    if (auth?.isReady && !auth.token) {
      router.push("/login");
    }

    if (auth?.isReady && auth.user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [auth?.isReady, auth?.token, auth?.user?.role, router]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await api.get("/category");
        const nextCategories = Array.isArray(response.data) ? response.data : [];
        setCategories(nextCategories);
        if (nextCategories[0]) {
          setForm((current) => ({ ...current, categoryId: nextCategories[0].id }));
        }
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      } finally {
        setLoading(false);
      }
    };

    if (auth?.token && auth.user?.role === "ADMIN") {
      loadCategories();
    }
  }, [auth?.token, auth?.user?.role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await api.post("/product/create", {
        id: crypto.randomUUID(),
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        categoryId: form.categoryId,
        attributes:
          form.attributeName && form.attributeValue
            ? [{ name: form.attributeName, value: form.attributeValue }]
            : [],
        images: form.imageUrl ? [{ url: form.imageUrl, altText: form.name }] : [],
      });

      setMessage("Produto criado com sucesso.");
      setForm({
        name: "",
        description: "",
        price: "",
        stock: "",
        categoryId: categories[0]?.id || "",
        imageUrl: "",
        attributeName: "",
        attributeValue: "",
      });
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      setMessage("Nao foi possivel criar o produto.");
    } finally {
      setSaving(false);
    }
  };

  if (!auth?.isReady || loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="animate-pulse rounded-[2rem] bg-white p-8 shadow-sm">
          <div className="h-10 w-64 rounded bg-slate-200" />
          <div className="mt-6 h-24 rounded bg-slate-200" />
        </div>
      </div>
    );
  }

  if (!auth?.token || auth.user?.role !== "ADMIN") return null;

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">
            Admin
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">
            Novo produto
          </h1>
        </div>
        <Link
          href="/admin/produtos"
          className="rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Voltar
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">Nome</label>
            <input
              value={form.name}
              onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Descricao
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((current) => ({ ...current, description: e.target.value }))
              }
              className="min-h-32 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Preco</label>
            <input
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm((current) => ({ ...current, price: e.target.value }))}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Estoque</label>
            <input
              type="number"
              value={form.stock}
              onChange={(e) => setForm((current) => ({ ...current, stock: e.target.value }))}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Categoria
            </label>
            <select
              value={form.categoryId}
              onChange={(e) =>
                setForm((current) => ({ ...current, categoryId: e.target.value }))
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              URL da imagem
            </label>
            <input
              value={form.imageUrl}
              onChange={(e) =>
                setForm((current) => ({ ...current, imageUrl: e.target.value }))
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Nome do atributo
            </label>
            <input
              value={form.attributeName}
              onChange={(e) =>
                setForm((current) => ({ ...current, attributeName: e.target.value }))
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Cor"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Valor do atributo
            </label>
            <input
              value={form.attributeValue}
              onChange={(e) =>
                setForm((current) => ({ ...current, attributeValue: e.target.value }))
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Azul"
            />
          </div>
        </div>

        {message && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="mt-6 rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-70"
        >
          {saving ? "Salvando..." : "Criar produto"}
        </button>
      </form>
    </section>
  );
}
