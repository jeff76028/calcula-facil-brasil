import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  to?: string;
  params?: Record<string, string>;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Navegação estrutural" className="text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5" aria-hidden />}
            {it.to ? (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              <Link to={it.to as any} params={it.params as any} className="hover:text-foreground hover:underline">
                {it.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-foreground">{it.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHeader({ crumbs, title, intro, children }: { crumbs?: Crumb[]; title: string; intro?: string; children?: ReactNode }) {
  return (
    <section className="grid-paper border-b border-border">
      <div className="container-site py-10 sm:py-14">
        {crumbs && <Breadcrumbs items={crumbs} />}
        <h1 className="mt-4 text-3xl font-extrabold text-foreground sm:text-4xl">{title}</h1>
        {intro && <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{intro}</p>}
        {children}
      </div>
    </section>
  );
}

export function SectionTitle({ title, action, className }: { title: string; action?: ReactNode; className?: string }) {
  return (
    <div className={cn("mb-5 flex items-end justify-between gap-4", className)}>
      <h2 className="text-2xl font-extrabold text-foreground">{title}</h2>
      {action}
    </div>
  );
}

/**
 * Reserved space for a future Google AdSense unit.
 * Renders nothing visible until AdSense is configured (no fake ads, no click prompts).
 * min-height reserves space to avoid layout shift once ads are enabled.
 */
export const ADS_ENABLED = false;

export function AdSlot({ slot, className }: { slot: "topo" | "conteudo" | "lateral" | "rodape"; className?: string }) {
  if (!ADS_ENABLED) return null;
  return (
    <aside
      aria-label="Publicidade"
      data-ad-slot={slot}
      className={cn("my-8 flex min-h-[100px] flex-col items-center justify-center", className)}
    >
      <span className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">Publicidade</span>
      {/* AdSense <ins class="adsbygoogle"> goes here */}
    </aside>
  );
}
