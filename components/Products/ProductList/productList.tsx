"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { AuthContext } from "@/contexts/AuthProvider";
import { api } from "@/lib/api";
import { addProductToCart } from "@/lib/cart";
import { formatCurrency, getProductImage } from "@/lib/format";
import type { Product } from "@/lib/types";

export default function ProductList() {
  const auth = useContext(AuthContext);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const response = await api.get("/product/getAll");
        setProducts(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setLoading(false);
      }
    };

    getAllProducts();
  }, []);

  const availableProducts = useMemo(
    () => products.filter((product) => Number(product.stock) > 0),
    [products],
  );

  const handleAddToCart = async (product: Product) => {
    addProductToCart(product, 1, auth?.user?.id);

    try {
      setAddingId(product.id);
      setMessage("");
      if (auth?.token) {
        await api.post("/shopping-cart/add-item-to-cart", {
          productId: product.id,
          quantity: 1,
        });
      }

      setMessage(
        auth?.token
          ? "Produto adicionado ao seu carrinho."
          : "Produto salvo no carrinho local. Faça login para concluir a compra.",
      );
    } catch (error) {
      console.error("Erro ao adicionar item ao carrinho:", error);
      setMessage("Produto salvo localmente. A sincronização com a API falhou neste momento.");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">
            Novidades da semana
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
            Escolha peças que combinam com uma vitrine de loja de verdade.
          </h2>
        </div>
        {auth?.user?.role === "ADMIN" && (
          <Link
            href="/admin/produtos"
            className="text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
          >
            Gerenciar catálogo
          </Link>
        )}
      </div>

      {message && (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      )}

      {loading ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="animate-pulse rounded-[1.75rem] bg-white p-4 shadow-sm">
              <div className="h-64 rounded-[1.25rem] bg-slate-200" />
              <div className="mt-4 h-5 rounded bg-slate-200" />
              <div className="mt-3 h-4 w-2/3 rounded bg-slate-200" />
            </div>
          ))}
        </div>
      ) : availableProducts.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {availableProducts.map((product) => {
            const imageUrl = getProductImage(product.images?.[0]?.url);

            return (
              <article
                key={product.id}
                className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <Link href={`/produto/${product.id}`} className="block">
                  <img
                    alt={product.name}
                    src={imageUrl}
                    className="h-72 w-full object-cover"
                  />
                </Link>

                <div className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link
                        href={`/produto/${product.id}`}
                        className="text-lg font-semibold text-slate-900 transition hover:text-indigo-600"
                      >
                        {product.name}
                      </Link>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                        {product.description}
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      {product.stock} em estoque
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xl font-semibold text-slate-900">
                      {formatCurrency(product.price)}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      disabled={addingId === product.id}
                      className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <ShoppingBagIcon className="size-4" />
                      {addingId === product.id ? "Adicionando..." : "Adicionar"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-8 rounded-[1.75rem] border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500">
          Nenhum produto foi encontrado no momento.
        </div>
      )}
    </section>
  );
}
