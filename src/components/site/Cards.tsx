import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { Tool } from "@/data/tools";
import { getCategory, type Category } from "@/data/categories";
import { toolsByCategory } from "@/data/tools";
import type { Article } from "@/data/articles";
import { formatDate } from "@/data/articles";
import { categoryIcons } from "./icons";
import { cn } from "@/lib/utils";

export function ToolCard({ tool }: { tool: Tool }) {
  const cat = getCategory(tool.category)!;
  const Icon = categoryIcons[cat.slug];
  return (
    <Link
      to="/ferramentas/$slug"
      params={{ slug: tool.slug }}
      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lift"
    >
      <div className="flex items-start justify-between">
        <span className={cn("grid h-10 w-10 place-items-center rounded-xl", cat.softClass, cat.colorClass)}>
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:text-primary" aria-hidden />
      </div>
      <h3 className="mt-4 text-base font-bold text-card-foreground">{tool.name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{tool.shortDescription}</p>
      {tool.status === "em-breve" && (
        <span className="mt-auto pt-4 text-xs font-semibold uppercase tracking-wide text-accent-foreground">
          <span className="rounded-full bg-accent-soft px-2 py-0.5">Em breve</span>
        </span>
      )}
    </Link>
  );
}

export function CategoryCard({ category }: { category: Category }) {
  const Icon = categoryIcons[category.slug];
  const count = toolsByCategory(category.slug).length;
  return (
    <Link
      to="/categorias/$slug"
      params={{ slug: category.slug }}
      className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-card transition hover:border-primary/40 hover:shadow-lift"
    >
      <span className={cn("grid h-12 w-12 shrink-0 place-items-center rounded-2xl", category.softClass, category.colorClass)}>
        <Icon className="h-6 w-6" aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="block font-display text-lg font-bold text-card-foreground">{category.name}</span>
        <span className="block text-sm text-muted-foreground">
          {count} {count === 1 ? "ferramenta" : "ferramentas"}
        </span>
      </span>
    </Link>
  );
}

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: article.slug }}
      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-card transition hover:border-primary/40 hover:shadow-lift"
    >
      <time dateTime={article.publishedAt} className="text-xs font-medium text-muted-foreground">
        {formatDate(article.publishedAt)}
      </time>
      <h3 className="mt-2 text-lg font-bold leading-snug text-card-foreground group-hover:text-primary">{article.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{article.excerpt}</p>
    </Link>
  );
}
