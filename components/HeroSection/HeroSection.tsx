"use client";

import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="overflow-hidden bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-indigo-300">
            Nova temporada
          </p>
          <h1 className="mt-6 max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Peças escolhidas para transformar sua rotina com estilo.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Explore novidades, monte sua sacola e encontre itens que combinam
            com trabalho, lazer e ocasioes especiais.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/#produtos"
              className="rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
            >
              Comprar agora
            </Link>
            <Link
              href="/#categorias"
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-white/40 hover:bg-white/5"
            >
              Ver colecoes
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">
              Curadoria
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-white">
              Looks pensados para cada ocasiao
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Das escolhas basicas do dia a dia as combinacoes mais marcantes,
              nossa selecao foi montada para facilitar sua compra.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-indigo-500/25 to-cyan-400/10 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-200">
              Lancamentos
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-white">
              Modelos que renovam sua vitrine
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-200">
              Uma apresentacao mais proxima de uma loja online real, com foco
              em descoberta, confianca e desejo de compra.
            </p>
          </div>

          <div className="sm:col-span-2 rounded-[2rem] border border-white/10 bg-white p-6 text-slate-900 shadow-2xl shadow-slate-950/30">
            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
                  Frete
                </p>
                <p className="mt-2 text-3xl font-semibold">Entrega em todo o Brasil</p>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
                  Pagamento
                </p>
                <p className="mt-2 text-3xl font-semibold">Compra rapida e segura</p>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
                  Destaques
                </p>
                <p className="mt-2 text-3xl font-semibold">Selecao nova toda semana</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
