"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/contexts/AuthProvider";
import { api } from "@/lib/api";
import { formatDate, getInitials, toAddressLabel } from "@/lib/format";
import type { Address, AuthUser } from "@/lib/types";

const initialAddress = {
  type: "DELIVERY",
  street: "",
  number: "",
  neighborhood: "",
  city: "",
  state: "",
  zipCode: "",
  country: "Brasil",
  complement: "",
};

export default function ProfilePage() {
  const auth = useContext(AuthContext);
  const router = useRouter();
  const [profile, setProfile] = useState<AuthUser | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingAddress, setSavingAddress] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState(initialAddress);

  useEffect(() => {
    if (auth?.isReady && !auth.token) {
      router.push("/login");
    }
  }, [auth?.isReady, auth?.token, router]);

  useEffect(() => {
    if (!auth?.token) return;

    const loadProfile = async () => {
      try {
        const [profileResponse, addressesResponse] = await Promise.all([
          api.get("/users/user-profile"),
          api.get("/users/addresses"),
        ]);

        setProfile(profileResponse.data);
        setAddresses(Array.isArray(addressesResponse.data) ? addressesResponse.data : []);
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [auth?.token]);

  const primaryAddress = useMemo(
    () => addresses.find((address) => address.type === "DELIVERY") || addresses[0],
    [addresses],
  );

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAddress(true);
    setMessage("");

    try {
      const response = await api.post("/users/add-address", form);
      setAddresses((current) => [...current, response.data]);
      setForm(initialAddress);
      setMessage("Endereco cadastrado com sucesso.");
    } catch (error) {
      console.error("Erro ao adicionar endereco:", error);
      setMessage("Nao foi possivel salvar o endereco.");
    } finally {
      setSavingAddress(false);
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

  if (!auth?.token) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">
            Perfil
          </p>
          <div className="mt-6 flex items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-full bg-slate-900 text-lg font-semibold text-white">
              {getInitials(profile?.name || auth.user?.name)}
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">
                {profile?.name || auth.user?.name}
              </h1>
              <p className="text-sm text-slate-500">{profile?.email || auth.user?.email}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                Papel
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {profile?.role || auth.user?.role}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                Google vinculado
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {profile?.googleId ? "Sim" : "Nao"}
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              Endereco principal
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {primaryAddress ? toAddressLabel(primaryAddress) : "Nenhum endereco cadastrado."}
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">
                  Enderecos
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-900">
                  Enderecos cadastrados
                </h2>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                {addresses.length} itens
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {addresses.length > 0 ? (
                addresses.map((address) => (
                  <article
                    key={address.id}
                    className="rounded-2xl border border-slate-200 p-5"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                        {address.type}
                      </span>
                      <span className="text-xs text-slate-400">
                        {formatDate(address.createdAt)}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {toAddressLabel(address)}
                    </p>
                  </article>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
                  Ainda nao ha enderecos associados a esta conta.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">
              Novo endereco
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">
              Adicionar endereco
            </h2>

            <form onSubmit={handleAddressSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Tipo</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((current) => ({ ...current, type: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="DELIVERY">Entrega</option>
                  <option value="BILLING">Cobranca</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">CEP</label>
                <input
                  value={form.zipCode}
                  onChange={(e) => setForm((current) => ({ ...current, zipCode: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Rua</label>
                <input
                  value={form.street}
                  onChange={(e) => setForm((current) => ({ ...current, street: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Numero</label>
                <input
                  value={form.number}
                  onChange={(e) => setForm((current) => ({ ...current, number: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Complemento</label>
                <input
                  value={form.complement}
                  onChange={(e) => setForm((current) => ({ ...current, complement: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Bairro</label>
                <input
                  value={form.neighborhood}
                  onChange={(e) => setForm((current) => ({ ...current, neighborhood: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Cidade</label>
                <input
                  value={form.city}
                  onChange={(e) => setForm((current) => ({ ...current, city: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Estado</label>
                <input
                  value={form.state}
                  onChange={(e) => setForm((current) => ({ ...current, state: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Pais</label>
                <input
                  value={form.country}
                  onChange={(e) => setForm((current) => ({ ...current, country: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {message && (
                <div className="sm:col-span-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  {message}
                </div>
              )}

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={savingAddress}
                  className="rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-70"
                >
                  {savingAddress ? "Salvando..." : "Salvar endereco"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
