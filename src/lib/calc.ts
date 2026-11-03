/** Pure math + pt-BR parsing/formatting for calculators. All runs in the browser. */

export type Parsed = { ok: true; value: number } | { ok: false; error: string };

/**
 * Parses a number typed in pt-BR or en style. Accepts "," or "." as decimal.
 * When both appear, the last one is the decimal separator (e.g. "1.234,56").
 * Several dots with no comma are thousands separators ("1.000.000").
 */
export function parseNumber(raw: string, label = "O campo"): Parsed {
  let s = raw.trim().replace(/\s/g, "").replace(/^R\$/i, "");
  if (!s) return { ok: false, error: `${label} está vazio.` };
  if (!/^[+-]?[\d.,]+$/.test(s) || !/\d/.test(s)) return { ok: false, error: `${label} não é um número válido.` };
  const lastComma = s.lastIndexOf(",");
  const lastDot = s.lastIndexOf(".");
  if (lastComma >= 0 && lastDot >= 0) {
    const dec = lastComma > lastDot ? "," : ".";
    const thou = dec === "," ? "." : ",";
    s = s.split(thou).join("");
    if (s.split(dec).length > 2) return { ok: false, error: `${label} não é um número válido.` };
    s = s.replace(dec, ".");
  } else if (lastComma >= 0) {
    if (s.split(",").length > 2) return { ok: false, error: `${label} não é um número válido.` };
    s = s.replace(",", ".");
  } else if (s.split(".").length > 2) {
    if (!/^[+-]?\d{1,3}(\.\d{3})+$/.test(s)) return { ok: false, error: `${label} não é um número válido.` };
    s = s.split(".").join("");
  }
  const n = Number(s);
  if (!Number.isFinite(n)) return { ok: false, error: `${label} não é um número válido.` };
  return { ok: true, value: n };
}

export const formatNumber = (n: number, maxDigits = 2) =>
  new Intl.NumberFormat("pt-BR", { maximumFractionDigits: maxDigits }).format(n);

export const formatBRL = (n: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);

export const formatPercent = (n: number) => `${formatNumber(n)}%`;

// Porcentagem
export function percentage(value: number, pct: number) {
  const part = (value * pct) / 100;
  return { part, increased: value + part, decreased: value - part };
}

// Regra de três simples direta: A/B = C/D  ⇒  A·D = B·C
export type R3Key = "a" | "b" | "c" | "d";
export function ruleOfThree(v: Partial<Record<R3Key, number>>): { ok: true; key: R3Key; value: number } | { ok: false; error: string } {
  const keys: R3Key[] = ["a", "b", "c", "d"];
  const missing = keys.filter((k) => v[k] === undefined);
  if (missing.length !== 1) return { ok: false, error: "Preencha exatamente três valores e deixe vazio o que deseja descobrir." };
  const key = missing[0];
  const { a, b, c, d } = v as Record<R3Key, number>;
  const [num, den] = key === "a" ? [b * c, d] : key === "b" ? [a * d, c] : key === "c" ? [a * d, b] : [b * c, a];
  if (den === 0) return { ok: false, error: "Não é possível dividir por zero. Revise os valores informados." };
  return { ok: true, key: key as R3Key, value: num / den };
}

// Desconto
export function discountFromPercent(price: number, pct: number) {
  const saved = (price * pct) / 100;
  return { saved, final: price - saved };
}
export function percentFromFinal(price: number, final: number) {
  if (price === 0) return null;
  const saved = price - final;
  return { saved, pct: (saved / price) * 100 };
}

// Média aritmética
export function average(nums: number[]) {
  const sum = nums.reduce((s, n) => s + n, 0);
  return { sum, count: nums.length, mean: nums.length ? sum / nums.length : NaN };
}
