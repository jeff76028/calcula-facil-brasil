import { Link } from "@tanstack/react-router";
import { categories } from "@/data/categories";
import { popularTools } from "@/data/tools";

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-ink text-ink-foreground">
      <div className="container-site grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-xl font-extrabold">
            Conta<span className="text-accent">Gênio</span>
          </p>
          <p className="mt-3 text-sm opacity-75">
            Calculadoras e ferramentas gratuitas, sem cadastro. Os cálculos acontecem no seu navegador.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider opacity-60">Categorias</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link to="/categorias/$slug" params={{ slug: c.slug }} className="opacity-85 hover:opacity-100 hover:underline">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider opacity-60">Populares</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {popularTools().slice(0, 5).map((t) => (
              <li key={t.slug}>
                <Link to="/ferramentas/$slug" params={{ slug: t.slug }} className="opacity-85 hover:opacity-100 hover:underline">
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider opacity-60">Institucional</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/sobre" className="opacity-85 hover:underline">Sobre</Link></li>
            <li><Link to="/contato" className="opacity-85 hover:underline">Contato</Link></li>
            <li><Link to="/blog" className="opacity-85 hover:underline">Blog</Link></li>
            <li><Link to="/politica-de-privacidade" className="opacity-85 hover:underline">Política de Privacidade</Link></li>
            <li><Link to="/politica-de-cookies" className="opacity-85 hover:underline">Política de Cookies</Link></li>
            <li><Link to="/termos-de-uso" className="opacity-85 hover:underline">Termos de Uso</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-foreground/10">
        <p className="container-site py-5 text-xs opacity-60">
          © {new Date().getFullYear()} Conta Gênio. Os resultados são estimativas e não substituem orientação profissional.
        </p>
      </div>
    </footer>
  );
}
