"use client";

import Link from "next/link";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  Bars3Icon,
  ShoppingBagIcon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import LoginModal from "@/components/Auth/LoginModal";
import CreateAccountModal from "@/components/Auth/CreateAccountModal";
import { AuthContext } from "@/contexts/AuthProvider";
import { getInitials } from "@/lib/format";

const mainLinks = [
  { name: "Inicio", href: "/" },
  { name: "Novidades", href: "/#produtos" },
  { name: "Colecoes", href: "/#categorias" },
  { name: "Sacola", href: "/carrinho" },
];

const userLinks = [
  { name: "Meu perfil", href: "/perfil" },
  { name: "Meus pedidos", href: "/compras" },
  { name: "Sacola", href: "/carrinho" },
];

const adminLinks = [
  { name: "Gerenciar vitrine", href: "/admin/produtos" },
  { name: "Cadastrar produto", href: "/admin/produtos/novo" },
  { name: "Organizar colecoes", href: "/admin/categorias" },
];

export default function Header() {
  const auth = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);

  const accountLinks = useMemo(() => {
    if (auth?.user?.role === "ADMIN") {
      return [...adminLinks, ...userLinks];
    }

    return userLinks;
  }, [auth?.user?.role]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node)
      ) {
        setAccountMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="bg-slate-950 px-6 py-2 text-center text-xs font-medium uppercase tracking-[0.25em] text-slate-200">
          Frete especial para pedidos selecionados
        </div>

        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-full border border-slate-200 p-2 text-slate-700 lg:hidden"
            >
              <Bars3Icon className="size-5" />
            </button>

            <Link href="/" className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-indigo-600 text-sm font-bold text-white shadow-lg shadow-indigo-200">
                AS
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                  Maison
                </p>
                <p className="text-lg font-semibold text-slate-900">Aurora Store</p>
              </div>
            </Link>
          </div>

          <nav className="hidden items-center gap-8 lg:flex">
            {mainLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/carrinho"
              className="rounded-full border border-slate-200 p-2 text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
            >
              <ShoppingBagIcon className="size-5" />
            </Link>

            {auth?.token && auth.user ? (
              <div ref={accountMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setAccountMenuOpen((open) => !open)}
                  className="flex items-center gap-3 rounded-full border border-slate-200 px-3 py-2 text-left transition hover:border-slate-300"
                >
                  <div className="flex size-9 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                    {getInitials(auth.user.name)}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-slate-900">
                      {auth.user.name}
                    </p>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      {auth.user.role}
                    </p>
                  </div>
                </button>

                {accountMenuOpen && (
                  <div className="absolute right-0 top-full z-50 mt-3 w-64 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
                    {accountLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setAccountMenuOpen(false)}
                        className="block rounded-xl px-4 py-3 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
                      >
                        {link.name}
                      </Link>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        auth.logout();
                      }}
                      className="mt-2 block w-full rounded-xl bg-rose-50 px-4 py-3 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-100"
                    >
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <button
                  type="button"
                  onClick={() => setShowLogin(true)}
                  className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  Entrar
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateAccount(true)}
                  className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                >
                  Criar conta
                </button>
              </div>
            )}

            {!auth?.token && (
              <button
                type="button"
                onClick={() => setShowLogin(true)}
                className="rounded-full border border-slate-200 p-2 text-slate-700 sm:hidden"
              >
                <UserCircleIcon className="size-5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 lg:hidden">
          <div className="ml-auto flex h-full w-full max-w-sm flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
                Navegacao
              </p>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-full border border-slate-200 p-2 text-slate-700"
              >
                <XMarkIcon className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6">
              <div className="space-y-2">
                {mainLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {auth?.token && auth.user ? (
                <div className="mt-8">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                    Minha conta
                  </p>
                  <div className="space-y-2">
                    {accountLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="block rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={auth.logout}
                    className="mt-4 w-full rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <div className="mt-8 space-y-3">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      setShowLogin(true);
                    }}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700"
                  >
                    Entrar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      setShowCreateAccount(true);
                    }}
                    className="w-full rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white"
                  >
                    Criar conta
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showCreateAccount && (
        <CreateAccountModal
          open={showCreateAccount}
          onClose={() => setShowCreateAccount(false)}
        />
      )}
    </>
  );
}
