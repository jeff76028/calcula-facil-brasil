import { useState, type FormEvent } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NumField, Actions, ErrorBox, Results, ModeSwitch } from "./shared";
import {
  parseNumber, formatNumber, formatBRL, formatPercent,
  percentage, percentChange, ruleOfThree, discountFromPercent, percentFromFinal, average,
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
type R3In = "a" | "b" | "c";
export function RuleOfThreeCalculator() {
  const [vals, setVals] = useState<Record<R3In, string>>({ a: "", b: "", c: "" });
  const [errors, setErrors] = useState<string[]>([]);
  const [res, setRes] = useState<Res>(null);
  const [x, setX] = useState("");
  const set = (k: R3In) => (v: string) => setVals((s) => ({ ...s, [k]: v }));

  function submit(e: FormEvent) {
    e.preventDefault();
    const parsed = (["a", "b", "c"] as R3In[]).map((k) => parseNumber(vals[k], `O campo ${k.toUpperCase()}`));
    const errs = parsed.flatMap((r) => (r.ok ? [] : [r.error]));
    if (errs.length) { setErrors(errs); setX(""); return setRes(null); }
    const [a = 0, b = 0, c = 0] = parsed.map((r) => (r.ok ? r.value : 0));
    const r = ruleOfThree({ a, b, c });
    if (!r.ok) { setErrors(["O campo A não pode ser zero, pois não é possível dividir por zero."]); setX(""); return setRes(null); }
    setErrors([]);
    const n = (v: number) => formatNumber(v, 6);
    setX(n(r.value));
    setRes({
      items: [{ label: "Valor de X", value: n(r.value), highlight: true }],
      explanation: (
        <ol className="list-decimal space-y-1 pl-5">
          <li>Fórmula: X = (B × C) ÷ A</li>
          <li>Substituindo: X = ({n(b)} × {n(c)}) ÷ {n(a)}</li>
          <li>Multiplicando: X = {n(b * c)} ÷ {n(a)}</li>
          <li>Resultado: <strong>X = {n(r.value)}</strong></li>
        </ol>
      ),
    });
  }
  const clear = () => { setVals({ a: "", b: "", c: "" }); setX(""); setErrors([]); setRes(null); };
  const eq = <span aria-hidden className="pb-3 text-center font-display text-2xl font-bold text-primary">=</span>;

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <p className="text-sm text-muted-foreground">Informe A, B e C. A calculadora encontra o valor de <strong>X</strong>.</p>
      <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
        <NumField id="r3-a" label="A" value={vals.a} onChange={set("a")} placeholder="Ex.: 2" />
        {eq}
        <NumField id="r3-b" label="B" value={vals.b} onChange={set("b")} placeholder="Ex.: 20" />
        <NumField id="r3-c" label="C" value={vals.c} onChange={set("c")} placeholder="Ex.: 5" />
        {eq}
        <div className="space-y-1.5">
          <label htmlFor="r3-x" className="text-sm font-semibold">X (desconhecido)</label>
          <input id="r3-x" readOnly tabIndex={-1} value={x} placeholder="?" aria-live="polite"
            className="flex h-12 w-full rounded-md border border-primary/40 bg-primary/5 px-3 text-base font-bold text-foreground" />
        </div>
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
    else if (nums.length < 2) errs.push("Informe pelo menos dois valores válidos.");
    setErrors(errs);
    if (errs.length) return setRes(null);
    const r = average(nums);
    const f = (n: number) => formatNumber(n, 4);
    setRes({
      items: [
        { label: "Média aritmética", value: f(r.mean), highlight: true },
        { label: "Soma dos valores", value: f(r.sum) },
        { label: "Quantidade de números", value: String(r.count) },
      ],
      explanation: (
        <ol className="list-decimal space-y-1 pl-5">
          <li>Fórmula: Média = soma dos valores ÷ quantidade de valores.</li>
          <li>Soma: {nums.map((n) => (n < 0 ? `(${f(n)})` : f(n))).join(" + ")} = {f(r.sum)}.</li>
          <li>Quantidade: {r.count} números.</li>
          <li>Média: {f(r.sum)} ÷ {r.count} = <strong>{f(r.mean)}</strong>.</li>
        </ol>
      ),
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
            <Button type="button" variant="ghost" size="icon" className="h-12 w-12" disabled={fields.length <= 2}
              aria-label={`Remover número ${i + 1}`} onClick={() => setFields((s) => s.filter((x) => x.id !== f.id))}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button type="button" variant="secondary" onClick={() => setFields((s) => [...s, newField()])}>
        <Plus className="h-4 w-4" /> Adicionar número
      </Button>
      <Actions onClear={clear} submitLabel="Calcular média" />
      <ErrorBox errors={errors} />
      {res && <Results {...res} />}
    </form>
  );
}
