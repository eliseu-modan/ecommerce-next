"use client";

import Link from "next/link";
import { useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeftIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import { AuthContext } from "@/contexts/AuthProvider";
import { api } from "@/lib/api";
import { addProductToCart } from "@/lib/cart";
import { formatCurrency, getProductImage } from "@/lib/format";
import type { Product } from "@/lib/types";

export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>();
  const auth = useContext(AuthContext);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await api.get("/product/getAll");
        setProducts(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Erro ao carregar produto:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const product = useMemo(
    () => products.find((item) => item.id === params.id),
    [params.id, products],
  );

  const handleAddToCart = async () => {
    if (!product) return;

    addProductToCart(product, quantity, auth?.user?.id);

    try {
      setAdding(true);
      setMessage("");
      if (auth?.token) {
        await api.post("/shopping-cart/add-item-to-cart", {
          productId: product.id,
          quantity,
        });
      }

      setMessage(
        auth?.token
          ? "Produto adicionado ao seu carrinho."
          : "Produto salvo no carrinho local. Faça login para continuar a compra.",
      );
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
      setMessage("Produto salvo localmente. A sincronização com a API falhou neste momento.");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="h-10 w-40 animate-pulse rounded bg-slate-200" />
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="h-[520px] animate-pulse rounded-[2rem] bg-slate-200" />
          <div className="space-y-4">
            <div className="h-10 animate-pulse rounded bg-slate-200" />
            <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />
            <div className="h-40 animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">
            Produto nao encontrado
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            Nao foi possivel localizar esse item no retorno atual do backend.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white"
          >
            Voltar ao catálogo
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = getProductImage(product.images?.[0]?.url);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-950"
      >
        <ArrowLeftIcon className="size-4" />
        Voltar para o catálogo
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_0.9fr]">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <img src={imageUrl} alt={product.name} className="h-full w-full object-cover" />
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">
            Destaque da coleção
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
            {product.name}
          </h1>
          <p className="mt-4 text-3xl font-semibold text-slate-900">
            {formatCurrency(product.price)}
          </p>

          <div className="mt-6 rounded-2xl bg-slate-50 p-5">
            <p className="text-sm leading-7 text-slate-600">{product.description}</p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                Estoque
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {product.stock}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-4">
              <label className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                Quantidade
              </label>
              <input
                type="number"
                min={1}
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {message && (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {message}
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={adding}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-70"
            >
              <ShoppingBagIcon className="size-5" />
              {adding ? "Adicionando..." : "Adicionar à sacola"}
            </button>
            <Link
              href="/carrinho"
              className="rounded-full border border-slate-200 px-6 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Ver carrinho
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
