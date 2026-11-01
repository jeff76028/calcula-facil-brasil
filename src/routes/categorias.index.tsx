import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/Layout";
import { CategoryCard } from "@/components/site/Cards";
import { categories } from "@/data/categories";
import { pageHead, breadcrumbLd } from "@/lib/seo";

export const Route = createFileRoute("/categorias/")({
  head: () =>
    pageHead({
      title: "Categorias de calculadoras",
      description: "Navegue pelas categorias: Matemática, Finanças, Casa e Construção, Cotidiano e Produtividade.",
      path: "/categorias",
      jsonLd: [breadcrumbLd([{ name: "Início", path: "/" }, { name: "Categorias", path: "/categorias" }])],
    }),
  component: () => (
    <>
      <PageHeader crumbs={[{ label: "Início", to: "/" }, { label: "Categorias" }]} title="Categorias" intro="Ferramentas organizadas por assunto." />
      <div className="container-site grid gap-4 pt-10 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <div key={c.slug} className="space-y-2">
            <CategoryCard category={c} />
            <p className="px-1 text-sm text-muted-foreground">{c.shortDescription}</p>
          </div>
        ))}
      </div>
    </>
  ),
});
