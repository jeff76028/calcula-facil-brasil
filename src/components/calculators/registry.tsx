import type { ComponentType } from "react";
import { PercentageCalculator, RuleOfThreeCalculator, DiscountCalculator, AverageCalculator } from "./Calculators";

export interface ToolContent {
  Component: ComponentType;
  seoTitle?: string;
  seoDescription?: string;
  intro?: string;
  howTo: string[];
  formula: string[];
  example: string;
  faq: { q: string; a: string }[];
}

export const calculators: Record<string, ToolContent> = {
  "calculadora-de-porcentagem": {
    Component: PercentageCalculator,
    seoTitle: "Calculadora de Porcentagem Online Grátis",
    seoDescription: "Calcule X% de um valor, aumento, desconto e variação percentual entre dois valores. Grátis, sem cadastro e com cálculo no navegador.",
    intro: "Porcentagem aparece o tempo todo: no reajuste do aluguel, na promoção da loja, na comissão de vendas ou na comparação de preços de um mês para o outro. Esta calculadora reúne os quatro cálculos mais comuns em um só lugar. Escolha o tipo de cálculo, informe os números e veja o resultado junto com a conta passo a passo.",
    howTo: ["Escolha o tipo de cálculo: X% de um valor, Aumento, Desconto ou Variação.", "Preencha os dois campos. Vírgula ou ponto podem ser usados como separador decimal.", "Clique em Calcular para ver o resultado e a explicação.", "Use Limpar para começar um novo cálculo."],
    formula: ["X% de um valor = valor × X ÷ 100", "Valor com aumento = valor + (valor × X ÷ 100)", "Valor com desconto = valor − (valor × X ÷ 100)", "Variação percentual = (valor final − valor inicial) ÷ valor inicial × 100"],
    example: "Quanto é 15% de 200? 200 × 15 ÷ 100 = 30. Um valor de R$ 200,00 com aumento de 15% passa a R$ 230,00; um produto de R$ 200,00 com desconto de 15% sai por R$ 170,00. Se um preço foi de R$ 200,00 para R$ 230,00, a variação foi de +15%.",
    faq: [
      { q: "Como calcular 10% de um valor?", a: "Multiplique o valor por 10 e divida por 100. Por exemplo, 10% de 350 é 35." },
      { q: "Como saber quantos por cento um valor aumentou?", a: "Use a aba Variação: subtraia o valor inicial do final, divida pelo inicial e multiplique por 100. De 50 para 60, a variação é de 20%." },
      { q: "Por que não dá para calcular a variação a partir de zero?", a: "A fórmula divide pelo valor inicial. Como não existe divisão por zero, a variação percentual a partir de zero não é definida." },
      { q: "Um aumento de 10% seguido de uma redução de 10% volta ao valor original?", a: "Não. 100 com aumento de 10% vira 110; 110 com redução de 10% vira 99." },
      { q: "Posso usar vírgula ou ponto?", a: "Sim. Os dois são aceitos como separador decimal, por exemplo 12,5 ou 12.5." },
    ],
  },
  "regra-de-tres": {
    Component: RuleOfThreeCalculator,
    seoTitle: "Calculadora de Regra de Três Online Grátis",
    seoDescription: "Resolva regra de três simples direta: informe A, B e C e descubra X com a fórmula e o cálculo passo a passo. Grátis e sem cadastro.",
    intro: "A regra de três simples é um método para descobrir um valor desconhecido quando duas grandezas são diretamente proporcionais, ou seja, quando uma aumenta, a outra aumenta na mesma proporção. É usada para calcular preços, receitas, consumo de combustível, conversões e muitas situações do dia a dia.",
    howTo: ["Informe em A e B os dois valores que você já conhece e que se relacionam (ex.: 2 produtos = R$ 20).", "Informe em C o novo valor da mesma grandeza de A (ex.: 5 produtos).", "Clique em Calcular para ver X, a fórmula e o passo a passo.", "Use Limpar para começar de novo. Vírgula ou ponto podem ser usados como separador decimal."],
    formula: ["Proporção direta: A está para B assim como C está para X (A ÷ B = C ÷ X)", "Multiplicação cruzada: A × X = B × C", "Isolando X: X = (B × C) ÷ A", "A não pode ser zero, porque não existe divisão por zero."],
    example: "Se 2 produtos custam R$ 20, quanto custam 5 produtos? A = 2, B = 20, C = 5. X = (20 × 5) ÷ 2 = 100 ÷ 2 = 50, ou seja, R$ 50. Outro exemplo: se 4 litros rendem 12 copos, 6 litros rendem X = (12 × 6) ÷ 4 = 18 copos. E se 10 kg custam R$ 100, 3 kg custam X = (100 × 3) ÷ 10 = R$ 30.",
    faq: [
      { q: "O que é regra de três simples direta?", a: "É um método para encontrar um valor desconhecido quando duas grandezas aumentam ou diminuem na mesma proporção." },
      { q: "Como saber se devo usar regra de três direta?", a: "Pergunte-se: se uma grandeza dobrar, a outra também dobra? Se sim, as grandezas são diretamente proporcionais e esta calculadora serve." },
      { q: "E quando as grandezas são inversamente proporcionais?", a: "Esta calculadora resolve apenas a regra de três direta. Na inversa (ex.: mais operários, menos dias), a fórmula é diferente." },
      { q: "Por que A não pode ser zero?", a: "Porque A fica no divisor da fórmula X = (B × C) ÷ A, e não existe divisão por zero." },
      { q: "Posso usar números decimais?", a: "Sim. Use vírgula ou ponto, por exemplo 2,5 ou 2.5." },
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
