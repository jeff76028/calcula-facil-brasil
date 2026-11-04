import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function NumField({ id, label, value, onChange, placeholder, suffix, hint }: {
  id: string; label: string; value: string; onChange: (v: string) => void; placeholder?: string; suffix?: string; hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="font-semibold">{label}</Label>
      <div className="relative">
        <Input id={id} inputMode="decimal" autoComplete="off" value={value} placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)} className={cn("h-12 text-base", suffix && "pr-12")} />
        {suffix && <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-muted-foreground">{suffix}</span>}
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function Actions({ onClear }: { onClear: () => void }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Button type="submit" size="lg" className="h-14 w-full text-lg font-bold">Calcular</Button>
      <Button type="button" size="lg" variant="outline" className="h-14 w-full text-lg" onClick={onClear}>Limpar</Button>
    </div>
  );
}

export function ErrorBox({ errors }: { errors: string[] }) {
  if (!errors.length) return null;
  return (
    <div role="alert" className="flex gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <ul className="space-y-1">{errors.map((e) => <li key={e}>{e}</li>)}</ul>
    </div>
  );
}

export function Results({ items, explanation }: { items: { label: string; value: string; highlight?: boolean }[]; explanation?: ReactNode }) {
  return (
    <div aria-live="polite" className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
      <h3 className="font-display text-sm font-bold uppercase tracking-wide text-primary">Resultado</h3>
      <dl className="mt-3 grid gap-3 sm:grid-cols-2">
        {items.map((it) => (
          <div key={it.label} className={cn("rounded-xl bg-card p-4 shadow-card", it.highlight && "sm:col-span-2")}>
            <dt className="text-sm text-muted-foreground">{it.label}</dt>
            <dd className={cn("mt-1 break-words font-display font-extrabold text-foreground", it.highlight ? "text-3xl" : "text-xl")}>{it.value}</dd>
          </div>
        ))}
      </dl>
      {explanation && <div className="mt-4 text-sm text-muted-foreground">{explanation}</div>}
    </div>
  );
}

export function ModeSwitch<T extends string>({ value, options, onChange, label }: {
  value: T; options: { value: T; label: string }[]; onChange: (v: T) => void; label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="grid gap-2 rounded-xl bg-muted p-1 sm:grid-flow-col">
      {options.map((o) => (
        <button key={o.value} type="button" role="radio" aria-checked={value === o.value} onClick={() => onChange(o.value)}
          className={cn("rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
            value === o.value ? "bg-card text-foreground shadow-card" : "text-muted-foreground hover:text-foreground")}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
