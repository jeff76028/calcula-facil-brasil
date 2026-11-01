import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { SearchBox } from "./SearchBox";
import { categories } from "@/data/categories";

const navLinks = [
  { to: "/ferramentas", label: "Ferramentas" },
  { to: "/categorias", label: "Categorias" },
  { to: "/blog", label: "Blog" },
  { to: "/sobre", label: "Sobre" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="container-site flex h-16 items-center gap-4">
        <Logo />
        <nav className="ml-6 hidden items-center gap-1 md:flex" aria-label="Principal">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
              activeProps={{ className: "bg-primary-soft text-primary" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto hidden w-64 lg:block">
          <SearchBox />
        </div>
        <button
          type="button"
          className="ml-auto grid h-10 w-10 place-items-center rounded-full text-foreground hover:bg-muted md:hidden"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="container-site space-y-4 py-4">
            <SearchBox />
            <nav className="grid gap-1" aria-label="Menu móvel">
              {navLinks.map((l) => (
                <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 font-medium text-foreground hover:bg-muted">
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-wrap gap-2 border-t border-border pt-4">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  to="/categorias/$slug"
                  params={{ slug: c.slug }}
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
