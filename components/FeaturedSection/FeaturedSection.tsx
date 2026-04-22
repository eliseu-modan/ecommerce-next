export default function FeaturedSection() {
  const highlights = [
    {
      title: "Entrega agil",
      description:
        "Da sacola a confirmacao do pedido, a jornada de compra ficou mais direta e confiavel.",
    },
    {
      title: "Escolha com calma",
      description:
        "Visualize detalhes do produto, ajuste quantidades e organize sua compra com mais clareza.",
    },
    {
      title: "Vitrine organizada",
      description:
        "coleções, destaques e produtos agora aparecem com linguagem de loja, nao de sistema.",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-200 sm:p-10">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">
            Experiencia de compra
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Uma pagina mais proxima do que o cliente espera ao entrar em uma loja.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            A apresentacao agora prioriza descoberta de produtos, confianca na
            compra e uma navegacao mais natural entre coleções, itens e sacola.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6"
            >
              <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
