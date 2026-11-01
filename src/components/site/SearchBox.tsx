import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { searchTools } from "@/data/tools";
import { getCategory } from "@/data/categories";
import { cn } from "@/lib/utils";

export function SearchBox({ size = "md", className }: { size?: "md" | "lg"; className?: string }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const results = searchTools(q).slice(0, 6);

  return (
    <div className={cn("relative w-full", className)}>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          setOpen(false);
          navigate({ to: "/ferramentas", search: { q: q.trim() || undefined } });
        }}
      >
        <label htmlFor={`busca-${size}`} className="sr-only">
          Buscar ferramenta
        </label>
        <Search
          className={cn(
            "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground",
            size === "lg" ? "h-5 w-5" : "h-4 w-4",
          )}
          aria-hidden
        />
        <input
          id={`busca-${size}`}
          type="search"
          autoComplete="off"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Buscar calculadora… ex: porcentagem"
          className={cn(
            "w-full rounded-full border border-input bg-card text-foreground shadow-card outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/15",
            size === "lg" ? "h-14 pl-12 pr-5 text-base" : "h-10 pl-10 pr-4 text-sm",
          )}
        />
      </form>
      {open && q.trim() && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-border bg-popover shadow-lift">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted-foreground">Nenhuma ferramenta encontrada.</p>
          ) : (
            <ul>
              {results.map((t) => (
                <li key={t.slug}>
                  <Link
                    to="/ferramentas/$slug"
                    params={{ slug: t.slug }}
                    className="flex flex-col px-4 py-2.5 hover:bg-muted"
                    onClick={() => setOpen(false)}
                  >
                    <span className="text-sm font-semibold text-foreground">{t.name}</span>
                    <span className="text-xs text-muted-foreground">{getCategory(t.category)?.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
