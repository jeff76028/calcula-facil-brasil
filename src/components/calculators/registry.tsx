import type { ComponentType, ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { PercentageCalculator, RuleOfThreeCalculator, DiscountCalculator, AverageCalculator, CompoundInterestCalculator } from "./Calculators";
import { AreaCalculator } from "./AreaCalculator";
import { TileCalculator } from "./TileCalculator";

export interface ToolContent {
  Component: ComponentType;
  seoTitle?: string;
  seoDescription?: string;
  intro?: string;
  howTo: string[];
  formula: string[];
  example: string;
  faq: { q: string; a: string }[];
  extra?: ReactNode;
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
    seoTitle: "Calculadora de Média Online Grátis",
    seoDescription: "Calcule a média aritmética de notas ou de qualquer lista de números. Veja a soma, a quantidade de valores e a conta passo a passo. Grátis e sem cadastro.",
    intro: "A média aritmética é o valor que representa um conjunto de números de forma equilibrada: é o resultado que cada valor teria se todos fossem iguais. Ela é usada para calcular a nota final na escola, o gasto médio do mês, a temperatura média da semana e muito mais. Nesta calculadora você informa dois ou mais números e recebe a média, a soma e a quantidade de valores, com a explicação completa.",
    howTo: [
      "Digite um número em cada campo. Pode usar vírgula ou ponto para decimais e sinal de menos para negativos.",
      "Clique em \"Adicionar número\" para incluir mais valores, ou na lixeira para remover um campo (mínimo de dois).",
      "Clique em \"Calcular média\" para ver o resultado e o passo a passo.",
      "Use \"Limpar\" para começar um novo cálculo.",
    ],
    formula: [
      "Média = soma dos valores ÷ quantidade de valores",
      "1º passo: some todos os números informados.",
      "2º passo: conte quantos números foram informados.",
      "3º passo: divida a soma pela quantidade.",
    ],
    example: "7, 8 e 9: soma = 24; quantidade = 3; média = 24 ÷ 3 = 8. Já 10, 5 e 7,5: soma = 22,5; média = 22,5 ÷ 3 = 7,5. Com 2, 4, 6 e 8: soma = 20; média = 20 ÷ 4 = 5. Com negativos, -2, 2 e 4: soma = 4; média = 4 ÷ 3 ≈ 1,3333.",
    extra: (
      <>
        <h2>Como calcular a média de notas escolares</h2>
        <p>
          Quando todas as provas têm o mesmo peso, a média final é a média aritmética simples. Some as notas
          do bimestre e divida pela quantidade de avaliações. Por exemplo, com notas 6,5, 8 e 7: soma = 21,5;
          média = 21,5 ÷ 3 ≈ 7,17.
        </p>
        <h3>E se as provas tiverem pesos diferentes?</h3>
        <p>
          Nesse caso o cálculo correto é a média ponderada, que esta calculadora não faz. Confira as regras da
          sua escola antes de usar o resultado.
        </p>
        <h2>Outras calculadoras úteis</h2>
        <p>
          Para comparar resultados em percentual, use a{" "}
          <Link to="/ferramentas/$slug" params={{ slug: "calculadora-de-porcentagem" }}>Calculadora de Porcentagem</Link>.
          Para descobrir valores proporcionais, use a{" "}
          <Link to="/ferramentas/$slug" params={{ slug: "regra-de-tres" }}>Calculadora de Regra de Três</Link>.
          Em compras, a <Link to="/ferramentas/$slug" params={{ slug: "calculadora-de-desconto" }}>Calculadora de Desconto</Link> mostra o preço final.
        </p>
      </>
    ),
    faq: [
      { q: "O que é média aritmética?", a: "É a soma de todos os valores dividida pela quantidade de valores. Todos os números têm o mesmo peso." },
      { q: "Esta calculadora faz média ponderada?", a: "Não. Ela calcula a média aritmética simples, em que todos os valores têm o mesmo peso." },
      { q: "Posso usar números negativos e decimais?", a: "Sim. Números negativos e decimais com vírgula ou ponto são aceitos." },
      { q: "Por que preciso de pelo menos dois números?", a: "A média serve para resumir um conjunto de valores; com um único número, a média é o próprio número." },
      { q: "Quantos números posso adicionar?", a: "Quantos precisar. Clique em \"Adicionar número\" para cada novo valor." },
    ],
  },
  "calculadora-de-juros-compostos": {
    Component: CompoundInterestCalculator,
    seoTitle: "Calculadora de Juros Compostos Online Grátis",
    seoDescription: "Calcule o montante final de uma aplicação ou dívida com juros compostos. Taxa mensal ou anual, gráfico da evolução e cálculo passo a passo. Grátis.",
    intro: "Juros compostos são os famosos juros sobre juros: a cada período, a taxa incide sobre o valor inicial somado aos juros já acumulados. É assim que crescem investimentos como poupança, CDB e Tesouro Direto, e também dívidas como o rotativo do cartão de crédito. Com esta calculadora, você informa o capital, a taxa e o período e descobre quanto o valor vai virar.",
    howTo: ["Escolha a unidade: taxa mensal com período em meses, ou taxa anual com período em anos.", "Informe o valor inicial (capital) em reais.", "Informe a taxa de juros em % e o período (número inteiro). Vírgula ou ponto podem ser usados.", "Clique em Calcular para ver o montante, os juros, o gráfico e o passo a passo. Use Limpar para recomeçar."],
    formula: ["M = C × (1 + i)^t", "M = montante final; C = capital inicial; i = taxa em decimal (ex.: 10% = 0,10); t = quantidade de períodos", "Juros acumulados: J = M − C", "Juros simples, para comparar: M = C × (1 + i × t). No regime simples, os juros incidem apenas sobre o capital inicial; nos compostos, sobre o saldo acumulado."],
    example: "Exemplo 1: R$ 1.000 a 10% ao mês por 2 meses: M = 1.000 × 1,10² = 1.000 × 1,21 = R$ 1.210,00 (juros de R$ 210). Em juros simples seriam R$ 1.200, porque o segundo mês não renderia sobre os R$ 100 do primeiro. Exemplo 2: R$ 2.000 a 5% ao mês por 3 meses: M = 2.000 × 1,05³ = 2.000 × 1,157625 = R$ 2.315,25. Exemplo 3: R$ 1.000 com taxa zero por 12 meses continua R$ 1.000,00, pois (1 + 0)¹² = 1.",
    faq: [
      { q: "O que são juros compostos?", a: "É o regime em que os juros de cada período são somados ao saldo e passam a render juros também nos períodos seguintes." },
      { q: "Qual a diferença entre juros simples e compostos?", a: "Nos juros simples, a taxa incide sempre sobre o capital inicial. Nos compostos, incide sobre o saldo acumulado, o que faz o valor crescer mais rápido com o tempo." },
      { q: "Posso usar taxa anual com período em meses?", a: "Não diretamente. Taxa e período precisam estar na mesma unidade. Por isso a calculadora tem a opção taxa mensal/meses ou taxa anual/anos." },
      { q: "A calculadora considera aportes mensais, impostos ou inflação?", a: "Não. Ela calcula apenas o crescimento de um valor inicial único com uma taxa fixa, sem aportes, impostos, taxas ou inflação." },
      { q: "Meus dados ficam salvos?", a: "Não. O cálculo é feito no seu navegador e os valores digitados não são enviados nem armazenados." },
    ],
    extra: (<p>Veja também: <Link to="/ferramentas/$slug" params={{ slug: "calculadora-de-porcentagem" }} className="font-semibold text-primary underline">Calculadora de Porcentagem</Link> e <Link to="/ferramentas/$slug" params={{ slug: "calculadora-de-desconto" }} className="font-semibold text-primary underline">Calculadora de Desconto</Link>.</p>),
  },
  "calculadora-de-area": {
    Component: AreaCalculator,
    seoTitle: "Calculadora de Área em m² Online Grátis",
    seoDescription: "Calcule a área em metros quadrados de um ou vários cômodos: informe comprimento e largura e veja a área de cada ambiente e o total. Grátis.",
    intro: "Saber a área em metros quadrados (m²) é o primeiro passo para comprar piso, tinta, rodapé ou orçar uma reforma. Nesta calculadora você informa o comprimento e a largura de cada cômodo retangular e vê a área de cada um e a soma de todos.",
    howTo: ["Meça o comprimento e a largura do ambiente em metros.", "Digite as medidas nos campos. Dê um nome ao ambiente se quiser (ex.: Sala).", "Clique em Adicionar ambiente para incluir outros cômodos.", "Clique em Calcular área para ver a área de cada ambiente, o total e a quantidade de ambientes. Use Limpar para recomeçar."],
    formula: ["Área (m²) = Comprimento (m) × Largura (m)", "Área total = soma das áreas de todos os ambientes", "As medidas precisam estar em metros. Para converter centímetros, divida por 100 (ex.: 350 cm = 3,5 m)."],
    example: "Um quarto de 4 m × 3 m tem 4 × 3 = 12 m². Uma cozinha de 5,5 m × 2 m tem 5,5 × 2 = 11 m². Juntos, os dois ambientes somam 12 + 11 = 23 m².",
    faq: [
      { q: "Como calcular metros quadrados?", a: "Multiplique o comprimento pela largura, ambos em metros. Um cômodo de 4 m por 3 m tem 12 m²." },
      { q: "E se o cômodo não for retangular?", a: "Divida o ambiente em partes retangulares, adicione cada parte como um ambiente e use a área total." },
      { q: "Posso usar vírgula ou ponto?", a: "Sim. 5,5 e 5.5 são aceitos da mesma forma." },
      { q: "Por que não posso informar zero ou valores negativos?", a: "Uma medida real de comprimento ou largura é sempre maior que zero." },
      { q: "Meus dados ficam salvos?", a: "Não. O cálculo é feito no seu navegador e nada é enviado ou armazenado." },
    ],
  },
  "quantidade-de-pisos": {
    Component: TileCalculator,
    seoTitle: "Calculadora de Piso Online Grátis: Quantas Peças Comprar",
    seoDescription: "Descubra quantas peças de piso ou porcelanato comprar: informe as medidas do ambiente e da peça, escolha a sobra de 5%, 10% ou 15% e veja o resultado. Grátis.",
    intro: "Antes de comprar piso, porcelanato ou revestimento, é preciso saber quantas peças cobrem o ambiente. Esta calculadora usa as medidas do cômodo, o tamanho da peça e uma margem de sobra para cortes e quebras, e mostra a quantidade estimada de peças, sempre arredondada para cima.",
    howTo: ["Meça o comprimento e a largura do ambiente em metros.", "Veja na embalagem ou na loja o comprimento e a largura da peça em centímetros (ex.: 60 × 60 cm).", "Escolha a margem de sobra: 5%, 10% (padrão) ou 15%.", "Clique em Calcular para ver a área, a área com sobra e a quantidade de peças. Use Limpar para recomeçar."],
    formula: ["Área do ambiente (m²) = comprimento (m) × largura (m)", "Área da peça (m²) = (comprimento da peça ÷ 100) × (largura da peça ÷ 100)", "Área total com sobra = área do ambiente × (1 + sobra ÷ 100)", "Quantidade de peças = área total com sobra ÷ área da peça, arredondada para cima"],
    example: "Um quarto de 4 m × 3 m tem 12 m². Uma peça de 60 × 60 cm tem 0,6 × 0,6 = 0,36 m². Com 10% de sobra, a área necessária é 12 × 1,10 = 13,2 m². Dividindo: 13,2 ÷ 0,36 = 36,67, arredondado para cima = 37 peças.",
    faq: [
      { q: "Por que adicionar uma margem de sobra?", a: "Parte das peças é cortada nos cantos e bordas, e algumas podem quebrar no transporte ou na instalação. A sobra evita faltar material e ajuda a ter peças do mesmo lote para reparos futuros." },
      { q: "Qual margem de sobra escolher?", a: "10% é a margem mais usada para ambientes comuns. 5% pode servir para cômodos simples e retangulares com peças pequenas; 15% é indicado para ambientes com muitos recortes, peças grandes ou assentamento diagonal. Confirme com o profissional que fará a instalação." },
      { q: "Por que a quantidade é arredondada para cima?", a: "Não é possível comprar uma fração de peça. Se o cálculo der 36,67, são necessárias 37 peças para cobrir toda a área." },
      { q: "A calculadora calcula caixas?", a: "Não. Esta versão mostra a quantidade de peças individuais. Para saber o número de caixas, confira na embalagem quantas peças vêm em cada caixa." },
      { q: "A calculadora considera o rejunte?", a: "Não. O espaço do rejunte é pequeno e não é descontado; a margem de sobra já cobre essa diferença na prática." },
      { q: "Meus dados ficam salvos?", a: "Não. O cálculo é feito no seu navegador e nada é enviado ou armazenado." },
    ],
    extra: (<p>Veja também: <Link to="/ferramentas/$slug" params={{ slug: "calculadora-de-area" }} className="font-semibold text-primary underline">Calculadora de Área em m²</Link>.</p>),
  },
};
