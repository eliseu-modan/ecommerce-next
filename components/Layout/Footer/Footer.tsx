import Link from "next/link";
import { navigation } from "../navigation";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">
            Aurora Store
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900">
            Moda, conforto e escolhas para o dia a dia.
          </h2>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Uma vitrine mais elegante, com navegacao clara e fluxo de compra
            pronto para acompanhar a evolucao da sua loja.
          </p>
        </div>

        {Object.entries(navigation).map(([section, links]) => (
          <div key={section}>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              {section}
            </h3>
            <ul className="mt-4 space-y-3">
              {links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 transition hover:text-slate-900"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200 px-6 py-5 text-center text-sm text-slate-500">
        © 2026 Aurora Store. Todos os direitos reservados.
      </div>
    </footer>
  );
}
