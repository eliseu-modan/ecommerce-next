"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/contexts/AuthProvider";
import { api } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Order } from "@/lib/types";

export default function OrdersPage() {
  const auth = useContext(AuthContext);
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth?.isReady && !auth.token) {
      router.push("/login");
    }
  }, [auth?.isReady, auth?.token, router]);

  useEffect(() => {
    if (!auth?.token) return;

    const loadOrders = async () => {
      try {
        const response = await api.get("/order/all");
        setOrders(response.data.orders || []);
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [auth?.token]);

  const totals = useMemo(
    () => ({
      orders: orders.length,
      amount: orders.reduce(
        (sum, order) => sum + Number.parseFloat(String(order.totalAmount || 0)),
        0,
      ),
    }),
    [orders],
  );

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

  if (!auth?.token) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">
            Pedidos
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900">
            Historico de compras
          </h1>
          <div className="mt-8 space-y-4">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                Total de pedidos
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {totals.orders}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                Valor acumulado
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {formatCurrency(totals.amount)}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {orders.length > 0 ? (
            orders.map((order) => (
              <article
                key={order.id}
                className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                      Pedido
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                      {order.id}
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                      Criado em {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      {order.status}
                    </span>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-sm font-semibold text-slate-900">Itens</p>
                    <ul className="mt-4 space-y-3">
                      {order.items?.map((item, index) => (
                        <li key={`${item.productId}-${index}`} className="text-sm text-slate-600">
                          Produto {item.productId.slice(0, 8)} | {item.quantity} x{" "}
                          {formatCurrency(item.unitPrice)} = {formatCurrency(item.subtotal)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-sm font-semibold text-slate-900">Pagamento</p>
                    {order.payment ? (
                      <div className="mt-4 space-y-2 text-sm text-slate-600">
                        <p>Metodo: {order.payment.method}</p>
                        <p>Status: {order.payment.status}</p>
                        <p>Valor pago: {formatCurrency(order.payment.amountPaid)}</p>
                        <p>Data: {formatDate(order.payment.paidAt)}</p>
                      </div>
                    ) : (
                      <p className="mt-4 text-sm text-slate-500">
                        Pagamento ainda nao vinculado a este pedido.
                      </p>
                    )}
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center">
              <h2 className="text-2xl font-semibold text-slate-900">
                Nenhum pedido encontrado
              </h2>
              <p className="mt-3 text-sm text-slate-500">
                Assim que você concluir uma compra, ela aparecerá aqui.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
