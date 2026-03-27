"use client";

import { useState } from "react";
import { api } from "@/lib/api";

interface CreateAccountModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateAccountModal({
  open,
  onClose,
}: CreateAccountModalProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await api.post("/users", {
        ...form,
        profilePic: `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name)}&background=111827&color=ffffff`,
        googleId: `local:${form.email.toLowerCase()}`,
      });

      setMessage("Conta criada com sucesso.");
      setTimeout(() => {
        onClose();
        setMessage("");
      }, 1500);
    } catch (error) {
      console.error(error);
      setMessage("Erro ao criar conta, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>

        <h2 className="text-center text-2xl font-semibold text-gray-800">
          Criar conta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          Cadastro conectado ao endpoint `/users`.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Seu nome completo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">E-mail</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="voce@empresa.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Minimo de 6 caracteres"
            />
          </div>

          {message && (
            <p
              className={`text-center text-sm ${
                message.startsWith("Conta") ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-xl py-3 font-semibold text-white transition ${
              loading ? "cursor-not-allowed bg-slate-400" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Criando conta..." : "Criar conta"}
          </button>
        </form>
      </div>
    </div>
  );
}
