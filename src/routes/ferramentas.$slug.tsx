import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Lock, Wrench } from "lucide-react";
import { Breadcrumbs, AdSlot, SectionTitle } from "@/components/site/Layout";
import { ToolCard } from "@/components/site/Cards";
import { categoryIcons } from "@/components/site/icons";
import { getTool, toolsByCategory } from "@/data/tools";
import { getCategory } from "@/data/categories";
import { pageHead, breadcrumbLd } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { calculators } from "@/components/calculators/registry";

export const Route = createFileRoute("/ferramentas/$slug")({
  loader: ({ params }) => {
    const tool = getTool(params.slug);
    if (!tool) throw notFound();
    return { tool, category: getCategory(tool.category)! };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Ferramenta não encontrada | Conta Gênio" }, { name: "robots", content: "noindex" }] };
    const { tool, category } = loaderData;
    const path = `/ferramentas/${params.slug}`;
    const c = calculators[tool.slug];
    return pageHead({
      title: c?.seoTitle ?? `${tool.name} online grátis`,
      description: c?.seoDescription ?? `${tool.shortDescription} Ferramenta gratuita, sem cadastro, com cálculo feito no navegador.`,
      path,
      // Template pages stay out of the index until the calculator is implemented.
      noindex: tool.status !== "disponivel",
      jsonLd: [
        breadcrumbLd([
          { name: "Início", path: "/" },
          { name: category.name, path: `/categorias/${category.slug}` },
          { name: tool.name, path },
        ]),
        {
          "@type": "WebApplication",
          name: tool.name,
          description: tool.shortDescription,
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "Any",
          inLanguage: "pt-BR",
          isAccessibleForFree: true,
          offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
        },
      ],
    });
  },
  component: ToolPage,
  notFoundComponent: () => (
    <div className="container-site py-20 text-center">
      <h1 className="text-3xl font-extrabold">Ferramenta não encontrada</h1>
      <Link to="/ferramentas" className="mt-4 inline-block font-semibold text-primary hover:underline">Ver todas as ferramentas</Link>
    </div>
  ),
});

function ToolPage() {
  const { tool, category } = Route.useLoaderData();
  const Icon = categoryIcons[category.slug];
  const related = toolsByCategory(category.slug).filter((t) => t.slug !== tool.slug);
  const calc = calculators[tool.slug];

  return (
    <div className="container-site py-8 sm:py-10">
      <Breadcrumbs
        items={[
          { label: "Início", to: "/" },
          { label: category.name, to: "/categorias/$slug", params: { slug: category.slug } },
          { label: tool.name },
        ]}
      />

      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <article>
          <header className="flex items-start gap-4">
            <span className={cn("grid h-14 w-14 shrink-0 place-items-center rounded-2xl", category.softClass, category.colorClass)}>
              <Icon className="h-7 w-7" aria-hidden />
            </span>
            <div>
              <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">{tool.name}</h1>
              <p className="mt-2 text-lg text-muted-foreground">{tool.shortDescription}</p>
            </div>
          </header>

          {/* Calculator area — each tool's widget plugs in here in the next phase */}
          <section aria-labelledby="calc-title" className="mt-8 rounded-3xl border border-border bg-card p-5 shadow-card sm:p-8">
            <h2 id="calc-title" className="sr-only">Calculadora</h2>
            {calc ? (
              <calc.Component />
            ) : (
              <div className="flex flex-col items-center py-8 text-center">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-accent-soft text-accent-foreground">
                  <Wrench className="h-6 w-6" aria-hidden />
                </span>
                <p className="mt-4 font-display text-xl font-bold text-card-foreground">Esta ferramenta está em construção</p>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  Em breve você poderá usar a {tool.name.toLowerCase()} gratuitamente aqui. Enquanto isso, explore outras ferramentas.
                </p>
              </div>
            )}
            <p className="mt-4 flex items-center justify-center gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
              <Lock className="h-3.5 w-3.5" aria-hidden /> Os valores digitados não são enviados nem armazenados.
            </p>
          </section>

          <AdSlot slot="conteudo" />

          <section className="prose-site mt-10">
            <h2>Sobre a {tool.name.toLowerCase()}</h2>
            <p>
              {tool.shortDescription} A ferramenta faz parte da categoria{" "}
              <Link to="/categorias/$slug" params={{ slug: category.slug }}>{category.name}</Link> do Conta Gênio.
            </p>
            {calc?.intro && <p>{calc.intro}</p>}
            {calc && (
              <>
                <h2>Como usar</h2>
                <ol>{calc.howTo.map((s) => <li key={s}>{s}</li>)}</ol>
                <h2>Como o cálculo é feito</h2>
                <ul>{calc.formula.map((s) => <li key={s}>{s}</li>)}</ul>
                <h2>Exemplo de uso</h2>
                <p>{calc.example}</p>
                {calc.extra}
                <h2>Perguntas frequentes</h2>
                {calc.faq.map((f) => (
                  <div key={f.q}>
                    <h3>{f.q}</h3>
                    <p>{f.a}</p>
                  </div>
                ))}
              </>
            )}
          </section>

        </article>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h2 className="font-display text-base font-bold">Mais em {category.name}</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {related.map((t) => (
                <li key={t.slug}>
                  <Link to="/ferramentas/$slug" params={{ slug: t.slug }} className="text-muted-foreground hover:text-primary hover:underline">
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <AdSlot slot="lateral" className="sticky top-24" />
        </aside>
      </div>

      {related.length > 0 && (
        <section className="pt-14">
          <SectionTitle title="Ferramentas relacionadas" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.slice(0, 4).map((t) => <ToolCard key={t.slug} tool={t} />)}
          </div>
        </section>
      )}
    </div>
  );
}
