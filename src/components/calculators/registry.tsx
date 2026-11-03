import type { ComponentType } from "react";
import { PercentageCalculator, RuleOfThreeCalculator, DiscountCalculator, AverageCalculator } from "./Calculators";

export interface ToolContent {
  Component: ComponentType;
  howTo: string[];
  formula: string[];
  example: string;
  faq: { q: string; a: string }[];
}

export const calculators: Record<string, ToolContent> = {
  "calculadora-de-porcentagem": {
    Component: PercentageCalculator,
    howTo: ["Digite o valor base.", "Digite o percentual (ex.: 15 para 15%).", "Escolha se o resultado deve aparecer como número ou em reais.", "Clique em Calcular."],
    formula: ["Porcentagem do valor = valor × percentual ÷ 100", "Valor com aumento = valor + (valor × percentual ÷ 100)", "Valor com redução = valor − (valor × percentual ÷ 100)"],
    example: "15% de R$ 200,00 é R$ 30,00 (200 × 15 ÷ 100). Com aumento de 15%, o valor vai para R$ 230,00; com redução de 15%, fica em R$ 170,00.",
    faq: [
      { q: "Como calcular 10% de um valor?", a: "Multiplique o valor por 10 e divida por 100. Por exemplo, 10% de 350 é 35." },
      { q: "Um aumento de 10% seguido de uma redução de 10% volta ao valor original?", a: "Não. 100 com aumento de 10% vira 110; 110 com redução de 10% vira 99." },
      { q: "Posso usar vírgula ou ponto?", a: "Sim. Os dois são aceitos como separador decimal, por exemplo 12,5 ou 12.5." },
    ],
  },
  "regra-de-tres": {
    Component: RuleOfThreeCalculator,
    howTo: ["Informe os três valores conhecidos nos campos A, B, C ou D.", "Deixe vazio o campo que deseja descobrir.", "Clique em Calcular."],
    formula: ["Proporção direta: A ÷ B = C ÷ D", "Multiplicação cruzada: A × D = B × C", "Ex.: D = (B × C) ÷ A"],
    example: "Se 2 kg de arroz custam R$ 10, quanto custam 5 kg? A = 2, B = 10, C = 5. D = (10 × 5) ÷ 2 = 25, ou seja, R$ 25.",
    faq: [
      { q: "O que é regra de três simples direta?", a: "É um método para encontrar um valor desconhecido quando duas grandezas aumentam ou diminuem na mesma proporção." },
      { q: "E quando as grandezas são inversamente proporcionais?", a: "Esta calculadora resolve a regra de três direta. Na inversa (ex.: mais operários, menos dias), a fórmula muda e o resultado seria diferente." },
      { q: "Por que aparece erro de divisão por zero?", a: "Se o valor que fica no divisor da fórmula for zero, o cálculo não tem resultado. Revise os valores informados." },
    ],
  },
  "calculadora-de-desconto": {
    Component: DiscountCalculator,
    howTo: ["Escolha se você tem o percentual de desconto ou o preço final.", "Informe o preço original.", "Informe o percentual ou o preço com desconto.", "Clique em Calcular."],
    formula: ["Valor economizado = preço original × desconto ÷ 100", "Preço final = preço original − valor economizado", "Desconto (%) = (preço original − preço final) ÷ preço original × 100"],
    example: "Um produto de R$ 200,00 com 25% de desconto: economia de R$ 50,00 e preço final de R$ 150,00. Se o produto saiu de R$ 200,00 por R$ 150,00, o desconto foi de 25%.",
    faq: [
      { q: "Dois descontos de 10% equivalem a 20%?", a: "Não. Aplicados em sequência, 10% e depois 10% resultam em 19% de desconto total sobre o preço original." },
      { q: "Como saber o percentual de desconto de uma promoção?", a: "Use a opção \"Tenho o preço final\": informe o preço de antes e o preço da promoção." },
      { q: "O desconto pode ser maior que 100%?", a: "Não. Um desconto de 100% já deixa o preço em zero, por isso valores acima disso são recusados." },
    ],
  },
  "calculadora-de-media": {
    Component: AverageCalculator,
    howTo: ["Digite cada número ou nota em um campo.", "Use \"Adicionar número\" para mais campos e a lixeira para remover.", "Clique em Calcular."],
    formula: ["Média aritmética = soma dos valores ÷ quantidade de valores"],
    example: "Notas 7, 8,5 e 6: soma = 21,5; quantidade = 3; média = 21,5 ÷ 3 ≈ 7,1667.",
    faq: [
      { q: "Esta calculadora faz média ponderada?", a: "Não. Ela calcula a média aritmética simples, em que todos os valores têm o mesmo peso." },
      { q: "Posso usar números negativos e decimais?", a: "Sim. Números negativos e decimais com vírgula ou ponto são aceitos." },
      { q: "Quantos números posso adicionar?", a: "Quantos precisar. Clique em \"Adicionar número\" para cada novo valor." },
    ],
  },
};
