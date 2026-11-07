import { useState, type FormEvent } from "react";
import { NumField, Actions, ErrorBox, Results, ModeSwitch } from "./shared";
import { parseNumber, formatNumber, tilesNeeded } from "@/lib/calc";

type Waste = "5" | "10" | "15";
type Out = ReturnType<typeof tilesNeeded> & { waste: number; l: number; w: number; tl: number; tw: number };

export function TileCalculator() {
  const [f, setF] = useState({ l: "", w: "", tl: "", tw: "" });
  const [waste, setWaste] = useState<Waste>("10");
  const [errors, setErrors] = useState<string[]>([]);
  const [res, setRes] = useState<Out | null>(null);
  const set = (k: keyof typeof f) => (v: string) => { setF((s) => ({ ...s, [k]: v })); setRes(null); };
  const m2 = (n: number, d = 2) => `${formatNumber(n, d)} m²`;

  function submit(e: FormEvent) {
    e.preventDefault();
    const defs: [keyof typeof f, string][] = [
      ["l", "O comprimento do ambiente"], ["w", "A largura do ambiente"],
      ["tl", "O comprimento da peça"], ["tw", "A largura da peça"],
    ];
    const errs: string[] = [];
    const v: Record<string, number> = {};
    for (const [k, name] of defs) {
      const p = parseNumber(f[k], name);
      if (!p.ok) errs.push(p.error);
      else if (p.value <= 0) errs.push(`${name} deve ser maior que zero.`);
      else v[k] = p.value;
    }
    setErrors(errs);
    if (errs.length) return setRes(null);
    const wp = Number(waste);
    setRes({ ...tilesNeeded(v.l!, v.w!, v.tl!, v.tw!, wp), waste: wp, l: v.l!, w: v.w!, tl: v.tl!, tw: v.tw! });
  }
  const clear = () => { setF({ l: "", w: "", tl: "", tw: "" }); setWaste("10"); setErrors([]); setRes(null); };

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <fieldset className="rounded-xl border border-border bg-card p-4">
        <legend className="px-1 font-display font-bold text-foreground">Ambiente (em metros)</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <NumField id="piso-c" label="Comprimento do ambiente" suffix="m" placeholder="Ex.: 4" value={f.l} onChange={set("l")} />
          <NumField id="piso-l" label="Largura do ambiente" suffix="m" placeholder="Ex.: 3" value={f.w} onChange={set("w")} />
        </div>
      </fieldset>
      <fieldset className="rounded-xl border border-border bg-card p-4">
        <legend className="px-1 font-display font-bold text-foreground">Peça de piso (em centímetros)</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <NumField id="piso-pc" label="Comprimento da peça" suffix="cm" placeholder="Ex.: 60" value={f.tl} onChange={set("tl")} />
          <NumField id="piso-pl" label="Largura da peça" suffix="cm" placeholder="Ex.: 60" value={f.tw} onChange={set("tw")} />
        </div>
      </fieldset>
      <div className="space-y-2">
        <p className="font-semibold text-foreground">Margem de sobra</p>
        <ModeSwitch label="Margem de sobra" value={waste} onChange={(x) => { setWaste(x); setRes(null); }}
          options={[{ value: "5", label: "5%" }, { value: "10", label: "10%" }, { value: "15", label: "15%" }]} />
      </div>
      <Actions onClear={clear} />
      <ErrorBox errors={errors} />
      {res && (
        <Results
          items={[
            { label: "Quantidade estimada de peças", value: `${formatNumber(res.pieces, 0)} ${res.pieces === 1 ? "peça" : "peças"}`, highlight: true },
            { label: "Área do ambiente", value: m2(res.roomArea) },
            { label: "Margem de sobra", value: `${res.waste}%` },
            { label: "Área total com sobra", value: m2(res.totalArea) },
            { label: "Área de cada peça", value: m2(res.tileArea, 4) },
          ]}
          explanation={
            <ol className="list-decimal space-y-1 pl-5">
              <li>Área do ambiente: {formatNumber(res.l, 2)} × {formatNumber(res.w, 2)} = {m2(res.roomArea)}</li>
              <li>Área da peça: ({formatNumber(res.tl, 2)} ÷ 100) × ({formatNumber(res.tw, 2)} ÷ 100) = {m2(res.tileArea, 4)}</li>
              <li>Com {res.waste}% de sobra: {m2(res.roomArea)} × {formatNumber(1 + res.waste / 100, 2)} = {m2(res.totalArea)}</li>
              <li>Peças: {m2(res.totalArea)} ÷ {m2(res.tileArea, 4)} = {formatNumber(res.totalArea / res.tileArea, 2)} → arredondado para cima: <strong>{res.pieces}</strong></li>
            </ol>
          }
        />
      )}
    </form>
  );
}
