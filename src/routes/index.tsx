import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Zap, UserX } from "lucide-react";
import { SearchBox } from "@/components/site/SearchBox";
import { ToolCard, CategoryCard, ArticleCard } from "@/components/site/Cards";
import { SectionTitle, AdSlot } from "@/components/site/Layout";
import { categories } from "@/data/categories";
import { popularTools, recentTools, tools } from "@/data/tools";
import { articles } from "@/data/articles";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead({
      title: "Calcula Fácil — Calculadoras e ferramentas online grátis",
      description:
        "Calculadoras gratuitas de porcentagem, juros, área, datas, texto e muito mais. Sem cadastro, rápidas e com cálculos feitos no seu navegador.",
      path: "/",
    }),
  component: Index,
});

function Index() {
  return (
    <>
      <section className="grid-paper relative overflow-hidden border-b border-border">
        <div className="container-site py-14 sm:py-20">
          <p className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-foreground">
            {tools.length} ferramentas gratuitas · sem cadastro
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.05] text-foreground sm:text-6xl">
            Contas do dia a dia, <span className="text-primary">resolvidas em segundos.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            Calculadoras e ferramentas online para matemática, finanças, casa, rotina e textos.
          </p>
          <SearchBox size="lg" className="mt-8 max-w-xl" />
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Zap className="h-4 w-4 text-primary" aria-hidden /> Resultado instantâneo</li>
            <li className="flex items-center gap-2"><UserX className="h-4 w-4 text-primary" aria-hidden /> Sem cadastro</li>
            <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" aria-hidden /> Dados não armazenados</li>
          </ul>
        </div>
      </section>

      <div className="container-site">
        <section className="pt-12">
          <SectionTitle
            title="Calculadoras populares"
            action={<Link to="/ferramentas" className="text-sm font-semibold text-primary hover:underline">Ver todas</Link>}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {popularTools().slice(0, 8).map((t) => <ToolCard key={t.slug} tool={t} />)}
          </div>
        </section>

        <AdSlot slot="conteudo" />

        <section className="pt-12">
          <SectionTitle title="Categorias" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => <CategoryCard key={c.slug} category={c} />)}
          </div>
        </section>

        <section className="pt-12">
          <SectionTitle title="Ferramentas recentes" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentTools(6).map((t) => <ToolCard key={t.slug} tool={t} />)}
          </div>
        </section>

        <section className="pt-12">
          <SectionTitle
            title="Artigos"
            action={<Link to="/blog" className="text-sm font-semibold text-primary hover:underline">Ver blog</Link>}
          />
          <div className="grid gap-4 md:grid-cols-3">
            {articles.slice(0, 3).map((a) => <ArticleCard key={a.slug} article={a} />)}
          </div>
        </section>
      </div>
    </>
  );
}
