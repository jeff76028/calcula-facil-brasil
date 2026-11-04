import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { PageHeader, AdSlot } from "@/components/site/Layout";
import { ToolCard } from "@/components/site/Cards";
import { categories, getCategory } from "@/data/categories";
import { toolsByCategory } from "@/data/tools";
import { pageHead, breadcrumbLd } from "@/lib/seo";

export const Route = createFileRoute("/categorias/$slug")({
  loader: ({ params }) => {
    const category = getCategory(params.slug);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Categoria não encontrada | Conta Gênio" }, { name: "robots", content: "noindex" }] };
    const { category } = loaderData;
    const path = `/categorias/${params.slug}`;
    const items = toolsByCategory(category.slug);
    return pageHead({
      title: `Calculadoras de ${category.name}`,
      description: category.description,
      path,
      jsonLd: [
        breadcrumbLd([
          { name: "Início", path: "/" },
          { name: "Categorias", path: "/categorias" },
          { name: category.name, path },
        ]),
        {
          "@type": "CollectionPage",
          name: `Calculadoras de ${category.name}`,
          description: category.description,
          hasPart: items.map((t) => ({ "@type": "WebApplication", name: t.name, url: `/ferramentas/${t.slug}` })),
        },
      ],
    });
  },
  component: CategoryPage,
  notFoundComponent: () => (
    <div className="container-site py-20 text-center">
      <h1 className="text-3xl font-extrabold">Categoria não encontrada</h1>
      <Link to="/categorias" className="mt-4 inline-block font-semibold text-primary hover:underline">Ver categorias</Link>
    </div>
  ),
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const items = toolsByCategory(category.slug);
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Início", to: "/" }, { label: "Categorias", to: "/categorias" }, { label: category.name }]}
        title={`Calculadoras de ${category.name}`}
        intro={category.description}
      />
      <div className="container-site pt-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => <ToolCard key={t.slug} tool={t} />)}
        </div>
        <AdSlot slot="rodape" />
        <nav aria-label="Outras categorias" className="mt-12">
          <h2 className="font-display text-lg font-bold">Outras categorias</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {categories.filter((c) => c.slug !== category.slug).map((c) => (
              <Link key={c.slug} to="/categorias/$slug" params={{ slug: c.slug }} className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium hover:border-primary hover:text-primary">
                {c.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}
