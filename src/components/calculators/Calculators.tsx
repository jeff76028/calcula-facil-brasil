import { useState, type FormEvent } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NumField, Actions, ErrorBox, Results, ModeSwitch } from "./shared";
import {
  parseNumber, formatNumber, formatBRL, formatPercent,
  percentage, percentChange, ruleOfThree, discountFromPercent, percentFromFinal, average, type R3Key,
} from "@/lib/calc";

type Res = { items: { label: string; value: string; highlight?: boolean }[]; explanation?: React.ReactNode } | null;

/* ---------- Porcentagem ---------- */
type PctMode = "parte" | "aumento" | "desconto" | "variacao";
export function PercentageCalculator() {
  const [mode, setMode] = useState<PctMode>("parte");
  const [value, setValue] = useState("");
  const [pct, setPct] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [res, setRes] = useState<Res>(null);
  const isVar = mode === "variacao";
  const money = mode === "aumento" || mode === "desconto";
  const f = money ? formatBRL : (n: number) => formatNumber(n, 4);

  function changeMode(m: PctMode) { setMode(m); setErrors([]); setRes(null); }

  function submit(e: FormEvent) {
    e.preventDefault();
    const a = parseNumber(value, isVar ? "O valor inicial" : money ? "O valor original" : "O valor");
    const b = parseNumber(pct, isVar ? "O valor final" : "O percentual");
    const errs = [a, b].flatMap((r) => (r.ok ? [] : [r.error]));
    if (!a.ok || !b.ok) { setErrors(errs); return setRes(null); }
    setErrors([]);
    const A = a.value, B = b.value;
    if (isVar) {
      const r = percentChange(A, B);
      if (!r) { setErrors(["O valor inicial não pode ser zero: não é possível calcular a variação a partir de zero (divisão por zero)."]); return setRes(null); }
      const word = r.pct > 0 ? "Aumento" : r.pct < 0 ? "Redução" : "Sem variação";
      return setRes({
        items: [
          { label: "Variação percentual", value: `${r.pct > 0 ? "+" : ""}${formatNumber(r.pct, 4)}%`, highlight: true },
          { label: "Tipo de variação", value: word },
          { label: "Diferença", value: formatNumber(r.diff, 4) },
        ],
        explanation: <>Cálculo: ({f(B)} − {f(A)}) ÷ {f(Math.abs(A))} × 100 = {formatNumber(r.pct, 4)}%.</>,
      });
    }
    const r = percentage(A, B);
    if (mode === "parte") return setRes({
      items: [{ label: `${formatPercent(B)} de ${f(A)}`, value: f(r.part), highlight: true }],
      explanation: <>Cálculo: {f(A)} × {formatNumber(B, 4)} ÷ 100 = {f(r.part)}.</>,
    });
    if (mode === "aumento") return setRes({
      items: [
        { label: `Valor com aumento de ${formatPercent(B)}`, value: f(r.increased), highlight: true },
        { label: "Valor do aumento", value: f(r.part) },
        { label: "Valor original", value: f(A) },
      ],
      explanation: <>Aumento: {f(A)} × {formatNumber(B, 4)} ÷ 100 = {f(r.part)}. Valor final: {f(A)} + {f(r.part)} = {f(r.increased)}.</>,
    });
    setRes({
      items: [
        { label: `Valor com desconto de ${formatPercent(B)}`, value: f(r.decreased), highlight: true },
        { label: "Valor do desconto", value: f(r.part) },
        { label: "Valor original", value: f(A) },
      ],
      explanation: <>Desconto: {f(A)} × {formatNumber(B, 4)} ÷ 100 = {f(r.part)}. Valor final: {f(A)} − {f(r.part)} = {f(r.decreased)}.</>,
    });
  }
  const clear = () => { setValue(""); setPct(""); setErrors([]); setRes(null); };

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <ModeSwitch label="Tipo de cálculo" value={mode} onChange={changeMode}
        options={[
          { value: "parte", label: "X% de um valor" },
          { value: "aumento", label: "Aumento" },
          { value: "desconto", label: "Desconto" },
          { value: "variacao", label: "Variação" },
        ]} />
      <div className="grid gap-4 sm:grid-cols-2">
        {isVar ? (
          <>
            <NumField id="pct-valor" label="Valor inicial" value={value} onChange={setValue} placeholder="Ex.: 200" />
            <NumField id="pct-perc" label="Valor final" value={pct} onChange={setPct} placeholder="Ex.: 230" />
          </>
        ) : (
          <>
            <NumField id="pct-valor" label={money ? "Valor original (R$)" : "Valor"} value={value} onChange={setValue} placeholder="Ex.: 200" />
            <NumField id="pct-perc" label={mode === "aumento" ? "Percentual de aumento" : mode === "desconto" ? "Percentual de desconto" : "Percentual"} value={pct} onChange={setPct} placeholder="Ex.: 15" suffix="%" />
          </>
        )}
      </div>
      <Actions onClear={clear} />
      <ErrorBox errors={errors} />
      {res && <Results {...res} />}
    </form>
  );
}

