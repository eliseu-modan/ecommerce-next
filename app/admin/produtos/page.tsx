"use client";

import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/contexts/AuthProvider";
import { api } from "@/lib/api";
import { formatCurrency, getProductImage } from "@/lib/format";
import type { Product } from "@/lib/types";

export default function AdminProductsPage() {
  const auth = useContext(AuthContext);
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (auth?.isReady && !auth.token) {
      router.push("/login");
    }

    if (auth?.isReady && auth.user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [auth?.isReady, auth?.token, auth?.user?.role, router]);

  const loadProducts = async () => {
    try {
      const response = await api.get("/product/getAll");
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token && auth.user?.role === "ADMIN") {
      loadProducts();
    }
  }, [auth?.token, auth?.user?.role]);

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await api.delete(`/product/delete/${id}`);
      await loadProducts();
    } catch (error) {
      console.error("Erro ao remover produto:", error);
    } finally {
      setDeletingId(null);
    }
  };

  if (!auth?.isReady || loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="animate-pulse rounded-[2rem] bg-white p-8 shadow-sm">
          <div className="h-10 w-64 rounded bg-slate-200" />
          <div className="mt-6 h-24 rounded bg-slate-200" />
        </div>
      </div>
    );
  }

  if (!auth?.token || auth.user?.role !== "ADMIN") return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">
            Admin
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">
            Gerenciar produtos
          </h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/categorias"
            className="rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Categorias
          </Link>
          <Link
            href="/admin/produtos/novo"
            className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Novo produto
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <article
            key={product.id}
            className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm"
          >
            <img
              src={getProductImage(product.images?.[0]?.url)}
              alt={product.name}
              className="h-64 w-full object-cover"
            />
            <div className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    {product.name}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                    {product.description}
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {product.stock} un.
                </span>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-slate-900">
                  {formatCurrency(product.price)}
                </p>
                <button
                  type="button"
                  onClick={() => handleDelete(product.id)}
                  disabled={deletingId === product.id}
                  className="rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:opacity-70"
                >
                  {deletingId === product.id ? "Removendo..." : "Excluir"}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
