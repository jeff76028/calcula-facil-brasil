export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string; // ISO date
  relatedTools: string[];
  /** Simple paragraphs; headings start with "## " */
  body: string[];
}

export const articles: Article[] = [
  {
    slug: "como-usar-calculadoras-online",
    title: "Como aproveitar calculadoras online no dia a dia",
    excerpt: "Dicas práticas para usar ferramentas gratuitas e evitar erros comuns em contas rápidas.",
    publishedAt: "2026-11-01",
    relatedTools: ["calculadora-de-porcentagem", "regra-de-tres"],
    body: [
      "Calculadoras online ajudam a resolver contas do cotidiano sem precisar de papel, planilha ou aplicativo instalado.",
      "## Confira as unidades",
      "Antes de calcular, verifique se todos os valores estão na mesma unidade. Misturar centímetros com metros, por exemplo, é uma das causas mais comuns de resultados errados.",
      "## Revise os valores digitados",
      "Uma vírgula no lugar errado muda completamente o resultado. Vale a pena conferir os números antes de confiar na resposta.",
      "## Use o resultado como apoio",
      "Para decisões importantes, como financiamentos ou obras, use as calculadoras como estimativa inicial e confirme com um profissional.",
    ],
  },
  {
    slug: "planejando-uma-reforma",
    title: "Planejando uma reforma: por onde começar as contas",
    excerpt: "Medir os ambientes corretamente é o primeiro passo para estimar materiais.",
    publishedAt: "2026-11-01",
    relatedTools: ["calculadora-de-area", "quantidade-de-pisos", "quantidade-de-tinta"],
    body: [
      "Toda reforma começa com medidas. Com as dimensões dos ambientes em mãos, fica mais fácil estimar materiais e conversar com fornecedores.",
      "## Meça cada ambiente separadamente",
      "Anote largura e comprimento de cada cômodo. Ambientes irregulares podem ser divididos em partes menores e somados depois.",
      "## Considere perdas",
      "Fabricantes e lojistas costumam recomendar uma margem extra de material para cortes e quebras. Consulte a recomendação do produto escolhido.",
    ],
  },
  {
    slug: "organizando-textos-com-ferramentas",
    title: "Ferramentas de texto que economizam tempo",
    excerpt: "Contar palavras, ajustar maiúsculas e limpar formatação pode ser feito em segundos.",
    publishedAt: "2026-11-01",
    relatedTools: ["contador-de-palavras", "conversor-de-maiusculas-e-minusculas", "formatador-de-texto"],
    body: [
      "Quem escreve com frequência — estudantes, redatores ou profissionais — sabe que pequenos ajustes de texto consomem tempo.",
      "## Limites de caracteres",
      "Redes sociais, formulários e trabalhos acadêmicos costumam ter limites. Um contador de palavras ajuda a ajustar o texto sem adivinhação.",
      "## Padronização",
      "Converter títulos para o mesmo padrão de maiúsculas e remover espaços extras deixa o texto com aparência mais profissional.",
    ],
  },
];

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);

export const formatDate = (iso: string) =>
  new Date(iso + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
