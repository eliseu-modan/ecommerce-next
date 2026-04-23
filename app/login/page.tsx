"use client";

import Link from "next/link";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/contexts/AuthProvider";
import { api } from "@/lib/api";

export default function LoginPage() {
  const auth = useContext(AuthContext);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!auth) {
    throw new Error("AuthContext must be used within AuthProvider");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", { email, password });
      auth.login(response.data.access_token, response.data.user);
      router.push("/");
    } catch (err) {
      console.error(err);
      setError("Nao foi possivel autenticar com essas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google?prompt=select_account&max_age=0&authuser=0&access_type=offline`;
  };

  return (
    <section className="mx-auto grid min-h-[calc(100vh-200px)] max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-2">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">
          Acesso
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
          Entre para acessar carrinho, pedidos e perfil.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
          Esta tela conversa com os endpoints de autenticacao e foi pensada para
          servir como entrada principal dos fluxos protegidos da loja.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-white"
        >
          Voltar para a home
        </Link>
      </div>


      

      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Entrar</h2>
        <p className="mt-2 text-sm text-slate-500">
          Login por e-mail e senha ou autenticacao via Google.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="voce@empresa.com"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Sua senha"
              required
            />
          </div>

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            className="h-5 w-5"
          />
          Continuar com Google
        </button>
      </div>
    </section>
  );
}
