"use client";

import { useContext, useState } from "react";
import { AuthContext } from "@/contexts/AuthProvider";
import { api } from "@/lib/api";

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("AuthContext must be used within AuthProvider");
  }

  const { login } = auth;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", { email, password });
      const { access_token, user } = response.data;
      login(access_token, user);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Usuario ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google?prompt=select_account&max_age=0&authuser=0&access_type=offline`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-md">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>

        <h2 className="mb-2 text-center text-2xl font-bold text-gray-800">
          Entrar na sua conta
        </h2>
        <p className="mb-6 text-center text-sm text-gray-500">
          Acesso com JWT e integração com Google.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Digite seu e-mail"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Digite sua senha"
              required
            />
          </div>

          {error && <p className="text-center text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-70"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 py-3 transition hover:bg-gray-100"
          >
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google"
              className="h-5 w-5"
            />
            <span className="font-medium text-gray-700">Entrar com Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}
