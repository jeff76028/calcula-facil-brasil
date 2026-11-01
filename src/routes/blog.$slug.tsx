import { createFileRoute, notFound } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/site/Layout";
import { ToolCard } from "@/components/site/Cards";
import { getArticle, formatDate } from "@/data/articles";
import { getTool } from "@/data/tools";
import { pageHead, breadcrumbLd } from "@/lib/seo";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const article = getArticle(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Artigo indisponível | Calcula Fácil" }, { name: "robots", content: "noindex" }] };
    const { article } = loaderData;
    const path = `/blog/${params.slug}`;
    return pageHead({
      title: article.title,
      description: article.excerpt,
      path,
      type: "article",
      jsonLd: [
        breadcrumbLd([{ name: "Início", path: "/" }, { name: "Blog", path: "/blog" }, { name: article.title, path }]),
        { "@type": "Article", headline: article.title, description: article.excerpt, datePublished: article.publishedAt, inLanguage: "pt-BR" },
      ],
    });
  },
  component: ArticlePage,
});

function ArticlePage() {
  const { article } = Route.useLoaderData();
  const related = article.relatedTools.map(getTool).filter((t) => !!t);
  return (
    <div className="container-site max-w-3xl py-10">
      <Breadcrumbs items={[{ label: "Início", to: "/" }, { label: "Blog", to: "/blog" }, { label: article.title }]} />
      <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">{article.title}</h1>
      <time dateTime={article.publishedAt} className="mt-2 block text-sm text-muted-foreground">{formatDate(article.publishedAt)}</time>
      <div className="prose-site mt-8">
        {article.body.map((b, i) => (b.startsWith("## ") ? <h2 key={i}>{b.slice(3)}</h2> : <p key={i}>{b}</p>))}
      </div>
      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-extrabold">Ferramentas relacionadas</h2>
          <div className="grid gap-4 sm:grid-cols-2">{related.map((t) => <ToolCard key={t.slug} tool={t} />)}</div>
        </section>
      )}
    </div>
  );
}
