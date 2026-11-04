import { Link } from "@tanstack/react-router";

export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <span className={`grid place-items-center rounded-xl bg-primary text-primary-foreground shadow-card ${className}`}>
      <svg viewBox="0 0 24 24" className="h-[70%] w-[70%]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 18h6M10 21h4" />
        <path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3Z" />
        <path d="M10 8.5h4M10 11h4" stroke="var(--color-accent)" />
      </svg>
    </span>
  );
}

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2" aria-label="Conta Gênio — página inicial">
      <LogoMark />
      <span className="font-display text-xl font-extrabold tracking-tight text-foreground">
        Conta<span className="text-primary">Gênio</span>
      </span>
    </Link>
  );
}
