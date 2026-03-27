"use client";

import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/AuthProvider";
import { api } from "@/lib/api";
import type { Category } from "@/lib/types";

export default function CategoriesSection() {
  const auth = useContext(AuthContext);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await api.get("/category");
        setCategories(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <section id="categorias" className="mx-auto max-w-7xl px-6 py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">
            Compre por estilo
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
            Descubra colecoes pensadas para diferentes momentos do seu dia.
          </h2>
        </div>
        {auth?.user?.role === "ADMIN" && (
          <Link
            href="/admin/categorias"
            className="text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
          >
            Gerenciar colecoes
          </Link>
        )}
      </div>

      {loading ? (
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-40 animate-pulse rounded-[1.75rem] bg-slate-200"
            />
          ))}
        </div>
      ) : categories.length > 0 ? (
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <article
              key={category.id}
              className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                Colecao
              </p>
              <h3 className="mt-4 text-2xl font-semibold text-slate-900">
                {category.name}
              </h3>
              <p className="mt-3 min-h-12 text-sm leading-7 text-slate-600">
                {category.description ||
                  "Uma selecao preparada para compor sua vitrine e facilitar a descoberta de produtos."}
              </p>
              <div className="mt-6 flex items-center justify-between">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  Ref. {category.id.slice(0, 8)}
                </span>
                {auth?.user?.role === "ADMIN" && (
                  <Link
                    href="/admin/produtos/novo"
                    className="text-sm font-medium text-indigo-600"
                  >
                    Montar vitrine
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-[1.75rem] border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500">
          Ainda nao ha colecoes cadastradas para exibir nesta vitrine.
        </div>
      )}
    </section>
  );
}
