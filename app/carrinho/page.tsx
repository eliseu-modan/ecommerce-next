"use client";

import Link from "next/link";
import { useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/contexts/AuthProvider";
import { api } from "@/lib/api";
import {
  clearCart,
  readCart,
  removeProductFromCart,
  updateCartProductQuantity,
} from "@/lib/cart";
import {
  formatCurrency,
  getProductImage,
  toAddressLabel,
} from "@/lib/format";
import type { Address, Cart, ShippingQuote } from "@/lib/types";

const STORE_ORIGIN = "Sao Paulo, SP, Brasil";

export default function CartPage() {
  const auth = useContext(AuthContext);
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [loading, setLoading] = useState(true);
  const [shipping, setShipping] = useState<ShippingQuote | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadCart = async () => {
    const localCart = readCart(auth?.user?.id);

    try {
      if (auth?.token) {
        const [cartResponse, addressesResponse] = await Promise.all([
          api.get("/shopping-cart/get-cart"),
          api.get("/users/addresses"),
        ]);

        const nextAddresses = Array.isArray(addressesResponse.data)
          ? addressesResponse.data
          : [];

        setAddresses(nextAddresses);

        if (!selectedAddressId && nextAddresses.length > 0) {
          setSelectedAddressId(nextAddresses[0].id);
        }

        // Mantemos o carrinho local como fonte confiável enquanto o endpoint
        // do backend ainda não retorna o carrinho do usuário autenticado corretamente.
        setCart(localCart.items.length ? localCart : cartResponse.data.cart || localCart);
      } else {
        setCart(localCart);
        setAddresses([]);
      }
    } catch (error) {
      console.error("Erro ao carregar carrinho:", error);
      setCart(localCart);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, [auth?.token, auth?.user?.id]);

  const totals = useMemo(() => {
    const subtotal =
      cart?.items?.reduce((sum, item) => {
        return sum + Number.parseFloat(String(item.product.price)) * item.quantity;
      }, 0) || 0;

    const shippingValue = Number.parseFloat(shipping?.freightCost || "0");

    return {
      subtotal,
      shipping: shippingValue,
      total: subtotal + shippingValue,
    };
  }, [cart?.items, shipping?.freightCost]);

  const selectedAddress = useMemo(
    () => addresses.find((address) => address.id === selectedAddressId),
    [addresses, selectedAddressId],
  );

  const updateQuantity = async (
    cartId: string,
    productId: string,
    quantity: number,
  ) => {
    try {
      setProcessingId(productId);
      updateCartProductQuantity(productId, quantity, auth?.user?.id);
      if (auth?.token) {
        await api.patch("/shopping-cart/update-item-quantity", {
          cartId,
          productId,
          quantity,
        });
      }
      await loadCart();
    } catch (error) {
      console.error("Erro ao atualizar quantidade:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const removeItem = async (cartId: string, productId: string) => {
    try {
      setProcessingId(productId);
      removeProductFromCart(productId, auth?.user?.id);
      if (auth?.token) {
        await api.delete(`/shopping-cart/remove-item/${cartId}/${productId}`);
      }
      await loadCart();
    } catch (error) {
      console.error("Erro ao remover item:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const calculateShipping = async () => {
    if (!selectedAddress) {
      setMessage("Selecione um endereco para calcular o frete.");
      return;
    }

    try {
      setMessage("");
      const response = await api.post("/shopping-cart/calculate-shipping", {
        origins: [STORE_ORIGIN],
        destinations: [toAddressLabel(selectedAddress)],
      });
      setShipping(response.data.distanceData);
    } catch (error) {
      console.error("Erro ao calcular frete:", error);
      setMessage("Nao foi possivel calcular o frete com os dados atuais.");
    }
  };

  const handleCheckout = async () => {
    if (!cart?.items?.length) {
      setMessage("Seu carrinho esta vazio.");
      return;
    }

    try {
      setCheckoutLoading(true);
      setMessage("");

      if (!auth?.token) {
        router.push("/login");
        return;
      }

      await api.post("/order/create", {
        totalAmount: totals.total.toFixed(2),
        items: cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: Number(item.product.price),
          subtotal: Number(item.product.price) * item.quantity,
        })),
        payment: [
          {
            method: "Credit Card",
            status: "pending",
            amountPaid: totals.total,
            paidAt: new Date().toISOString(),
          },
        ],
      });

      setMessage("Pedido criado com sucesso.");
      clearCart(auth?.user?.id);
      router.push("/compras");
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      setMessage("Nao foi possivel concluir o pedido.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (!auth?.isReady || loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="animate-pulse rounded-[2rem] bg-white p-8 shadow-sm">
          <div className="h-10 w-52 rounded bg-slate-200" />
          <div className="mt-6 h-24 rounded bg-slate-200" />
        </div>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">
                Sua sacola
              </p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900">
                Tudo o que você escolheu para levar
              </h1>
            </div>
            <Link
              href="/"
              className="text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
            >
              Continuar comprando
            </Link>
          </div>

          <div className="mt-8 space-y-4">
            {cart?.items?.length ? (
              cart.items.map((item) => (
                <article
                  key={item.id}
                  className="grid gap-4 rounded-[1.75rem] border border-slate-200 p-4 sm:grid-cols-[120px_1fr]"
                >
                  <img
                    src={getProductImage(item.product.images?.[0]?.url)}
                    alt={item.product.name}
                    className="h-32 w-full rounded-[1.25rem] object-cover"
                  />
                  <div className="flex flex-col justify-between gap-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-slate-900">
                          {item.product.name}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                          {item.product.description}
                        </p>
                      </div>
                      <p className="text-lg font-semibold text-slate-900">
                        {formatCurrency(Number(item.product.price) * item.quantity)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.cartId, item.productId, Number(e.target.value))
                        }
                        className="w-24 rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeItem(item.cartId, item.productId)}
                        disabled={processingId === item.productId}
                        className="rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:opacity-70"
                      >
                        {processingId === item.productId ? "Processando..." : "Remover"}
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[1.75rem] border border-dashed border-slate-300 p-8 text-center">
                <h2 className="text-2xl font-semibold text-slate-900">
                  Seu carrinho esta vazio
                </h2>
                <p className="mt-3 text-sm text-slate-500">
                  Adicione produtos na home para iniciar o fluxo de compra.
                </p>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Resumo do pedido</h2>
            <dl className="mt-6 space-y-4 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <dt>Subtotal</dt>
                <dd className="font-medium text-slate-900">
                  {formatCurrency(totals.subtotal)}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Frete</dt>
                <dd className="font-medium text-slate-900">
                  {formatCurrency(totals.shipping)}
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                <dt className="font-semibold text-slate-900">Total</dt>
                <dd className="text-lg font-semibold text-slate-900">
                  {formatCurrency(totals.total)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">
              Entrega e finalização
            </h2>

            <div className="mt-6">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Endereço de entrega
              </label>
              <select
                value={selectedAddressId}
                onChange={(e) => setSelectedAddressId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={!auth?.token}
              >
                <option value="">
                  {auth?.token ? "Selecione um endereço" : "Entre para escolher um endereço"}
                </option>
                {addresses.map((address) => (
                  <option key={address.id} value={address.id}>
                    {address.type} - {address.street}, {address.number}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={calculateShipping}
              disabled={!auth?.token}
              className="mt-4 rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Calcular frete
            </button>

            {shipping && (
              <div className="mt-6 rounded-2xl bg-slate-50 p-5 text-sm text-slate-600">
                <p>Distancia: {shipping.distance?.text}</p>
                <p>Duracao estimada: {shipping.duration?.text}</p>
                <p className="mt-2 font-medium text-slate-900">
                  Frete: {formatCurrency(shipping.freightCost || 0)}
                </p>
              </div>
            )}

            {message && (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                {message}
              </div>
            )}

            <button
              type="button"
              onClick={handleCheckout}
              disabled={checkoutLoading || !cart?.items?.length}
              className="mt-6 w-full rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {checkoutLoading ? "Finalizando..." : auth?.token ? "Finalizar compra" : "Entrar para finalizar"}
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}
