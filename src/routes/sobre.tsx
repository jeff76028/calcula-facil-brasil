import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/site/StaticPage";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/sobre")({
  head: () => pageHead({ title: "Sobre o Conta Gênio", description: "Conheça o Conta Gênio, portal brasileiro de calculadoras e ferramentas online gratuitas.", path: "/sobre" }),
  component: () => (
    <StaticPage title="Sobre" intro="Ferramentas simples para contas do dia a dia.">
      <p>O Conta Gênio reúne calculadoras e ferramentas online gratuitas, sem cadastro. Todos os cálculos acontecem no seu navegador e os valores digitados não são armazenados.</p>
      <p>Os resultados são estimativas e não substituem a orientação de um profissional.</p>
    </StaticPage>
  ),
});
