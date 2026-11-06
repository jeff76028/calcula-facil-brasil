import { useState, type FormEvent } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NumField, Actions, ErrorBox, Results, ModeSwitch } from "./shared";
import {
  parseNumber, formatNumber, formatBRL, formatPercent,
  percentage, percentChange, ruleOfThree, discountFromPercent, percentFromFinal, average, compoundInterest,
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

/* ---------- Juros compostos ---------- */
type JcUnit = "mensal" | "anual";
function GrowthChart({ series, unit }: { series: number[]; unit: JcUnit }) {
  const W = 600, H = 220, P = 8;
  const first = series[0] ?? 0, last = series[series.length - 1] ?? 0;
  const max = Math.max(...series) || 1;
  const pts = series.map((v, k) => [P + (k / Math.max(series.length - 1, 1)) * (W - 2 * P), H - P - (v / max) * (H - 2 * P)]);
  const line = pts.map((p) => p.join(",")).join(" ");
  const base = H - P - (first / max) * (H - 2 * P);
  const u = unit === "mensal" ? "mês" : "ano";
  return (
    <figure className="mt-4 rounded-xl bg-card p-4 shadow-card">
      <figcaption className="mb-2 text-sm font-semibold text-foreground">Evolução do montante</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-48 w-full" role="img" aria-label={`Gráfico do montante de ${formatBRL(first)} até ${formatBRL(last)}`}>
        <polygon points={`${P},${H - P} ${line} ${W - P},${H - P}`} className="fill-primary/15" />
        <line x1={P} x2={W - P} y1={base} y2={base} className="stroke-muted-foreground" strokeDasharray="4 4" strokeWidth={1} />
        <polyline points={line} fill="none" className="stroke-primary" strokeWidth={3} strokeLinejoin="round" />
      </svg>
      <div className="mt-1 flex justify-between text-xs text-muted-foreground">
        <span>Início: {formatBRL(first)}</span>
        <span>{series.length - 1}º {u}: {formatBRL(last)}</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">Linha tracejada: capital inicial.</p>
    </figure>
  );
}

export function CompoundInterestCalculator() {
  const [unit, setUnit] = useState<JcUnit>("mensal");
  const [capital, setCapital] = useState("");
  const [rate, setRate] = useState("");
  const [periods, setPeriods] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [res, setRes] = useState<Res>(null);
  const [series, setSeries] = useState<number[] | null>(null);
  const uPl = unit === "mensal" ? "meses" : "anos";
  const uRate = unit === "mensal" ? "ao mês" : "ao ano";

  function submit(e: FormEvent) {
    e.preventDefault();
    // Em reais, "1.000" é mil (ponto como separador de milhar).
    const c = parseNumber(/^\s*\d{1,3}(\.\d{3})+\s*$/.test(capital) ? capital.replace(/\./g, "") : capital, "O capital inicial");
    const r = parseNumber(rate, "O campo taxa de juros");
    const t = parseNumber(periods, "O período");
    const errs = [c, r, t].flatMap((x) => (x.ok ? [] : [x.error]));
    if (c.ok && c.value < 0) errs.push("O capital inicial não pode ser negativo.");
    if (r.ok && r.value < 0) errs.push("A taxa de juros não pode ser negativa.");
    if (t.ok && (!Number.isInteger(t.value) || t.value < 1)) errs.push(`O período deve ser um número inteiro de ${uPl} maior que zero.`);
    if (t.ok && t.value > 1200) errs.push(`O período máximo é de 1.200 ${uPl}.`);
    setErrors(errs);
    if (errs.length || !c.ok || !r.ok || !t.ok) { setSeries(null); return setRes(null); }
    const C = c.value, R = r.value, T = t.value;
    const out = compoundInterest(C, R, T);
    if (!Number.isFinite(out.amount)) { setErrors(["O resultado é grande demais para ser calculado. Reduza a taxa ou o período."]); setSeries(null); return setRes(null); }
    const i = R / 100;
    setSeries(out.series);
    setRes({
      items: [
        { label: "Montante final", value: formatBRL(out.amount), highlight: true },
        { label: "Valor inicial", value: formatBRL(C) },
        { label: "Total de juros", value: formatBRL(out.interest) },
        { label: "Taxa utilizada", value: `${formatNumber(R, 4)}% ${uRate}` },
        { label: "Período", value: `${T} ${T === 1 ? (unit === "mensal" ? "mês" : "ano") : uPl}` },
      ],
      explanation: (
        <ol className="list-decimal space-y-1 pl-5">
          <li>Fórmula: M = C × (1 + i)<sup>t</sup>.</li>
          <li>Taxa em decimal: i = {formatNumber(R, 4)} ÷ 100 = {formatNumber(i, 6)}.</li>
          <li>Substituindo: M = {formatBRL(C)} × (1 + {formatNumber(i, 6)})<sup>{T}</sup> = {formatBRL(C)} × {formatNumber(Math.pow(1 + i, T), 6)}.</li>
          <li>Montante: <strong>{formatBRL(out.amount)}</strong>. Juros: {formatBRL(out.amount)} − {formatBRL(C)} = {formatBRL(out.interest)}.</li>
        </ol>
      ),
    });
  }
  const clear = () => { setCapital(""); setRate(""); setPeriods(""); setErrors([]); setRes(null); setSeries(null); };
  const changeUnit = (u: JcUnit) => { setUnit(u); setErrors([]); setRes(null); setSeries(null); };

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <ModeSwitch label="Unidade da taxa e do período" value={unit} onChange={changeUnit}
        options={[{ value: "mensal", label: "Taxa mensal / meses" }, { value: "anual", label: "Taxa anual / anos" }]} />
      <NumField id="jc-capital" label="Valor inicial (capital)" value={capital} onChange={setCapital} placeholder="Ex.: 1.000" suffix="R$" />
      <div className="grid gap-4 sm:grid-cols-2">
        <NumField id="jc-taxa" label={`Taxa de juros (${uRate})`} value={rate} onChange={setRate} placeholder="Ex.: 1,5" suffix="%" />
        <NumField id="jc-periodo" label={`Período (em ${uPl})`} value={periods} onChange={setPeriods} placeholder="Ex.: 12" suffix={uPl} />
      </div>
      <p className="text-xs text-muted-foreground">A taxa e o período usam sempre a mesma unidade ({uRate}, em {uPl}) para o cálculo ficar correto.</p>
      <Actions onClear={clear} />
      <ErrorBox errors={errors} />
      {res && <Results {...res} />}
      {res && series && <GrowthChart series={series} unit={unit} />}
    </form>
  );
}
