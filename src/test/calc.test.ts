import { describe, expect, it } from "vitest";
import { parseNumber, percentage, percentChange, ruleOfThree, discountFromPercent, percentFromFinal, average } from "@/lib/calc";

const v = (s: string) => {
  const r = parseNumber(s);
  return r.ok ? r.value : null;
};

describe("parseNumber", () => {
  it("accepts comma and dot decimals", () => {
    expect(v("12,5")).toBe(12.5);
    expect(v("12.5")).toBe(12.5);
    expect(v("1.234,56")).toBe(1234.56);
    expect(v("1,234.56")).toBe(1234.56);
    expect(v("1.000.000")).toBe(1000000);
  });
  it("rejects empty and invalid", () => {
    expect(v("")).toBeNull();
    expect(v("abc")).toBeNull();
    expect(v("1,2,3")).toBeNull();
    expect(v("12a")).toBeNull();
  });
});

describe("calculators", () => {
  it("percentage of 200 at 15%", () => {
    expect(percentage(200, 15)).toEqual({ part: 30, increased: 230, decreased: 170 });
  });
  it("percent change", () => {
    expect(percentChange(200, 230)).toEqual({ diff: 30, pct: 15 });
    expect(percentChange(200, 170)).toEqual({ diff: -30, pct: -15 });
    expect(percentChange(0, 50)).toBeNull();
  });
  it("rule of three finds each unknown", () => {
    expect(ruleOfThree({ a: 2, b: 10, c: 5 })).toEqual({ ok: true, key: "d", value: 25 });
    expect(ruleOfThree({ b: 10, c: 5, d: 25 })).toEqual({ ok: true, key: "a", value: 2 });
    expect(ruleOfThree({ a: 0, b: 10, c: 5 }).ok).toBe(false);
    expect(ruleOfThree({ a: 2, b: 20, c: 5 })).toMatchObject({ value: 50 });
    expect(ruleOfThree({ a: 4, b: 12, c: 6 })).toMatchObject({ value: 18 });
    expect(ruleOfThree({ a: 10, b: 100, c: 3 })).toMatchObject({ value: 30 });
    expect(ruleOfThree({ a: 1, b: 2 }).ok).toBe(false);
  });
  it("discount both ways", () => {
    expect(discountFromPercent(100, 20)).toEqual({ saved: 20, final: 80 });
    expect(percentFromFinal(200, 150)).toEqual({ saved: 50, pct: 25 });
    expect(percentFromFinal(0, 10)).toBeNull();
  });
  it("average", () => {
    expect(average([7, 8, 9])).toEqual({ sum: 24, count: 3, mean: 8 });
  });
});

describe("average (casos obrigatórios)", () => {
  it("7, 8 e 9 = 8", () => expect(average([7, 8, 9]).mean).toBe(8));
  it("10, 5 e 7,5 = 7,5", () => expect(average([10, 5, 7.5]).mean).toBe(7.5));
  it("2, 4, 6 e 8 = 5", () => expect(average([2, 4, 6, 8]).mean).toBe(5));
  it("-2, 2 e 4 ≈ 1,3333", () => expect(average([-2, 2, 4]).mean).toBeCloseTo(4 / 3));
});
