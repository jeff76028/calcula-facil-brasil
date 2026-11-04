import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionTitle } from "@/components/site/Layout";
import { ToolCard } from "@/components/site/Cards";
import { SearchBox } from "@/components/site/SearchBox";
import { categories } from "@/data/categories";
import { searchTools, toolsByCategory } from "@/data/tools";
import { pageHead, breadcrumbLd } from "@/lib/seo";

export const Route = createFileRoute("/ferramentas/")({
  validateSearch: (s: Record<string, unknown>): { q?: string | undefined } => ({
    q: typeof s["q"] === "string" && s["q"] ? (s["q"] as string) : undefined,
  }),
  head: () =>
    pageHead({
      title: "Todas as ferramentas e calculadoras online",
      description: "Lista completa de calculadoras e ferramentas gratuitas do Conta Gênio, organizadas por categoria.",
      path: "/ferramentas",
      jsonLd: [breadcrumbLd([{ name: "Início", path: "/" }, { name: "Ferramentas", path: "/ferramentas" }])],
    }),
  component: AllTools,
});

function AllTools() {
  const { q } = Route.useSearch();
  const results = q ? searchTools(q) : null;
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Início", to: "/" }, { label: "Ferramentas" }]}
        title="Todas as ferramentas"
        intro="Escolha uma calculadora ou busque pelo que precisa."
      >
        <SearchBox size="lg" className="mt-6 max-w-xl" />
      </PageHeader>
      <div className="container-site">
        {results ? (
          <section className="pt-10">
            <SectionTitle title={`Resultados para “${q}”`} />
            {results.length ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((t) => <ToolCard key={t.slug} tool={t} />)}
              </div>
            ) : (
              <p className="text-muted-foreground">Nenhuma ferramenta encontrada. Veja a lista completa abaixo.</p>
            )}
          </section>
        ) : null}
        {categories.map((c) => (
          <section key={c.slug} className="pt-10">
            <SectionTitle title={c.name} />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {toolsByCategory(c.slug).map((t) => <ToolCard key={t.slug} tool={t} />)}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
