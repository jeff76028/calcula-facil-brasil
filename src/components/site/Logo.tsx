import { Link } from "@tanstack/react-router";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2" aria-label="Conta Gênio — página inicial">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary font-display text-lg font-extrabold text-primary-foreground shadow-card">
        =
      </span>
      <span className="font-display text-xl font-extrabold tracking-tight text-foreground">
        Calcula<span className="text-primary">Fácil</span>
      </span>
    </Link>
  );
}
