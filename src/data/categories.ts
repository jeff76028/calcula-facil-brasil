export type CategorySlug = "matematica" | "financas" | "casa-e-construcao" | "cotidiano" | "produtividade";

export interface Category {
  slug: CategorySlug;
  name: string;
  shortDescription: string;
  description: string;
  /** Tailwind classes using design tokens */
  colorClass: string;
  softClass: string;
}

export const categories: Category[] = [
  {
    slug: "matematica",
    name: "Matemática",
    shortDescription: "Porcentagem, regra de três, médias e cálculos do dia a dia.",
    description:
      "Calculadoras matemáticas gratuitas para resolver porcentagens, regra de três e médias de forma rápida, direto no navegador.",
    colorClass: "text-cat-matematica",
    softClass: "bg-cat-matematica/10",
  },
  {
    slug: "financas",
    name: "Finanças",
    shortDescription: "Descontos, juros, metas de economia e divisão de despesas.",
    description:
      "Ferramentas financeiras gratuitas para calcular descontos, juros compostos, metas de economia, divisão de contas e custos de viagem.",
    colorClass: "text-cat-financas",
    softClass: "bg-cat-financas/10",
  },
  {
    slug: "casa-e-construcao",
    name: "Casa e Construção",
    shortDescription: "Área, pisos, tinta e consumo de energia para sua casa.",
    description:
      "Calculadoras para planejar reformas e o orçamento da casa: área em m², quantidade de pisos, quantidade de tinta e consumo de energia.",
    colorClass: "text-cat-casa",
    softClass: "bg-cat-casa/10",
  },
  {
    slug: "cotidiano",
    name: "Cotidiano",
    shortDescription: "Idade, datas, horas e conversão de unidades.",
    description:
      "Ferramentas práticas para o dia a dia: calcular idade, dias entre datas, somar horas e minutos e converter unidades de medida.",
    colorClass: "text-cat-cotidiano",
    softClass: "bg-cat-cotidiano/10",
  },
  {
    slug: "produtividade",
    name: "Produtividade",
    shortDescription: "Contador de palavras, formatação e tempo de leitura.",
    description:
      "Ferramentas de texto gratuitas para contar palavras, converter maiúsculas e minúsculas, estimar tempo de leitura e formatar textos.",
    colorClass: "text-cat-produtividade",
    softClass: "bg-cat-produtividade/10",
  },
];

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
