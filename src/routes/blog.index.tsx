import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/Layout";
import { ArticleCard } from "@/components/site/Cards";
import { articles } from "@/data/articles";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/blog/")({
  head: () => pageHead({ title: "Blog", description: "Dicas e guias práticos sobre contas do dia a dia, finanças, reformas e textos.", path: "/blog" }),
  component: () => (
    <>
      <PageHeader crumbs={[{ label: "Início", to: "/" }, { label: "Blog" }]} title="Blog" intro="Guias práticos para usar melhor as ferramentas." />
      <div className="container-site grid gap-4 pt-10 md:grid-cols-3">
        {articles.map((a) => <ArticleCard key={a.slug} article={a} />)}
      </div>
    </>
  ),
});
