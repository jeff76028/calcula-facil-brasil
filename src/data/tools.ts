import type { CategorySlug } from "./categories";

/**
 * "em-breve": page exists (template), calculator not built yet → noindex + excluded from sitemap.
 * "disponivel": calculator implemented → indexable.
 */
export type ToolStatus = "em-breve" | "disponivel";

export interface Tool {
  slug: string;
  name: string;
  category: CategorySlug;
  shortDescription: string;
  keywords: string[];
  status: ToolStatus;
  popular?: boolean;
  /** Order in "recentes" (higher = newer) */
  addedOrder: number;
}

export const tools: Tool[] = [
  { slug: "calculadora-de-porcentagem", name: "Calculadora de Porcentagem", category: "matematica", shortDescription: "Calcule porcentagens, aumentos e reduções percentuais.", keywords: ["porcentagem", "percentual", "%"], status: "disponivel", popular: true, addedOrder: 1 },
  { slug: "regra-de-tres", name: "Regra de Três", category: "matematica", shortDescription: "Resolva regra de três simples de forma rápida.", keywords: ["proporção", "regra de 3"], status: "disponivel", popular: true, addedOrder: 2 },
  { slug: "calculadora-de-media", name: "Calculadora de Média", category: "matematica", shortDescription: "Calcule a média de uma lista de números.", keywords: ["média", "nota", "média aritmética"], status: "disponivel", addedOrder: 3 },
  { slug: "calculadora-de-desconto", name: "Calculadora de Desconto", category: "financas", shortDescription: "Descubra o preço final com desconto.", keywords: ["desconto", "promoção", "preço"], status: "disponivel", popular: true, addedOrder: 4 },
  { slug: "calculadora-de-juros-compostos", name: "Calculadora de Juros Compostos", category: "financas", shortDescription: "Simule o crescimento de um valor com juros compostos.", keywords: ["juros", "investimento", "rendimento"], status: "disponivel", popular: true, addedOrder: 5 },
  { slug: "meta-de-economia", name: "Meta de Economia", category: "financas", shortDescription: "Planeje quanto guardar para atingir um objetivo.", keywords: ["poupar", "economizar", "objetivo"], status: "em-breve", addedOrder: 6 },
  { slug: "divisao-de-contas", name: "Divisão de Contas", category: "financas", shortDescription: "Divida a conta entre amigos de forma justa.", keywords: ["dividir conta", "rachar", "restaurante"], status: "em-breve", addedOrder: 7 },
  { slug: "custo-de-viagem", name: "Custo de Viagem", category: "financas", shortDescription: "Estime o gasto com combustível em uma viagem.", keywords: ["combustível", "gasolina", "viagem"], status: "em-breve", addedOrder: 8 },
  { slug: "calculadora-de-area", name: "Área em m²", category: "casa-e-construcao", shortDescription: "Calcule a área de um ambiente em metros quadrados.", keywords: ["metro quadrado", "m2", "área"], status: "em-breve", popular: true, addedOrder: 9 },
  { slug: "quantidade-de-pisos", name: "Quantidade de Pisos", category: "casa-e-construcao", shortDescription: "Estime quantos pisos você precisa comprar.", keywords: ["piso", "porcelanato", "revestimento"], status: "em-breve", addedOrder: 10 },
  { slug: "quantidade-de-tinta", name: "Quantidade de Tinta", category: "casa-e-construcao", shortDescription: "Estime a quantidade de tinta para pintar paredes.", keywords: ["tinta", "pintura", "parede"], status: "em-breve", addedOrder: 11 },
  { slug: "consumo-de-energia", name: "Consumo de Energia", category: "casa-e-construcao", shortDescription: "Estime o consumo e o custo de aparelhos elétricos.", keywords: ["kwh", "luz", "conta de energia"], status: "em-breve", popular: true, addedOrder: 12 },
  { slug: "calculadora-de-idade", name: "Calculadora de Idade", category: "cotidiano", shortDescription: "Descubra a idade exata a partir da data de nascimento.", keywords: ["idade", "aniversário", "nascimento"], status: "em-breve", addedOrder: 13 },
  { slug: "dias-entre-datas", name: "Dias entre Datas", category: "cotidiano", shortDescription: "Conte quantos dias existem entre duas datas.", keywords: ["datas", "prazo", "contagem de dias"], status: "em-breve", addedOrder: 14 },
  { slug: "calculadora-de-horas", name: "Horas e Minutos", category: "cotidiano", shortDescription: "Some e subtraia horas e minutos.", keywords: ["horas", "minutos", "jornada"], status: "em-breve", addedOrder: 15 },
  { slug: "conversor-de-unidades", name: "Conversor de Unidades", category: "cotidiano", shortDescription: "Converta medidas de comprimento, peso e mais.", keywords: ["converter", "metro", "quilo"], status: "em-breve", addedOrder: 16 },
  { slug: "contador-de-palavras", name: "Contador de Palavras", category: "produtividade", shortDescription: "Conte palavras, caracteres e parágrafos de um texto.", keywords: ["caracteres", "palavras", "texto"], status: "em-breve", popular: true, addedOrder: 17 },
  { slug: "conversor-de-maiusculas-e-minusculas", name: "Maiúsculas e Minúsculas", category: "produtividade", shortDescription: "Converta textos para maiúsculas, minúsculas e mais.", keywords: ["caixa alta", "caixa baixa", "capitalizar"], status: "em-breve", addedOrder: 18 },
  { slug: "tempo-de-leitura", name: "Tempo de Leitura", category: "produtividade", shortDescription: "Estime quanto tempo leva para ler um texto.", keywords: ["leitura", "minutos de leitura"], status: "em-breve", addedOrder: 19 },
  { slug: "formatador-de-texto", name: "Formatador de Texto", category: "produtividade", shortDescription: "Remova espaços extras e organize seu texto.", keywords: ["limpar texto", "espaços", "formatar"], status: "em-breve", addedOrder: 20 },
];

export const getTool = (slug: string) => tools.find((t) => t.slug === slug);
export const toolsByCategory = (slug: string) => tools.filter((t) => t.category === slug);
export const popularTools = () => tools.filter((t) => t.popular);
export const recentTools = (n = 6) => [...tools].sort((a, b) => b.addedOrder - a.addedOrder).slice(0, n);

const normalize = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export function searchTools(query: string): Tool[] {
  const q = normalize(query.trim());
  if (!q) return [];
  return tools.filter((t) =>
    [t.name, t.shortDescription, ...t.keywords].some((f) => normalize(f).includes(q)),
  );
}