/* ---------- Regra de três ---------- */
const R3_LABELS: Record<R3Key, string> = { a: "A", b: "B", c: "C", d: "X (D)" };
export function RuleOfThreeCalculator() {
  const [vals, setVals] = useState<Record<R3Key, string>>({ a: "", b: "", c: "", d: "" });
  const [errors, setErrors] = useState<string[]>([]);
  const [res, setRes] = useState<Res>(null);
  const set = (k: R3Key) => (v: string) => setVals((s) => ({ ...s, [k]: v }));

  function submit(e: FormEvent) {
    e.preventDefault();
    const nums: Partial<Record<R3Key, number>> = {};
    const errs: string[] = [];
    (Object.keys(vals) as R3Key[]).forEach((k) => {
      if (!vals[k].trim()) return;
      const p = parseNumber(vals[k], `O campo ${R3_LABELS[k]}`);
      if (p.ok) nums[k] = p.value; else errs.push(p.error);
    });
    if (errs.length) { setErrors(errs); return setRes(null); }
    const r = ruleOfThree(nums);
    if (!r.ok) { setErrors([r.error]); return setRes(null); }
    setErrors([]);
    const all = { ...nums, [r.key]: r.value } as Record<R3Key, number>;
    const n = (k: R3Key) => formatNumber(all[k], 6);
    const formula: Record<R3Key, string> = {
      a: `A = (B × C) ÷ D = (${n("b")} × ${n("c")}) ÷ ${n("d")}`,
      b: `B = (A × D) ÷ C = (${n("a")} × ${n("d")}) ÷ ${n("c")}`,
      c: `C = (A × D) ÷ B = (${n("a")} × ${n("d")}) ÷ ${n("b")}`,
      d: `D = (B × C) ÷ A = (${n("b")} × ${n("c")}) ÷ ${n("a")}`,
    };
    setRes({
      items: [{ label: `Valor encontrado para ${R3_LABELS[r.key]}`, value: formatNumber(r.value, 6), highlight: true }],
      explanation: (
        <>
          <p>Proporção: {n("a")} está para {n("b")} assim como {n("c")} está para {n("d")}.</p>
          <p className="mt-1">Fórmula (multiplicação cruzada, A × D = B × C): {formula[r.key]} = <strong>{formatNumber(r.value, 6)}</strong>.</p>
        </>
      ),
    });
  }
  const clear = () => { setVals({ a: "", b: "", c: "", d: "" }); setErrors([]); setRes(null); };

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <p className="text-sm text-muted-foreground">Preencha três campos e deixe <strong>vazio</strong> o valor que deseja descobrir.</p>
      <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
        <NumField id="r3-a" label="A" value={vals.a} onChange={set("a")} placeholder="Ex.: 2" />
        <span className="pb-3 text-sm text-muted-foreground">está para</span>
        <NumField id="r3-b" label="B" value={vals.b} onChange={set("b")} placeholder="Ex.: 10" />
        <NumField id="r3-c" label="C" value={vals.c} onChange={set("c")} placeholder="Ex.: 5" />
        <span className="pb-3 text-sm text-muted-foreground">está para</span>
        <NumField id="r3-d" label="X (D)" value={vals.d} onChange={set("d")} placeholder="?" />
      </div>
      <Actions onClear={clear} />
      <ErrorBox errors={errors} />
      {res && <Results {...res} />}
    </form>
  );
}

