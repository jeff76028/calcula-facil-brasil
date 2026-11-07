import { useState, type FormEvent } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NumField, Actions, ErrorBox } from "./shared";
import { parseNumber, formatNumber, roomsArea } from "@/lib/calc";

type Room = { id: number; name: string; length: string; width: string };
let seq = 0;
const newRoom = (): Room => ({ id: ++seq, name: "", length: "", width: "" });
type Out = { rows: { name: string; l: number; w: number; area: number }[]; total: number; count: number } | null;

export function AreaCalculator() {
  const [rooms, setRooms] = useState<Room[]>(() => [newRoom()]);
  const [errors, setErrors] = useState<string[]>([]);
  const [res, setRes] = useState<Out>(null);
  const m2 = (n: number) => `${formatNumber(n, 2)} m²`;
  const label = (r: Room, i: number) => r.name.trim() || `Ambiente ${i + 1}`;

  function compute(list: Room[]) {
    const errs: string[] = [];
    const vals: { length: number; width: number }[] = [];
    list.forEach((r, i) => {
      const n = label(r, i);
      const l = parseNumber(r.length, `O comprimento de "${n}"`);
      const w = parseNumber(r.width, `A largura de "${n}"`);
      if (!l.ok) errs.push(l.error); else if (l.value <= 0) errs.push(`O comprimento de "${n}" deve ser maior que zero.`);
      if (!w.ok) errs.push(w.error); else if (w.value <= 0) errs.push(`A largura de "${n}" deve ser maior que zero.`);
      if (l.ok && w.ok) vals.push({ length: l.value, width: w.value });
    });
    setErrors(errs);
    if (errs.length) return setRes(null);
    const r = roomsArea(vals);
    setRes({ rows: list.map((x, i) => ({ name: label(x, i), l: vals[i]!.length, w: vals[i]!.width, area: r.areas[i]! })), total: r.total, count: r.count });
  }

  const submit = (e: FormEvent) => { e.preventDefault(); compute(rooms); };
  const update = (id: number, patch: Partial<Room>) => { setRooms((s) => s.map((x) => (x.id === id ? { ...x, ...patch } : x))); setRes(null); };
  const remove = (id: number) => {
    const next = rooms.filter((x) => x.id !== id);
    setRooms(next);
    if (res) compute(next); // mantém os resultados atualizados
  };
  const clear = () => { setRooms([newRoom()]); setErrors([]); setRes(null); };

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <div className="space-y-4">
        {rooms.map((r, i) => (
          <fieldset key={r.id} className="rounded-xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <legend className="font-display font-bold text-foreground">Ambiente {i + 1}</legend>
              <Button type="button" variant="ghost" size="sm" disabled={rooms.length <= 1}
                aria-label={`Remover ambiente ${i + 1}`} onClick={() => remove(r.id)}>
                <Trash2 className="h-4 w-4" /> Remover
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor={`area-nome-${r.id}`} className="font-semibold">Nome (opcional)</Label>
                <Input id={`area-nome-${r.id}`} value={r.name} placeholder="Ex.: Sala" className="h-12 text-base" autoComplete="off"
                  onChange={(e) => update(r.id, { name: e.target.value })} />
              </div>
              <NumField id={`area-c-${r.id}`} label="Comprimento" suffix="m" placeholder="Ex.: 4" value={r.length} onChange={(v) => update(r.id, { length: v })} />
              <NumField id={`area-l-${r.id}`} label="Largura" suffix="m" placeholder="Ex.: 3" value={r.width} onChange={(v) => update(r.id, { width: v })} />
            </div>
          </fieldset>
        ))}
      </div>
      <Button type="button" variant="secondary" onClick={() => { setRooms((s) => [...s, newRoom()]); setRes(null); }}>
        <Plus className="h-4 w-4" /> Adicionar ambiente
      </Button>
      <Actions onClear={clear} submitLabel="Calcular área" />
      <ErrorBox errors={errors} />
      {res && (
        <div aria-live="polite" className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-primary">Resultado</h3>
          <dl className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-card p-4 shadow-card">
              <dt className="text-sm text-muted-foreground">Área total</dt>
              <dd className="mt-1 font-display text-3xl font-extrabold text-foreground">{m2(res.total)}</dd>
            </div>
            <div className="rounded-xl bg-card p-4 shadow-card">
              <dt className="text-sm text-muted-foreground">Ambientes calculados</dt>
              <dd className="mt-1 font-display text-3xl font-extrabold text-foreground">{res.count}</dd>
            </div>
          </dl>
          <ul className="mt-4 divide-y divide-border rounded-xl bg-card shadow-card">
            {res.rows.map((r, i) => (
              <li key={i} className="flex flex-wrap items-baseline justify-between gap-2 p-4">
                <span className="font-semibold text-foreground">{r.name}</span>
                <span className="text-sm text-muted-foreground">{formatNumber(r.l, 2)} m × {formatNumber(r.w, 2)} m = <strong className="text-base text-foreground">{m2(r.area)}</strong></span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">Fórmula: Área = Comprimento × Largura. Área total = soma das áreas de todos os ambientes.</p>
        </div>
      )}
    </form>
  );
}