/* ---------- Desconto ---------- */
export function DiscountCalculator() {
  const [mode, setMode] = useState<"percentual" | "final">("percentual");
  const [price, setPrice] = useState("");
  const [second, setSecond] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [res, setRes] = useState<Res>(null);

  function submit(e: FormEvent) {
    e.preventDefault();
    const p = parseNumber(price, "O preço original");
    const s = parseNumber(second, mode === "percentual" ? "O percentual de desconto" : "O preço final");
    const errs = [p, s].flatMap((r) => (r.ok ? [] : [r.error]));
    if (p.ok && p.value <= 0) errs.push("O preço original deve ser maior que zero.");
    if (s.ok && s.value < 0) errs.push(mode === "percentual" ? "O percentual não pode ser negativo." : "O preço final não pode ser negativo.");
    if (mode === "percentual" && s.ok && s.value > 100) errs.push("O desconto não pode passar de 100%.");
    if (mode === "final" && p.ok && s.ok && s.value > p.value) errs.push("O preço final não pode ser maior que o preço original.");
    setErrors(errs);
    if (errs.length || !p.ok || !s.ok) return setRes(null);
    if (mode === "percentual") {
      const r = discountFromPercent(p.value, s.value);
      setRes({
        items: [
          { label: "Preço final", value: formatBRL(r.final), highlight: true },
          { label: "Você economiza", value: formatBRL(r.saved) },
          { label: "Desconto aplicado", value: formatPercent(s.value) },
        ],
        explanation: <>Economia: {formatBRL(p.value)} × {formatNumber(s.value, 4)} ÷ 100 = {formatBRL(r.saved)}. Preço final: {formatBRL(p.value)} − {formatBRL(r.saved)} = {formatBRL(r.final)}.</>,
      });
    } else {
      const r = percentFromFinal(p.value, s.value)!;
      setRes({
        items: [
          { label: "Percentual de desconto", value: formatPercent(r.pct), highlight: true },
          { label: "Você economiza", value: formatBRL(r.saved) },
          { label: "Preço final", value: formatBRL(s.value) },
        ],
        explanation: <>Desconto: ({formatBRL(p.value)} − {formatBRL(s.value)}) ÷ {formatBRL(p.value)} × 100 = {formatPercent(r.pct)}.</>,
      });
    }
  }
  const clear = () => { setPrice(""); setSecond(""); setErrors([]); setRes(null); };
  const changeMode = (m: typeof mode) => { setMode(m); setSecond(""); setErrors([]); setRes(null); };

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <ModeSwitch label="Tipo de cálculo" value={mode} onChange={changeMode}
        options={[{ value: "percentual", label: "Tenho o % de desconto" }, { value: "final", label: "Tenho o preço final" }]} />
      <div className="grid gap-4 sm:grid-cols-2">
        <NumField id="desc-preco" label="Preço original" value={price} onChange={setPrice} placeholder="Ex.: 199,90" suffix="R$" />
        {mode === "percentual"
          ? <NumField id="desc-perc" label="Percentual de desconto" value={second} onChange={setSecond} placeholder="Ex.: 20" suffix="%" />
          : <NumField id="desc-final" label="Preço final (com desconto)" value={second} onChange={setSecond} placeholder="Ex.: 149,90" suffix="R$" />}
      </div>
      <Actions onClear={clear} />
      <ErrorBox errors={errors} />
      {res && <Results {...res} />}
    </form>
  );
}

/* ---------- Média ---------- */
let uid = 0;
const newField = () => ({ id: ++uid, value: "" });
export function AverageCalculator() {
  const [fields, setFields] = useState(() => [newField(), newField(), newField()]);
  const [errors, setErrors] = useState<string[]>([]);
  const [res, setRes] = useState<Res>(null);

  function submit(e: FormEvent) {
    e.preventDefault();
    const errs: string[] = [];
    const nums: number[] = [];
    fields.forEach((f, i) => {
      const p = parseNumber(f.value, `O número ${i + 1}`);
      if (p.ok) nums.push(p.value); else errs.push(p.error);
    });
    if (errs.length) errs.push("Preencha ou remova os campos indicados.");
    setErrors(errs);
    if (errs.length) return setRes(null);
    const r = average(nums);
    setRes({
      items: [
        { label: "Média aritmética", value: formatNumber(r.mean, 4), highlight: true },
        { label: "Soma", value: formatNumber(r.sum, 4) },
        { label: "Quantidade de valores", value: String(r.count) },
      ],
      explanation: <>Cálculo: ({nums.map((n) => formatNumber(n, 4)).join(" + ")}) ÷ {r.count} = {formatNumber(r.sum, 4)} ÷ {r.count} = {formatNumber(r.mean, 4)}.</>,
    });
  }
  const clear = () => { setFields([newField(), newField(), newField()]); setErrors([]); setRes(null); };

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <div className="space-y-3">
        {fields.map((f, i) => (
          <div key={f.id} className="flex items-end gap-2">
            <div className="flex-1">
              <NumField id={`media-${f.id}`} label={`Número ${i + 1}`} value={f.value} placeholder="Ex.: 7,5"
                onChange={(v) => setFields((s) => s.map((x) => (x.id === f.id ? { ...x, value: v } : x)))} />
            </div>
            <Button type="button" variant="ghost" size="icon" className="h-12 w-12" disabled={fields.length <= 1}
              aria-label={`Remover número ${i + 1}`} onClick={() => setFields((s) => s.filter((x) => x.id !== f.id))}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button type="button" variant="secondary" onClick={() => setFields((s) => [...s, newField()])}>
        <Plus className="h-4 w-4" /> Adicionar número
      </Button>
      <Actions onClear={clear} />
      <ErrorBox errors={errors} />
      {res && <Results {...res} />}
    </form>
  );
}
